# Reloop Node.js SDK

The official Node.js SDK for [Reloop](https://reloop.sh), providing a convenient wrapper around the Reloop REST API.

## Installation

Install the package via npm:

```bash
npm install reloop-email
```

## Getting Started

Initialize the client with your API key. You can find or generate your API key in the Reloop Dashboard.

```typescript
import { Reloop } from "reloop-email";

const reloop = new Reloop({
  apiKey: "rl_your_api_key_here",
});
```

## Error handling

Every API call resolves to a typed result — never throws for HTTP or network failures:

```typescript
const { response, error } = await reloop.contacts.create({
  email: "john@example.com",
});

if (error) {
  console.error(error.status, error.message, error.body);
  return;
}

console.log(response.id, response.email);
```

- **`response`** — typed success payload (`null` on failure)
- **`error`** — `ReloopApiError` with `status`, `statusText`, and `body` (`null` on success)

`ReloopApiError.body` includes API fields such as `message`, `why`, and `fix` when the server returns them.

```typescript
import { ReloopApiError, type ReloopResult, type ContactResponse } from "reloop-email";

const result: ReloopResult<ContactResponse> = await reloop.contacts.create({
  email: "john@example.com",
});

if (result.error) {
  // result.response is null
  throw result.error;
}

// result.error is null; result.response is ContactResponse
const contact = result.response;
```

## Breaking changes (1.7.0)

- All API methods now return **`{ response, error }`** instead of throwing or returning data directly. Check `error` before using `response`. See [Error handling](#error-handling).

## Breaking changes (1.6.0)

- `reloop.audience` was renamed to **`reloop.contacts`**. `AudienceService` / `AudienceGroupsService` are now `ContactsService` / `ContactGroupsService`.

## Breaking changes (1.2.0)

- `reloop.apiKeys` was renamed to **`reloop.apiKey`** to match the API docs.

## API Key Management

The SDK supports full CRUD and lifecycle management for API keys.

### List API Keys

```typescript
const { response, error } = await reloop.apiKey.list({ page: 1, limit: 10 });
if (error) throw error;
console.log(response.apiKeys);
console.log(response.total);
```

### Create an API Key

```typescript
const { response: newKey, error } = await reloop.apiKey.create({ name: "Production Key" });
if (error) throw error;
console.log(newKey.key); // Secret key (only returned on create or rotate)
```

### Get an API Key

```typescript
const { response: key, error } = await reloop.apiKey.get("key_id_here");
if (error) throw error;
```

### Update an API Key

```typescript
const { response: updatedKey, error } = await reloop.apiKey.update("key_id_here", {
  name: "New Name",
});
if (error) throw error;
```

### Delete an API Key

```typescript
const { error } = await reloop.apiKey.delete("key_id_here");
if (error) throw error;
```

### Lifecycle operations

```typescript
// Rotate secret while keeping the same key ID
const { response: rotatedKey, error: rotateError } =
  await reloop.apiKey.rotate("key_id_here");
if (rotateError) throw rotateError;

// Pause (disable) — key stops working until re-enabled
await reloop.apiKey.pause("key_id_here");
// equivalent: await reloop.apiKey.disable("key_id_here");

// Resume (enable)
await reloop.apiKey.enable("key_id_here");
```

## Domain management

Add and verify sending domains for your organization.

### Create a domain

```typescript
const { response: domain, error } = await reloop.domain.create({
  domain: "send.example.com",
  custom_return_path: "inbound",
  click_tracking: true,
  open_tracking: true,
  tls: "opportunistic",
  sending_email: true,
  receiving_email: true,
});
if (error) throw error;
```

### List domains

```typescript
const { response, error } = await reloop.domain.list({
  page: 1,
  limit: 10,
  status: "active",
});
if (error) throw error;
console.log(response.domains);
```

### Get, update, and delete

```typescript
const { response: domain, error: getError } =
  await reloop.domain.get("domain_id_here");
if (getError) throw getError;

const { error: updateError } = await reloop.domain.update("domain_id_here", {
  click_tracking: false,
  sending_email: true,
});
if (updateError) throw updateError;

const { error: deleteError } = await reloop.domain.delete("domain_id_here");
if (deleteError) throw deleteError;
```

### Verify DNS and forward records

```typescript
const { response: status, error: verifyError } =
  await reloop.domain.verify("domain_id_here");
if (verifyError) throw verifyError;

const { error: forwardError } = await reloop.domain.forwardDns("domain_id_here", {
  email: "admin@example.com",
});
if (forwardError) throw forwardError;
```

## Webhooks

Create endpoints, manage status, inspect deliveries, and retry failed attempts.

### Create a webhook

```typescript
const { response: webhook, error } = await reloop.webhook.create({
  description: "Production notifications",
  url: "https://example.com/webhooks/reloop",
  events: ["domain.create", "email.sent"],
});
if (error) throw error;
console.log(webhook.secret); // Full secret returned on create only
```

### List, get, update, and delete

```typescript
const { response: listResult, error: listError } = await reloop.webhook.list({
  page: 1,
  limit: 10,
});
if (listError) throw listError;

const { response: one, error: getError } = await reloop.webhook.get("wh_id_here");
if (getError) throw getError;

const { error: updateError } = await reloop.webhook.update("wh_id_here", {
  maxRetries: 5,
});
if (updateError) throw updateError;

const { error: deleteError } = await reloop.webhook.delete("wh_id_here");
if (deleteError) throw deleteError;
```

### Status (pause / enable / disable)

```typescript
await reloop.webhook.pause("wh_id_here");
await reloop.webhook.enable("wh_id_here");
await reloop.webhook.disable("wh_id_here");
```

### Trigger, deliveries, and retry

```typescript
const { error: triggerError } = await reloop.webhook.trigger({
  event: "domain.create",
  payload: { id: "dom_123", domain: "send.example.com" },
});
if (triggerError) throw triggerError;

const { response: deliveriesResult, error: deliveriesError } =
  await reloop.webhook.listDeliveries("wh_id_here", { status: "failed" });
if (deliveriesError) throw deliveriesError;

const { error: retryError } =
  await reloop.webhook.retryDelivery("delivery_id_here");
if (retryError) throw retryError;
```

### Receiving webhooks (verify signatures)

Reloop signs each delivery with HMAC-SHA256 (`X-Webhook-Signature: t=<unix>,v1=<hex>`). Store the signing secret from `create()` in env — it is **not** your Reloop API key.

Use the **raw request body** (`request.text()` in Next.js). Do not call `request.json()` before verifying.

```typescript
// src/app/api/webhook/route.ts
import { NextResponse } from "next/server";
import { WebhookService, WebhookSignatureVerificationError } from "reloop-email";

export async function POST(request: Request) {
  try {
    const payload = await request.text();

    const event = WebhookService.verify({
      payload,
      headers: {
        "x-webhook-signature": request.headers.get("x-webhook-signature"),
        "x-webhook-timestamp": request.headers.get("x-webhook-timestamp"),
      },
      secret: process.env.RELOOP_WEBHOOK_SECRET!,
    });

    if (event.event === "domain.create") {
      console.log("Domain created:", event.payload);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    if (err instanceof WebhookSignatureVerificationError) {
      return new NextResponse(err.message, { status: 400 });
    }
    throw err;
  }
}
```

Or with a client instance:

```typescript
const event = reloop.webhook.verify({ payload, headers, secret });
```

Stripe-style alias:

```typescript
const event = WebhookService.constructEvent(
  payload,
  request.headers.get("x-webhook-signature"),
  process.env.RELOOP_WEBHOOK_SECRET!,
);
```

Verified event fields: `event.id`, `event.event` (type), `event.payload`, `event.timestamp`.

## Contacts

Manage contacts, custom properties, and groups via `reloop.contacts`.

### Create a contact

```typescript
const { response: contact, error } = await reloop.contacts.create({
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  status: "subscribed",
  properties: { company_name: "Acme" },
  groupIds: ["grp_123456789"],
});
if (error) throw error;
```

### List, get, update, and delete contacts

```typescript
const { response: listResult, error: listError } = await reloop.contacts.list({
  page: 1,
  limit: 10,
});
if (listError) throw listError;

const { response: contact, error: getError } =
  await reloop.contacts.get("cont_123456789");
if (getError) throw getError;

const { error: updateError } = await reloop.contacts.update("cont_123456789", {
  firstName: "Jane",
  properties: { company_name: "Acme Corp" },
});
if (updateError) throw updateError;

const { error: deleteError } = await reloop.contacts.delete("cont_123456789");
if (deleteError) throw deleteError;
```

Pass `groupId` to `list()` to fetch contacts in a specific group:

```typescript
const { response: groupContacts, error } = await reloop.contacts.list({
  groupId: "grp_123456789",
  page: 1,
  limit: 10,
});
if (error) throw error;
```

### Custom properties

Define org-wide contact properties (string or number) with optional fallback values.

```typescript
const { response: property, error: createPropError } =
  await reloop.contacts.createProperty({
    name: "company_name",
    type: "string",
    fallbackValue: "Unknown",
  });
if (createPropError) throw createPropError;

const { response: propsList, error: listPropsError } =
  await reloop.contacts.listProperties({ page: 1, limit: 10 });
if (listPropsError) throw listPropsError;

const { error: updatePropError } = await reloop.contacts.updateProperty(
  "prop_123456789",
  { fallbackValue: "N/A" },
);
if (updatePropError) throw updatePropError;

const { error: deletePropError } =
  await reloop.contacts.deleteProperty("prop_123456789");
if (deletePropError) throw deletePropError;
```

### Groups

```typescript
const { response: group, error: createGroupError } =
  await reloop.contacts.createGroup({ name: "Beta Testers" });
if (createGroupError) throw createGroupError;

const { response: groupsList, error: listGroupsError } =
  await reloop.contacts.listGroups({ search: "beta" });
if (listGroupsError) throw listGroupsError;

const { response: one, error: getGroupError } =
  await reloop.contacts.getGroup("grp_123456789");
if (getGroupError) throw getGroupError;

const { error: updateGroupError } = await reloop.contacts.updateGroup(
  "grp_123456789",
  { name: "Early Access" },
);
if (updateGroupError) throw updateGroupError;

const { error: deleteGroupError } =
  await reloop.contacts.deleteGroup("grp_123456789");
if (deleteGroupError) throw deleteGroupError;
```

### Group membership

```typescript
const { error: addError } = await reloop.contacts.groups.addContact(
  "grp_123456789",
  { contact_id: "cont_123456789" },
);
if (addError) throw addError;

const { error: removeError } = await reloop.contacts.groups.removeContact(
  "grp_123456789",
  { email: "john.doe@example.com" },
);
if (removeError) throw removeError;

const { response: members, error: membersError } =
  await reloop.contacts.groups.listContacts("grp_123456789", {
    page: 1,
    limit: 10,
  });
if (membersError) throw membersError;
```

## TypeScript Support

The SDK is written in TypeScript and ships type definitions. Import types such as `ApiKey`, `Domain`, and `ApiKeyListResponse` from the package.

```typescript
import type {
  ApiKey,
  Contact,
  ContactGroup,
  ContactProperty,
  ContactResponse,
  Domain,
  ReloopApiError,
  ReloopResult,
  Webhook,
  WebhookEvent,
  ApiKeyListResponse,
} from "reloop-email";
```

## License

ISC
