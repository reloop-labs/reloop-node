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

HTTP helpers use named result fields — they do not throw for API or network failures. Mail send returns `{ response, emailError }`; API keys use `{ apiKey, apiKeyError }`, and so on.

Invalid arguments (e.g. empty key id or name) throw `ReloopValidationError` **before** any network request.

## Send email

```typescript
const { response, emailError } = await reloop.mail.send({
  from: "Reloop <hello@your-verified-domain.com>",
  to: "user@example.com",
  subject: "Welcome to Reloop",
  html: "<p>Thanks for signing up.</p>",
  text: "Thanks for signing up.",
});

if (emailError) throw emailError;

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

## Contacts

Manage contacts with `reloop.contacts`:

| Method | Purpose |
|--------|---------|
| `create(params)` | Create a contact |
| `list(params?)` | List / search contacts |
| `get(id)` | Retrieve one contact |
| `update(id, params)` | Update a contact |
| `delete(id)` | Delete a contact |

```typescript
const { contact, contactError } = await reloop.contacts.create({
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  status: "subscribed",
});
if (contactError) throw contactError;

console.log(contact.id, contact.email);
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

## Domains

Manage sending domains with `reloop.domain`:

| Method | Purpose |
|--------|---------|
| `create({ domain, ... })` | Add a domain |
| `list(params?)` | List / search domains |
| `get(id)` | Get one domain |
| `update(id, params)` | Update tracking / TLS / send settings |
| `delete(id)` | Delete a domain |
| `verify(id)` | Start DNS verification |

```typescript
const { domain, domainError } = await reloop.domain.create({
  domain: "send.example.com",
  click_tracking: true,
  open_tracking: true,
  tls: "opportunistic",
  sending_email: true,
  receiving_email: false,
});
if (domainError) throw domainError;

console.log(domain.id, domain.domain);
```

More examples: [reloop.sh/docs](https://reloop.sh/docs)

## Webhooks

Manage outbound webhooks with `reloop.webhook` and verify incoming events locally (no HTTP call):

| Method | Purpose |
|--------|---------|
| `create({ description, url, events })` | Register a webhook |
| `list(params?)` | List webhooks |
| `get(id)` | Get one webhook |
| `update(id, params)` | Update settings / status |
| `delete(id)` | Delete a webhook |
| `pause(id)` / `enable(id)` / `disable(id)` | Status shortcuts |
| `trigger({ event, payload })` | Fire an event manually |
| `listDeliveries(id, params?)` | List delivery attempts |
| `retryDelivery(deliveryId)` | Retry a failed delivery |

```typescript
import { Reloop, WebhookService } from "reloop-email";

const reloop = new Reloop({ apiKey: "rl_your_api_key_here" });

const { webhook, webhookError } = await reloop.webhook.create({
  description: "Production webhook",
  url: "https://example.com/webhooks/reloop",
  events: ["domain.created"],
});
if (webhookError) throw webhookError;

// In your HTTP handler (Express, etc.):
const event = WebhookService.constructEvent(
  rawBody,
  req.headers["x-webhook-signature"],
  webhookSecret,
);
```

More examples: [reloop.sh/docs](https://reloop.sh/docs)

## License

Licensed under the [Apache License 2.0](./LICENSE) with additional use restrictions from Reloop Labs (same as the [Reloop project](https://github.com/reloop-labs/reloop/blob/main/LICENSE)).
