import { depth_to_ata } from '../src/rbc';

describe('testing calculator functions', () => {
  test('depth_to_ata should correctly handle sane depths', () => {
    expect(depth_to_ata(20)).toBe(3);
  });
});
