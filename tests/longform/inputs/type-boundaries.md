# 从 TypeScript 注解到不可信 JSON：一次请求的边界

这份原创材料讨论一个由题目提供的函数以及一个可选解析器。`/api/users/` 只是示例中的相对路径，用户资料、日志和域名均为虚构；讨论不需要访问任何接口。这里的目标读者能读简单代码，但容易把 IDE 中的绿色提示、HTTP 成功和数据可信混在一起。`compile time` 指工具检查源代码的阶段，`runtime` 指编译后的 JavaScript 实际执行时。二者协作，却观察不同的东西。

## 先保留这段函数的真实含义

**T01｜提供的原函数如下。** 它是分析对象，不包含输入格式修正或 JSON schema 校验。缩进与换行只是为了阅读。

```ts
type User = {
  id: string;
  name: string
};

async function loadUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return (await response.json()) as User;
}
```

**T02｜类型承诺来自哪里。** `id: string` 告诉 TypeScript 调用者应传入字符串，`Promise<User>` 告诉 TypeScript 正常完成的 Promise 被当作提供 `User`。这不是运行时的防护墙：普通 JavaScript 调用者、被绕过的检查或断言都可能带来不同值。本材料随后分析字符串输入的正常前提，不把原函数改称具备完整输入验证。

**T03｜断言的位置。** `as User` 是 TypeScript 的 type assertion，影响静态检查器对表达式的理解，在通常的 TypeScript 转译中被擦除。它不会在响应解析之后再执行第四个“断言成功”步骤，不会调用验证器，也不会增加或改写 JSON 字段。`type User` 和函数的类型注解同样不会变成相应的运行时对象检查。

**T04｜Promise 的两条结局。** `async` 函数总返回 Promise；函数体中的异常会使它拒绝。`Promise<User>` 只描述正常兑现值的静态类型，不表示请求、解析或业务逻辑必然成功。`await` 等待一个 Promise 的结果并可能重新抛出拒绝原因，不会替调用者捕获异常；调用者仍需决定怎么显示失败、记录问题或重试。

## 按运行时实际发生的事划分边界

**T05｜构造请求地址。** `encodeURIComponent(id)` 把字符串编码为适合放在单个 URL 路径片段中的形式。例如输入 `A/B ?` 得到 `A%2FB%20%3F`，不会把其中斜线直接拼成另一个路径层级。编码不是身份认证，不会证明调用者拥有查看这个用户的权限，也不清除响应 JSON 中的恶意内容；授权仍须由服务端及相应应用逻辑负责。

**T06｜等待 Response。** `fetch` 在网络错误或主动取消等情况下可能拒绝，届时还没有供下一行检查的 `Response`。HTTP 404、429 或 500 本身通常不会让 `fetch` 因状态码而拒绝，它们会产生一个 `Response`，再由原函数的 `response.ok` 分支处理。材料不宣称所有平台异常都能只归结为 HTTP；浏览器安全策略等也可能影响请求。

**T07｜检查 HTTP 状态。** `response.ok` 对 200 至 299 的状态码为真。原函数对非 2xx 抛出带状态码的错误，因此本次运行不会再调用 `response.json()`，即使错误响应体恰好是格式正确的 JSON。`ok` 检查不查看正文内容，也不能确认 `id` 和 `name` 的存在或类型。

**T08｜解析 JSON。** `response.json()` 读取正文并按 JSON 语法解析，返回一个 Promise。它不是“只要 Content-Type 写了 JSON 就成功”；200 状态的 HTML、损坏的 JSON 和 204 的空正文都可能在这里拒绝。JSON 解析成功只说明得到了合法 JSON 对应的 JavaScript 值，不说明这个值满足 `User` 的结构或业务要求。

**T09｜解析结果可能很普通，也可能完全不合用。** 合法 JSON 可以是对象、数组、字符串、数值、布尔值或 `null`。对于 200 响应中的 `null`，原函数会兑现 `null`；对于 `{"id":17,"name":false}`，原函数会兑现这份对象。`as User` 不会把 17 变成字符串或把 false 变成人名。稍后执行 `user.name.toUpperCase()` 才可能因实际值不适合而失败。

**T10｜编码表达式也有自己的边界。** 在传入普通字符串且编码成功的主要路径上，才会继续调用 `fetch`。某些含孤立 UTF-16 代理码元的字符串会让 `encodeURIComponent` 抛出 `URIError`，从而使这个 async 函数的 Promise 拒绝，且不会发起请求。因此，“所有错误都发生在服务器返回后”也不成立。这不改变原函数没有显式运行时输入校验的事实。

| 边界 | 成功说明了什么 | 尚未说明什么 |
| --- | --- | --- |
| TypeScript 检查通过 | 代码满足当前静态规则和已声明假设 | 外部 JSON 在运行时真实长相 |
| 地址编码完成 | 这个字符串已按 URI component 规则编码 | 身份、权限、用户一定存在 |
| `fetch` 兑现 | 拿到了一个 `Response` | HTTP 是 2xx、正文可解析、数据符合 `User` |
| `response.ok` 为真 | HTTP 状态是 200–299 | 正文是合法 JSON 或字段正确 |
| `response.json()` 兑现 | 正文被解析为合法 JSON 值 | 它一定是具备两个字符串字段的对象 |
| 下述 `parseUser` 返回 | 两个指定字段通过最小运行时结构检查 | 真实身份、授权、长度、非空和所有业务规则 |

## 一个明确可选的最小运行时解析器

**T11｜不同代码，不冒充原行为。** 如果产品要在入口处拒绝不符合结构的 JSON，可以另加下面的解析器，并把原函数最后一行替换为 `return parseUser(await response.json());`。这是建议的改动版本，不是 `as User` 原本偷偷完成的工作。类型收窄让 TypeScript 能理解通过检查后的字段，真正执行检查的仍是普通 JavaScript 条件。

```ts
function parseUser(value: unknown): User {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("Expected a user object");
  }

  if (
    !("id" in value) ||
    !("name" in value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string"
  ) {
    throw new Error("Expected string id and name");
  }

  return { id: value.id, name: value.name };
}
```

**T12｜检查对象时的细节。** JavaScript 的 `typeof null` 是 `"object"`，数组的 `typeof` 也为 `"object"`，所以上面的非空及 `Array.isArray` 检查都有独立意义。两个字段必须存在且实际值都是字符串，数值 17 即使可以转成文本，也会被这个解析器拒绝，因为它没有进行隐式或显式强制转换。

**T13｜故意有限的契约。** 该解析器允许空字符串，也允许输入包含额外字段；它返回一个只有 `id` 和 `name` 的新对象，不保留那些额外字段。它没有检查 ID 格式、显示名长度、姓名真实性、数据是否过期、当前用户权限或服务端签名。通过最小结构检查后仍可能需要业务验证，不能称为“所有数据已经安全可信”。

**T14｜数据来源与检查强度。** 这里解析器的预期输入是 `response.json()` 的结果，即从 JSON 文本产生的值。若把它作为接受任意 JavaScript 对象的通用安全库，`in` 会考虑继承属性，属性访问也可能触发 getter，因而需要另行定义更严格的契约。本文不提供这种通用库保证，也没有使用这个局限来否认它对给定 JSON 场景的结构检查价值。

## 受控响应记录：状态、语法和形状相互独立

**T15｜以下是虚构离线记录，不是已访问接口的日志。** `body` 是服务端发送的正文文本；网络失败那行没有响应。若显示同一个状态码两次，它们也可能因为正文不同走向不同结果。

```text
case alpha: status=200; body={"id":"u-17","name":"林 Ada"}
case beta:  status=404; body={"id":"u-17","name":"林 Ada"}
case gamma: status=200; body=<html><body>Sign in required</body></html>
case delta: status=204; body=<empty bytes, not the literal text shown here>
case epsilon: status=200; body=null
case zeta: status=200; body={"id":17,"name":false}
case eta: network disconnect before any Response exists
case theta: status=200; body={"id":"","name":"","role":"maintainer"}
```

原函数在 alpha 兑现两个字符串字段的对象，在 beta 抛出 `HTTP 404` 且不解析正文；gamma、delta 在 JSON 解析时拒绝。epsilon 与 zeta 会被原函数兑现，但可选解析器会拒绝它们。eta 在拿到 Response 之前拒绝。theta 的两个字段类型正确，即使都是空字符串，也会通过可选解析器；返回的新对象不含 `role`。这些区别来自给定代码，不依赖真实服务器是否上线。

## 长标识、错误展示和解释边界

**T16｜标识保持精确。** 例如 `user_import_2026_autumn_public_workshop_team_north_building_room_204_record_000000000017` 可以作为示例字符串；长不代表敏感，也不代表合法授权。`https://example.invalid/api/users/user_import_2026_autumn_public_workshop_team_north_building_room_204_record_000000000017?include=profile%2Cpreferences%2Cmembership&requestPurpose=offline_type_boundary_explanation` 是使用保留无效域名的阅读样例，不是调用地址，不应拿它代替原函数的相对 URL。

**T17｜原代码和新方案需要分别归因。** 给原函数配一句“收到合法用户数据才返回”，会把原本不存在的验证写进去。给可选解析器配一句“解决了一切网络错误”，又会超出它只检查值结构的职责。错误提示也应说清楚是请求未完成、HTTP 不成功、JSON 不可解析，还是结构不符；不能把它们全部显示成“类型断言失败”。

**T18｜编译器之外仍有运行时语言。** JavaScript 可以在页面加载时创建内容，可以按定时器更新内容，也可以处理用户互动，并非只在点击之后执行。HTML 的原生 `details` 元素本身能够展开收起，不要求 JavaScript。它们与 TypeScript 静态类型的关系是互补职责，不能将简化的角色比喻写成排他的能力清单。

**T19｜错误在哪个范围被捕获。** 若调用者把 `await loadUser(id)` 和后面的 `user.name.toUpperCase()` 放在同一个 `try` 内，`catch` 既可能接到加载过程的拒绝，也可能接到加载兑现后访问字段产生的异常。捕获到错误不自动证明问题来自网络。若只对 `loadUser(id)` 返回的 Promise 附加拒绝处理，后续独立语句的异常也不会因此被那个处理函数捕获。错误的类别需要结合实际抛出位置判断，不能仅按最终提示文字反推。

**T20｜静态修改与行为修改。** 只把某个表达式的静态类型改成更宽或更窄的声明，不会凭空改变服务端正文。相反，增加 `parseUser` 的实际条件分支，会让原本能兑现的错误结构在运行时拒绝。前者改变的是工具接受哪些写法，后者改变的是程序遇到某个具体值时做什么。这也解释了为什么修复编辑器报错与修复外部数据问题可以有关联，却不一定是同一次修复。

这段例子最后留下两条并行的理解线：一条是静态工具如何帮助编写和调用函数，另一条是运行时如何跨过地址、网络、HTTP、JSON 与值结构边界。指出每一步新增了哪种证据、还缺哪种证据，比把所有绿色状态都叫作“验证成功”更能解释为何代码可以通过编译，运行后却依然拿到不合用的数据。
