
import { vi } from 'vitest';

// Create mock for the react hooks testing library
vi.mock('@testing-library/react-hooks', () => {
  return {
    renderHook: vi.fn(),
    act: vi.fn()
  };
});

export const mockRenderHook = (callback: () => any, options?: any) => {
  return {
    result: { current: callback() },
    rerender: vi.fn(),
    unmount: vi.fn(),
    waitForNextUpdate: vi.fn()
  };
};

export const mockAct = async (callback: () => Promise<void> | void) => {
  return callback();
};
