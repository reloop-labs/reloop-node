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
  apiKey: "rl_your_api_key_here"
});
```

## API Key Management

The SDK supports full CRUD and lifecycle management operations for API Keys.

### List API Keys
```typescript
const response = await reloop.apiKeys.list({ page: 1, limit: 10 });
console.log(response.data); // Array of API keys
console.log(response.total); // Total count
```

### Create an API Key
```typescript
const newKey = await reloop.apiKeys.create({ name: "Production Key" });
console.log(newKey.key); // The actual secret key (only returned on creation or rotation)
```

### Get an API Key
```typescript
const key = await reloop.apiKeys.get("api_key_id_here");
```

### Update an API Key
```typescript
const updatedKey = await reloop.apiKeys.update("api_key_id_here", { name: "New Name" });
```

### Delete an API Key
```typescript
await reloop.apiKeys.delete("api_key_id_here");
```

### Lifecycle Operations
```typescript
// Rotate the secret of an API key while keeping the same ID
const rotatedKey = await reloop.apiKeys.rotate("api_key_id_here");

// Temporarily disable an API key
await reloop.apiKeys.disable("api_key_id_here");

// Re-enable an API key
await reloop.apiKeys.enable("api_key_id_here");
```

## TypeScript Support

The SDK is written in TypeScript and provides comprehensive type definitions out of the box. Types such as `ApiKey`, `ApiKeyWithKey`, and `PaginatedResponse` can be imported directly from the package.

```typescript
import type { ApiKey } from "reloop-email";
```

## License

ISC
