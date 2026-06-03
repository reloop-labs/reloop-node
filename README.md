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

## TypeScript Support

The SDK is written in TypeScript and ships type definitions. Import types such as `ApiKey`, `Domain`, and `ApiKeyListResponse` from the package.

```typescript
import type { ApiKey, Domain, ApiKeyListResponse } from "reloop-email";
```

## License

ISC
