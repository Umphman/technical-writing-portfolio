import { randomBytes } from 'node:crypto';

// This in-memory fixture teaches trust boundaries. It is not OAuth or OIDC,
// and its issue() method is a stand-in for a completed, trusted login.
const APPLICATION_AUDIENCE = 'demo-dashboard';
const IDENTITY_LIFETIME_MS = 60_000;
const SESSION_LIFETIME_MS = 300_000;

export class AuthError extends Error {
  constructor(code) {
    super(code);
    this.name = 'AuthError';
    this.status = 401;
    this.code = code;
  }
}

function opaqueValue(kind) {
  return `${kind}_${randomBytes(24).toString('base64url')}`;
}

function requireLiveEntry(entries, credential, now, invalidCode, expiredCode) {
  const entry = typeof credential === 'string' ? entries.get(credential) : undefined;
  if (!entry) throw new AuthError(invalidCode);
  if (now() >= entry.expiresAt) {
    entries.delete(credential);
    throw new AuthError(expiredCode);
  }
  return entry;
}

export function createMockIssuer(now) {
  const credentials = new Map();

  return Object.freeze({
    issue(subject, audience = APPLICATION_AUDIENCE) {
      if (subject !== 'alice' && subject !== 'bob') {
        throw new TypeError('Use a fictional fixture subject: alice or bob');
      }
      const credential = opaqueValue('identity');
      credentials.set(credential, {
        subject,
        audience,
        expiresAt: now() + IDENTITY_LIFETIME_MS,
      });
      return credential;
    },

    verify(credential, expectedAudience) {
      const entry = requireLiveEntry(
        credentials, credential, now, 'INVALID_IDENTITY', 'EXPIRED_IDENTITY',
      );
      if (entry.audience !== expectedAudience) {
        throw new AuthError('WRONG_AUDIENCE');
      }
      return { subject: entry.subject };
    },
  });
}

function createDemoApplication(trustedIssuer, now) {
  const sessions = new Map();
  const viewsByUser = new Map([
    ['alice', [{ id: 'view-a', title: 'Service overview' }]],
    ['bob', [{ id: 'view-b', title: 'Queue overview' }]],
  ]);

  function findSession(session) {
    return requireLiveEntry(
      sessions, session, now, 'INVALID_SESSION', 'EXPIRED_SESSION',
    );
  }

  return Object.freeze({
    exchange(identityCredential) {
      // The application calls its configured issuer. The caller cannot choose
      // a verifier or provide a claimed user ID for the new session.
      const identity = trustedIssuer.verify(identityCredential, APPLICATION_AUDIENCE);
      const session = opaqueValue('session');
      sessions.set(session, {
        subject: identity.subject,
        expiresAt: now() + SESSION_LIFETIME_MS,
      });
      return session;
    },

    readSavedViews(session) {
      const { subject } = findSession(session);
      // The authenticated session selects the owner; no user ID is accepted.
      return structuredClone(viewsByUser.get(subject) ?? []);
    },

    logout(session) {
      findSession(session);
      sessions.delete(session);
    },
  });
}

export function createLearningFixture() {
  // A fixed, manually advanced clock makes examples and expiry tests repeatable.
  let instant = Date.parse('2026-01-01T00:00:00Z');
  const now = () => instant;
  const issuer = createMockIssuer(now);
  const app = createDemoApplication(issuer, now);

  return Object.freeze({
    issuer,
    app,
    now,
    advance(milliseconds) {
      if (!Number.isSafeInteger(milliseconds) || milliseconds < 0) {
        throw new TypeError('Advance the fixture clock by nonnegative whole milliseconds');
      }
      instant += milliseconds;
    },
  });
}
