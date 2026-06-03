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

## Breaking changes (1.2.0)

- `reloop.apiKeys` was renamed to **`reloop.apiKey`** to match the API docs.

## API Key Management

The SDK supports full CRUD and lifecycle management for API keys.

### List API Keys

```typescript
const response = await reloop.apiKey.list({ page: 1, limit: 10 });
console.log(response.apiKeys);
console.log(response.total);
```

### Create an API Key

```typescript
const newKey = await reloop.apiKey.create({ name: "Production Key" });
console.log(newKey.key); // Secret key (only returned on create or rotate)
```

### Get an API Key

```typescript
const key = await reloop.apiKey.get("key_id_here");
```

### Update an API Key

```typescript
const updatedKey = await reloop.apiKey.update("key_id_here", { name: "New Name" });
```

### Delete an API Key

```typescript
await reloop.apiKey.delete("key_id_here");
```

### Lifecycle operations

```typescript
// Rotate secret while keeping the same key ID
const rotatedKey = await reloop.apiKey.rotate("key_id_here");

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
const domain = await reloop.domain.create({
  domain: "send.example.com",
  custom_return_path: "inbound",
  click_tracking: true,
  open_tracking: true,
  tls: "opportunistic",
  sending_email: true,
  receiving_email: true,
});
```

### List domains

```typescript
const response = await reloop.domain.list({ page: 1, limit: 10, status: "active" });
console.log(response.domains);
```

### Get, update, and delete

```typescript
const domain = await reloop.domain.get("domain_id_here");

await reloop.domain.update("domain_id_here", {
  click_tracking: false,
  sending_email: true,
});

await reloop.domain.delete("domain_id_here");
```

### Verify DNS and forward records

```typescript
const status = await reloop.domain.verify("domain_id_here");

await reloop.domain.forwardDns("domain_id_here", {
  email: "admin@example.com",
});
```

## Webhooks

Create endpoints, manage status, inspect deliveries, and retry failed attempts.

### Create a webhook

```typescript
const webhook = await reloop.webhook.create({
  description: "Production notifications",
  url: "https://example.com/webhooks/reloop",
  events: ["domain.create", "email.sent"],
});
console.log(webhook.secret); // Full secret returned on create only
```

### List, get, update, and delete

```typescript
const { webhooks } = await reloop.webhook.list({ page: 1, limit: 10 });

const one = await reloop.webhook.get("wh_id_here");

await reloop.webhook.update("wh_id_here", { maxRetries: 5 });

await reloop.webhook.delete("wh_id_here");
```

### Status (pause / enable / disable)

```typescript
await reloop.webhook.pause("wh_id_here");
await reloop.webhook.enable("wh_id_here");
await reloop.webhook.disable("wh_id_here");
```

### Trigger, deliveries, and retry

```typescript
await reloop.webhook.trigger({
  event: "domain.create",
  payload: { id: "dom_123", domain: "send.example.com" },
});

const { deliveries } = await reloop.webhook.listDeliveries("wh_id_here", {
  status: "failed",
});

await reloop.webhook.retryDelivery("delivery_id_here");
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

## TypeScript Support

The SDK is written in TypeScript and ships type definitions. Import types such as `ApiKey`, `Domain`, and `ApiKeyListResponse` from the package.

```typescript
import type {
  ApiKey,
  Domain,
  Webhook,
  WebhookEvent,
  ApiKeyListResponse,
} from "reloop-email";
```

## License

ISC
