import assert from 'node:assert/strict';
import test from 'node:test';
import { AuthError, createLearningFixture, createMockIssuer } from './auth.mjs';

function rejects(action, code) {
  assert.throws(action, error => error instanceof AuthError
    && error.status === 401 && error.code === code);
}

test('a trusted identity exchanges for a separate application session', () => {
  const { issuer, app } = createLearningFixture();
  const identity = issuer.issue('alice');
  const session = app.exchange(identity);
  assert.notEqual(session, identity);
  assert.deepEqual(app.readSavedViews(session), [
    { id: 'view-a', title: 'Service overview' },
  ]);
});

test('a credential from an untrusted issuer cannot create an application session', () => {
  const { app, now } = createLearningFixture();
  const untrustedIssuer = createMockIssuer(now);
  rejects(() => app.exchange(untrustedIssuer.issue('alice')), 'INVALID_IDENTITY');
});

test('tampered, invented, and absent identity credentials are rejected', () => {
  const { issuer, app } = createLearningFixture();
  const identity = issuer.issue('alice');
  for (const invalid of [`${identity}changed`, 'identity_invented', '', null, undefined]) {
    rejects(() => app.exchange(invalid), 'INVALID_IDENTITY');
  }
});

test('a trusted credential intended for another application is rejected', () => {
  const { issuer, app } = createLearningFixture();
  rejects(() => app.exchange(issuer.issue('alice', 'different-app')), 'WRONG_AUDIENCE');
});

test('identity credentials cannot directly access application resources', () => {
  const { issuer, app } = createLearningFixture();
  rejects(() => app.readSavedViews(issuer.issue('alice')), 'INVALID_SESSION');
});

test('application sessions cannot be exchanged as identity credentials', () => {
  const { issuer, app } = createLearningFixture();
  const session = app.exchange(issuer.issue('alice'));
  rejects(() => app.exchange(session), 'INVALID_IDENTITY');
});

test('identity expires exactly at its deadline while an existing session remains valid', () => {
  const fixture = createLearningFixture();
  const identity = fixture.issuer.issue('alice');
  const session = fixture.app.exchange(identity);
  fixture.advance(59_999);
  assert.deepEqual(fixture.issuer.verify(identity, 'demo-dashboard'), { subject: 'alice' });
  fixture.advance(1);
  rejects(() => fixture.app.exchange(identity), 'EXPIRED_IDENTITY');
  assert.equal(fixture.app.readSavedViews(session)[0].id, 'view-a');
});

test('application sessions expire exactly at their own deadline', () => {
  const fixture = createLearningFixture();
  const session = fixture.app.exchange(fixture.issuer.issue('alice'));
  fixture.advance(299_999);
  assert.equal(fixture.app.readSavedViews(session).length, 1);
  fixture.advance(1);
  rejects(() => fixture.app.readSavedViews(session), 'EXPIRED_SESSION');
});

test('each session exposes only its owner data and callers cannot mutate stored records', () => {
  const { issuer, app } = createLearningFixture();
  const alice = app.exchange(issuer.issue('alice'));
  const bob = app.exchange(issuer.issue('bob'));
  assert.deepEqual(app.readSavedViews(alice).map(view => view.id), ['view-a']);
  assert.deepEqual(app.readSavedViews(bob).map(view => view.id), ['view-b']);
  const result = app.readSavedViews(alice);
  result[0].title = 'Changed by a caller';
  assert.equal(app.readSavedViews(alice)[0].title, 'Service overview');
});

test('tampering with an application session does not grant resource access', () => {
  const { issuer, app } = createLearningFixture();
  const session = app.exchange(issuer.issue('alice'));
  rejects(() => app.readSavedViews(`${session}changed`), 'INVALID_SESSION');
});

test('logout revokes one application session and preserves other sessions', () => {
  const { issuer, app } = createLearningFixture();
  const alice = app.exchange(issuer.issue('alice'));
  const bob = app.exchange(issuer.issue('bob'));
  app.logout(alice);
  rejects(() => app.readSavedViews(alice), 'INVALID_SESSION');
  assert.equal(app.readSavedViews(bob)[0].id, 'view-b');
});
