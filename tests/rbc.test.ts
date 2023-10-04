import { calculate_bars, depth_consumption, depth_to_ata } from '../src/rbc';

describe('testing depth_to_ata', () => {
  test('it should handle sane depths', () => {
    expect(depth_to_ata(10)).toBe(2);
    expect(depth_to_ata(20)).toBe(3);
    expect(depth_to_ata(30)).toBe(4);
    expect(depth_to_ata(40)).toBe(5);
  });

  test('it should handle very deep depths', () => {
    expect(depth_to_ata(3827)).toBe(383.7);
  });

  test('it should handle sea level', () => {
    expect(depth_to_ata(0)).toBe(1);
  })

  test('it should ignore invalid inputs', () => {
    expect(depth_to_ata(-20)).toBe(NaN);
  });

  test('it should handle non-integer atas', () => {
    expect(depth_to_ata(4)).toBe(1.4);
  });

  test('it should handle non-integer inputs', () => {
    expect(depth_to_ata(33.4)).toBe(4.34);
  });
});

describe('testing calculate_bars', () => {
  test('it should handle valid inputs', () => {
    expect(calculate_bars(1200, 12)).toBe(100);
    expect(calculate_bars(1, 1)).toBe(1);
  });

  test('it should handle invalid inputs', () => {
    expect(calculate_bars(1, 0)).toBe(Infinity);
    expect(calculate_bars(0, 1)).toBe(0);
    expect(calculate_bars(-1, 1)).toBe(NaN);
    expect(calculate_bars(1, -1)).toBe(NaN);
  });

  test('it should handle crazy inputs', () => {
    expect(calculate_bars(100_000, 0.1)).toBe(1_000_000);
    expect(calculate_bars(0.1, 100)).toBe(0);
  });
});

describe('testing depth_consumption', () => {
  test('it should handle valid inputs', () => {
    expect(depth_consumption(10, 10, 30, 0)).toBe(600);
    expect(depth_consumption(0, 10, 15, 0)).toBe(150);
  });

  test('it should handle 0 duration', () => {
    expect(depth_consumption(10, 0, 15, 0)).toBe(0);
    expect(depth_consumption(10, 0, 15, 20)).toBe(0);
  });

  test('it should handle two divers', () => {
    expect(depth_consumption(10, 10, 30, 15)).toBe(900);
  });
});
