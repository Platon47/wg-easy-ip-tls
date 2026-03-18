import { beforeAll, describe, expect, test } from 'vitest';

let GeneralUpdateSchema: typeof import('../../server/database/repositories/general/types').GeneralUpdateSchema;

beforeAll(async () => {
  const testGlobals = globalThis as typeof globalThis & {
    t?: (value: string) => string;
  };
  testGlobals.t = (value: string) => value;
  ({ GeneralUpdateSchema } =
    await import('../../server/database/repositories/general/types'));
});

describe('GeneralUpdateSchema', () => {
  test('requires a metrics password when metrics are enabled', async () => {
    await expect(
      GeneralUpdateSchema.parseAsync({
        sessionTimeout: 60,
        metricsPrometheus: true,
        metricsJson: false,
        metricsPassword: null,
      })
    ).rejects.toThrow();
  });

  test('allows disabling metrics without a password', async () => {
    await expect(
      GeneralUpdateSchema.parseAsync({
        sessionTimeout: 60,
        metricsPrometheus: false,
        metricsJson: false,
        metricsPassword: null,
      })
    ).resolves.toEqual({
      sessionTimeout: 60,
      metricsPrometheus: false,
      metricsJson: false,
      metricsPassword: null,
    });
  });
});
