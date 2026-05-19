---
sidebar_position: 4
title: Errors
description: How CasaStudente reports failures across REST and Server Actions.
---

# Errors

CasaStudente uses two distinct error envelopes — one for REST, one for Server Actions — but both are stable and machine-readable.

## REST errors

REST endpoints return a JSON body with an `error` string and an appropriate HTTP status.

```json
{ "error": "Listing not found" }
```

Common statuses:

| Status | Meaning |
| ------ | ------- |
| `400` | Validation failed. The body may also include `field` and `details`. |
| `401` | No session, or session expired. |
| `403` | Authenticated but not authorised (wrong role). |
| `404` | Resource not found. |
| `409` | Conflict (e.g. duplicate email on register). |
| `422` | Business-rule violation (e.g. deposit > 3× rent). |
| `429` | Rate-limited. `Retry-After` header included. |
| `500` | Unexpected. Logged to Sentry. |

Validation errors include enough context to render an inline form message:

```json
{
  "error": "Validation failed",
  "field": "price",
  "details": "price must be between 100 and 5000"
}
```

## Server Action errors

Server Actions return a `FormState`:

```ts
type FormState<T = unknown> =
  | { ok: true; data?: T }
  | { ok: false; error: string; field?: string };
```

A typical failure surfaces in the UI like this:

```tsx
const [state, action, pending] = useActionState(createListingAction, { ok: false });

return (
  <form action={action}>
    <input name="price" />
    {state.field === 'price' && <p role="alert">{state.error}</p>}
  </form>
);
```

## Error codes you should handle

| Code | Where | What to do |
| ---- | ----- | ---------- |
| `unauthorized` | Both | Redirect to login. |
| `forbidden` | Both | Show an "insufficient permissions" message. |
| `validation_failed` | Both | Inline the message next to `field`. |
| `rate_limited` | Both | Backoff per `Retry-After` (or default 60s). |
| `stripe_unconfigured` | Server Actions | Inform the user payments are pending platform setup. |
| `university_unverified` | Server Actions | Send the user to `/onboarding/verify`. |

## Logging

Unhandled exceptions in API routes and Server Actions are forwarded to Sentry (if `SENTRY_DSN` is configured) and to the platform console. A correlation ID is returned in the `x-request-id` response header for support tickets.
