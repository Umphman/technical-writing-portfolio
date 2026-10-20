import assert from 'node:assert/strict';
import { AuthError, createLearningFixture } from './auth.mjs';

function expectRejection(action, code) {
  let rejection;
  try {
    action();
  } catch (error) {
    rejection = error;
  }
  assert.ok(rejection instanceof AuthError, 'Expected an authentication rejection');
  assert.equal(rejection.code, code);
  return `${rejection.status} ${rejection.code}`;
}

const { issuer, app, advance } = createLearningFixture();
const identity = issuer.issue('alice');
console.log('1. Mock login: identity credential issued for Alice.');
console.log(`2. Direct resource request: ${expectRejection(
  () => app.readSavedViews(identity), 'INVALID_SESSION',
)}.`);

const session = app.exchange(identity);
console.log('3. Exchange: application session created.');
console.log(`4. Alice's saved views: ${app.readSavedViews(session).map(view => view.title).join(', ')}.`);

const bobSession = app.exchange(issuer.issue('bob'));
console.log(`5. Bob's saved views: ${app.readSavedViews(bobSession).map(view => view.title).join(', ')}.`);

advance(60_000);
console.log(`6. Expired identity exchange: ${expectRejection(
  () => app.exchange(identity), 'EXPIRED_IDENTITY',
)}.`);
assert.equal(app.readSavedViews(session)[0].title, 'Service overview');
console.log('7. Existing application session: still valid.');

app.logout(session);
console.log(`8. After logout: ${expectRejection(
  () => app.readSavedViews(session), 'INVALID_SESSION',
)}.`);
