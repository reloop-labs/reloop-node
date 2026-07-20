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

Invalid arguments (e.g. empty key id or name) throw `ReloopValidationError` **before** any network request.

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
const { apiKey, apiKeyError } = await reloop.apiKey.create({
  name: "Production Key",
});
if (apiKeyError) throw apiKeyError;

console.log(apiKey.id, apiKey.key);
```

## Contact properties

Manage custom properties with `reloop.contacts.properties`:

| Method | Purpose |
|--------|---------|
| `create({ name, type, fallbackValue? })` | Create a property |
| `list(params?)` | List / filter properties |
| `update(id, { fallbackValue })` | Update fallback value |
| `delete(id)` | Delete a property |

```typescript
const { property, propertyError } = await reloop.contacts.properties.create({
  name: "company_name",
  type: "string",
  fallbackValue: "Unknown",
});
if (propertyError) throw propertyError;

console.log(property.id, property.propertyName);
```

## Groups

Manage groups with `reloop.contacts.groups`:

| Method | Purpose |
|--------|---------|
| `create({ name })` | Create a group |
| `list(params?)` | List / search groups |
| `get(id)` | Get one group |
| `update(id, { name })` | Rename |
| `delete(id)` | Delete a group |
| `listContacts(id, params?)` | List contacts in a group |
| `addContact(id, { contact_id? \| email? })` | Add a contact |
| `removeContact(id, { contact_id? \| email? })` | Remove a contact |

```typescript
const { group, groupError } = await reloop.contacts.groups.create({
  name: "Beta Testers",
});
if (groupError) throw groupError;

console.log(group.id, group.name);
```

## Channels

Manage channels with `reloop.contacts.channels`:

| Method | Purpose |
|--------|---------|
| `create({ name, description?, defaultSubscription?, visibility? })` | Create a channel |
| `list(params?)` | List channels |
| `get(id)` | Get one channel |
| `update(id, params)` | Update name / description / visibility |
| `delete(id)` | Delete a channel |
| `addContact(id, { contact_id? \| email?, subscription? })` | Enroll a contact |
| `updateSubscription(id, { contact_id? \| email?, subscription })` | Update enrollment |

```typescript
const { channel, channelError } = await reloop.contacts.channels.create({
  name: "Product Updates",
  description: "Get the latest news about our products",
  defaultSubscription: "opt_in",
  visibility: "public",
});
if (channelError) throw channelError;

console.log(channel.id, channel.name);
```

More examples: [reloop.sh/docs](https://reloop.sh/docs)

## License

Licensed under the [Apache License 2.0](./LICENSE) with additional use restrictions from Reloop Labs (same as the [Reloop project](https://github.com/reloop-labs/reloop/blob/main/LICENSE)).
