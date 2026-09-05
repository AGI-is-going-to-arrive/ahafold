# The Lantern ticket desk: responses, effects, and uncertain bookings

Lantern is a fictional community performance booking system described for teaching. All names, identifiers, timestamps, and event records below are original examples. The rules are a supplied hypothetical contract, not a claim about a real payment provider. A reservation allocates seats; this example neither collects money nor contacts a real service. The interesting problem is deciding what a client knows when its network request does not end neatly.

## One intention can outlive one network attempt

**R01 — Three distinct things.** A booking intention is a person's decision to request particular seats. An HTTP attempt carries that intention to the server. A durable reservation is a committed server record that consumes those seats. Several attempts can represent one intention. A successful response can describe a reservation that already existed before this particular attempt arrived. Counting requests, successful responses, or callbacks is therefore not a reliable way to count reservations.

**R02 — The intention record.** Before sending anything, the client stores an intention identifier, the exact UTF-8 request body, an idempotency key, and the key's creation time in its durable local ledger. The ledger is part of this hypothetical system, not an instruction to implement storage or a service. Its purpose here is to preserve what the user meant across a client restart. A failed ledger write prevents dispatch. A restart resumes only after reading and checking the existing record; it does not invent a new key for a still-uncertain intention.

**R03 — Stable identity.** For one intention, every retry uses the same key and the exact same body bytes. The server binds a key to those bytes, not merely to visually similar JSON. Changes in seat choice, attendee name, or JSON property order require an explicit new intention, but an unresolved earlier intention must first be reconciled. Reusing a key with different bytes returns a `409 KEY_PAYLOAD_MISMATCH` and creates no new reservation for the conflicting attempt. The client stops and investigates instead of retrying that conflict.

```json
{
  "intentionId": "intent_lantern_autumn_matinee_20261017_balcony_row_C_seats_07_08_family_group_000042",
  "idempotencyKey": "idem_lantern_autumn_matinee_20261017_balcony_row_C_seats_07_08_family_group_000042",
  "bodyUtf8": "{\"performanceId\":\"lantern-autumn-matinee-2026-10-17\",\"seatIds\":[\"C07\",\"C08\"],\"attendeeName\":\"Mina Patel\"}",
  "keyCreatedAt": "2026-10-01T10:00:00Z"
}
```

**R04 — Bounded server memory.** From the first accepted request, the server retains the key binding and final outcome for 24 hours. Concurrent requests with the same key are serialized: at most one reservation is committed, and later accepted attempts receive the stored outcome. A request still processing can return `202 PENDING`; this is an acknowledgment, not proof of a committed reservation. The 24-hour retention boundary is not an eternal exactly-once guarantee. For safety, this client stops automatic retry at 24 hours after the earlier local key creation time, even if the server may have accepted the first request later.

## A missing response leaves a gap in knowledge

**R05 — The uncertain timeout.** The server may commit a reservation and then lose the connection before its response reaches the client. A timeout or network disconnect consequently means the outcome is unknown. It does not establish that the reservation failed, that seats remain free, or that another fresh booking is safe. The client marks the intention `UNKNOWN`, keeps the original identity, and can retry only within the bounded policy below.

**R06 — Durable effect versus delivery.** A final `201 RESERVED` includes a reservation identifier and the server's current reservation revision. It confirms a durable reservation for this intention. Replaying a completed key may return `200 RESERVED` with that same identifier, even though this attempt allocated no additional seats. `202 PENDING` confirms only continued processing. A later `reservation.created` callback is another delivery channel for a committed fact; receiving both the response and callback must not create two local bookings.

**R07 — Defined negative responses.** In this contract, `400 INVALID_REQUEST` is final for that submitted body and causes no reservation. `429 RATE_LIMITED` rejects that attempt before reservation processing and supplies a valid integer `Retry-After` in seconds. A `503 TEMPORARILY_UNAVAILABLE` may occur before or after work starts, so its effect is unknown. These meanings belong to this fictional contract; the text does not assert that every real API uses the same status semantics.

## A small retry budget with explicit assumptions

**R08 — Four attempts total.** The automatic policy permits the original attempt plus at most three retries: four attempts, not four retries. Count dispatches durably before sending, so restarting the application does not reset the budget. The base waits before attempts two, three, and four are 1, 2, and 4 seconds. They begin after the previous attempt finishes or times out. Waiting does not itself consume an attempt. A pending asynchronous operation is handled by reconciliation rather than immediately dispatching another booking request.

**R09 — Rate limiting has priority.** After a retryable `429`, the next wait is the greater of the base wait for the upcoming attempt and that response's `Retry-After`. For example, after attempt two, the next base wait is 2 seconds; a `Retry-After: 6` means wait 6 seconds. Do not add the two waits together. If the required wait would reach or pass the conservative key-expiry time, stop automatic retry and reconcile instead. A supplied zero delay never removes the base wait.

**R10 — Deliberately fixed timing.** The teaching schedule assumes every attempt takes exactly 0.5 seconds to reach its response or timeout, clocks are stable, and there is no jitter. Starting at `t = 0`, three retryable timeouts followed by a final success produce attempt starts at 0, 1.5, 4, and 8.5 seconds; the last response arrives at 9 seconds. Real systems need to account for variable latency, clock uncertainty, cancellation, and often jitter. Those are caveats, not extra terms secretly added to the supplied schedule.

| Observation from an attempt | Known effect under this contract | Automatic next action |
| --- | --- | --- |
| `201 RESERVED` or replayed `200 RESERVED` | Reservation committed | Record the same reservation identity; stop dispatching |
| `202 PENDING` | Processing acknowledged; final result unknown | Reconcile status; do not consume another attempt immediately |
| Timeout, disconnect, or `503` | Unknown | Retry the same identity if budget and time allow |
| `429` with valid `Retry-After` | This attempt made no reservation | Respect the longer wait, then retry if allowed |
| `400 INVALID_REQUEST` | This body made no reservation | Stop; show the validation problem |
| `409 KEY_PAYLOAD_MISMATCH` | Conflicting attempt made no reservation | Stop and investigate the identity conflict |
| Missing or malformed required fields | Untrusted or incomplete evidence | Keep unresolved; reconcile or escalate |

## Callbacks arrive in their own order

**R11 — Event identity is not booking identity.** Every callback has an `eventId`, `reservationId`, `intentionId`, and integer `revision`. A redelivery repeats the same event identifier. The receiver records processed event IDs and reservation revisions durably. It acknowledges the delivery only after that ledger update succeeds. Failure to save must not be reported as successful processing; the sender may deliver the event again. Event delivery can duplicate even when the reservation itself was committed only once.

**R12 — Revision, not arrival order.** For one reservation, a callback with a lower revision than the stored revision cannot overwrite newer state. The same revision with conflicting state is an inconsistency requiring reconciliation. A gap in revisions may indicate missed events: the receiver obtains the current authoritative status before applying a transition that depends on missing history. A timestamp alone cannot safely order the local outcome. Revision numbers in separate reservations are not globally comparable.

The following delivery log concerns one reservation. The final line is an old fact delivered late, not a fresh restoration of cancelled seats.

```json
[
  {"delivery":1,"eventId":"evt_created_7001","reservationId":"res_lantern_C07_C08_7001","intentionId":"intent_lantern_autumn_matinee_20261017_balcony_row_C_seats_07_08_family_group_000042","revision":1,"type":"reservation.created"},
  {"delivery":2,"eventId":"evt_created_7001","reservationId":"res_lantern_C07_C08_7001","intentionId":"intent_lantern_autumn_matinee_20261017_balcony_row_C_seats_07_08_family_group_000042","revision":1,"type":"reservation.created"},
  {"delivery":3,"eventId":"evt_cancelled_7002","reservationId":"res_lantern_C07_C08_7001","intentionId":"intent_lantern_autumn_matinee_20261017_balcony_row_C_seats_07_08_family_group_000042","revision":2,"type":"reservation.cancelled"},
  {"delivery":4,"eventId":"evt_created_late_copy_7003","reservationId":"res_lantern_C07_C08_7001","intentionId":"intent_lantern_autumn_matinee_20261017_balcony_row_C_seats_07_08_family_group_000042","revision":1,"type":"reservation.created"}
]
```

**R13 — Authentication before interpretation.** A callback must pass the contract's signature and intention-to-reservation binding checks before entering that event flow. A plausible identifier or neatly formatted JSON does not establish authenticity. The case supplies no actual secret or signature algorithm, so it makes no claim to implement authentication. A response or callback that names a different intention must not silently replace the original record.

## Stop sending is different from prove failure

**R14 — Exhaustion leaves work to do.** After attempt four, an unknown result stays `UNKNOWN`; it is not relabeled `FAILED` merely to make the interface tidy. The client performs the contract's read-only status reconciliation using the original intention and key. This teaching contract supplies an authoritative status mechanism but no real endpoint. If status remains unknown, a person investigates. The client does not generate a new key, release a local promise of seats as if proven, or tell the user a reservation definitely exists.

**R15 — Expiry is a safety boundary.** The server may discard its key cache after retention ends. Retrying an old key then might no longer suppress a duplicate durable effect. The client therefore pauses dispatch and resolves the original intention before any explicit new intention. User cancellation of a local waiting screen similarly stops local retries but does not cancel a possible server reservation. A confirmed server-side cancellation is a distinct operation and is outside this retry policy.

**R16 — Narrow guarantees.** With the stated server contract, one accepted key within retention protects one exact body from duplicate reservation creation. It does not prove global exactly-once delivery, prevent every duplicate across new keys, guarantee seats are available, or bound how quickly a human resolves uncertainty. Understanding retries means tracking evidence and identity as carefully as counting seconds. The safest useful result can be an honest unresolved status with the original records preserved.
