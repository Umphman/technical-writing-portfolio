# Separate login credentials from application sessions

**Source:** a fictional exercise created with Codex for this portfolio.

An identity provider can recognize a user before your application has established a session for that user. Keeping those states distinct makes it easier to decide which credential belongs at each boundary.

In this tutorial, you will run a fictional dashboard authentication example, read a user's saved views, and observe rejected requests. You will also check what happens when an identity credential expires and when the user logs out.

**Audience:** developers who understand JavaScript functions and want to reason about authentication boundaries. No previous knowledge of an authentication SDK is required.

**Scope:** this is an in-process mock authentication learning fixture, not a production OAuth or OpenID Connect implementation. It has no real login, browser, server, external provider, or credentials. The mock issuer's `issue()` method stands in for a completed login; it does not authenticate a person.

## Before you begin

Use Node.js 22.18 or later and a terminal opened at the portfolio directory. Check your version:

```text
node --version
```

The example uses only Node.js built-in modules. You do not need to install packages, configure environment variables, or create an account.

The source is split into a [fixture](../examples/auth/auth.mjs), a [runnable demonstration](../examples/auth/demo.mjs), and [tests](../examples/auth/auth.test.mjs). All names and saved views are fictional.

## Run the complete flow

From the portfolio directory, run:

```text
node examples/auth/demo.mjs
```

Expected output:

<!-- verified-output: demo:auth -->
```text
1. Mock login: identity credential issued for Alice.
2. Direct resource request: 401 INVALID_SESSION.
3. Exchange: application session created.
4. Alice's saved views: Service overview.
5. Bob's saved views: Queue overview.
6. Expired identity exchange: 401 EXPIRED_IDENTITY.
7. Existing application session: still valid.
8. After logout: 401 INVALID_SESSION.
```

These are local function calls. The `401` values describe authentication rejections in the fixture; they are not HTTP responses from a running service. The demo asserts each expected rejection and fails if the behavior differs.

Credential values are generated afresh in memory and omitted from output. The clock starts at a fixed instant, so repeated runs print the same result without waiting for real time to pass.

## Follow the credential boundary

Open the demonstration and find:

```javascript
const identity = issuer.issue('alice');
```

The issuer creates an opaque identity credential and remembers its subject, intended application, and expiry. The application trusts one specific issuer object. A credential created by a different mock issuer is unknown to that trusted issuer, even if it claims the same fictional subject.

The next request deliberately uses the wrong credential:

```javascript
app.readSavedViews(identity);
```

It fails because the application's session store has no matching entry. The application does not infer access from a credential's prefix or from a user ID supplied by the caller.

The exchange establishes the application session:

```javascript
const session = app.exchange(identity);
const views = app.readSavedViews(session);
```

During exchange, the application asks its configured issuer to verify the identity credential for the `demo-dashboard` audience. Verification rejects unknown, expired, or incorrectly targeted credentials. Only then does the application create its own opaque session value.

| Value | Accepted by | Used for |
|---|---|---|
| Identity credential | The configured mock issuer during exchange | Establishing the fictional user's identity |
| Application session | The application's resource methods | Selecting the authenticated user's saved views |

The source uses separate in-memory stores to make this distinction visible. Real systems can implement different credential formats and validation mechanisms; this example does not prescribe a protocol or storage design.

## Check ownership and lifetime

Alice receives `Service overview`; Bob receives `Queue overview`. The resource method derives the owner from the validated session. It accepts no separate user identifier that a caller could replace to request another user's data.

Next, the demo advances its clock by 60 seconds. Alice's identity credential has reached its expiry and cannot establish another session. Her existing application session remains valid because it has its own five-minute lifetime.

Those lifetimes are choices made for this fixture. They demonstrate independent state, not recommended production durations. Advancing the fixture clock does not change your computer's clock.

Finally, `app.logout(session)` removes Alice's session from the application's store. Reusing it fails immediately. Bob's separate session remains valid. Logout here revokes one application session; it does not end an identity-provider session or prevent a subsequent login.

## Run the boundary tests

Run the focused test file:

```text
node --test examples/auth/auth.test.mjs
```

Expect 11 passing tests and no failures. Node's output formatting and timing vary by version.

The suite checks successful exchange, unknown and tampered credentials, the intended application, incorrect credential types, exact expiry boundaries, user isolation, protection against mutation of returned records, and logout. These are executable checks of the learning fixture. They do not verify a real provider, browser integration, deployment, or production authentication system.

## Troubleshoot unexpected results

| Symptom | Check |
|---|---|
| `node` is not recognized | Install a supported Node.js release and reopen the terminal. |
| Node cannot find `examples/auth/demo.mjs` | Open the terminal at the portfolio directory, rather than inside `samples`. |
| `INVALID_SESSION` appears on the first resource attempt | This is expected: the demonstration intentionally passes an identity credential. |
| A modified example returns `EXPIRED_IDENTITY` | Check whether its fixture clock has advanced at least 60 seconds since issuance. Start a fresh fixture to reset local state. |
| Tests fail after an edit | Read the failing assertion and compare the relevant boundary with the table above. Rerun the focused test file after the correction. |

## About this sample

This is a newly created synthetic portfolio sample developed with AI assistance. The procedure and tests provide a reproducible way to review its claims. It does not reproduce private repository code or claim historical production use, adoption, or user outcomes.

The exercise deliberately omits browser storage, transport security, credential signatures, provider discovery, account recovery, and operational session management. A real integration requires the provider's supported protocol and libraries, with requirements specific to that application.
