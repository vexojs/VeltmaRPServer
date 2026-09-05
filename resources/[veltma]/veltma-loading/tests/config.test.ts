import { describe, expect, it } from 'vitest';
import { createLoadingConfig } from '../src/shared/config';

describe('loading configuration', () => {
  it('provides reusable branded defaults', () => {
    const config = createLoadingConfig();

    expect(config.serverName).toBe('Veltma Roleplay');
    expect(config.rules).toHaveLength(3);
    expect(config.messages).toHaveLength(3);
  });

  it('rejects unsafe asset paths and non-HTTPS links', () => {
    expect(() => createLoadingConfig({ backgroundImageUrl: 'javascript:alert(1)' })).toThrow();
    expect(() =>
      createLoadingConfig({ links: [{ label: 'Community', href: 'http://example.com' }] }),
    ).toThrow();
  });
});
