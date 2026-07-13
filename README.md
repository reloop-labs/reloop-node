# Reloop Node.js SDK

Official npm package: **`reloop-email`**.

## Before you send

You need two things:

1. **API key** — create one in your Reloop account
2. **Verified domain** — add and verify a sending domain; use it in the `from` address

For setup details and the full API reference, see [reloop.sh/docs](https://reloop.sh/docs).

## Install

```bash
npm install reloop-email
```

## Initialize

Construction takes a required `apiKey` and an optional `baseUrl` (defaults to `https://reloop.sh`).

```typescript
import { Reloop } from "reloop-email";

const reloop = new Reloop({ apiKey: "rl_your_api_key_here" });

// Optional custom host:
// const reloop = new Reloop({ apiKey: "rl_...", baseUrl: "https://reloop.sh" });
```

HTTP helpers return `{ response, error }` — they do not throw for API or network failures.

## Send email

```typescript
const { response, error } = await reloop.mail.send({
  from: "Reloop <hello@your-verified-domain.com>",
  to: "user@example.com",
  subject: "Welcome to Reloop",
  html: "<p>Thanks for signing up.</p>",
  text: "Thanks for signing up.",
});

if (error) throw error;

console.log(response.messageId, response.id);
```

## API keys

Manage keys with `reloop.apiKey` (one method per API route):

| Method | Purpose |
|--------|---------|
| `create({ name })` | Create a key (secret returned once) |
| `list(params?)` | List / search keys |
| `get(id)` | Get one key |
| `update(id, { name })` | Rename |
| `delete(id)` | Delete |
| `rotate(id)` | Rotate secret (new secret once) |
| `enable(id)` / `disable(id)` | Toggle enabled state |

```typescript
const { response: key, error } = await reloop.apiKey.create({
  name: "Production Key",
});
if (error) throw error;

console.log(key.id, key.key); // copy the secret now
```

More examples: [reloop.sh/docs](https://reloop.sh/docs)

## License

Licensed under the [Apache License 2.0](./LICENSE) with additional use restrictions from Reloop Labs (same as the [Reloop project](https://github.com/reloop-labs/reloop/blob/main/LICENSE)).
