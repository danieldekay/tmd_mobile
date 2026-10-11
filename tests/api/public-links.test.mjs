import test from 'node:test';
import assert from 'node:assert/strict';
import { safeHttpUrl, safeMailto, safeExternalHref } from '../../src/lib/security/public-links.ts';

test('external links from legacy V3 metadata allow only safe HTTP(S) URLs', () => {
  assert.equal(safeHttpUrl('https://example.com/event'), 'https://example.com/event');
  assert.equal(safeHttpUrl(' http://example.com/ '), 'http://example.com/');
  for (const url of [
    'javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd', 'blob:https://example.com/abcd',
    'https://user:pass@example.com/', 'https://example.com/\nfoo',
    '//example.com/path', '/relative', ''
  ]) {
    assert.equal(safeHttpUrl(url), undefined, url);
    assert.equal(safeExternalHref(url), undefined, url);
  }
});

test('email links reject injected headers or extra recipients', () => {
  assert.equal(safeMailto('dancer@example.com'), 'mailto:dancer@example.com');
  assert.equal(safeMailto('mailto:dancer@example.com'), 'mailto:dancer@example.com');
  for (const email of [
    'a@example.com?subject=x', 'a@example.com\r\nBcc:attacker@example.net',
    'a@example.com,b@example.net', 'mailto:javascript:alert(1)',
    'foo', 'name@foo'
  ]) assert.equal(safeMailto(email), undefined, email);
  assert.equal(safeExternalHref('mailto:dancer@example.com'), 'mailto:dancer@example.com');
});
