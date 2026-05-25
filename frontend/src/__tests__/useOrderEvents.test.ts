import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('useOrderEvents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should subscribe on mount and unsubscribe on unmount', async () => {
    const unsubscribe = vi.fn();
    const mockSubscribe = vi.fn(() => unsubscribe);

    vi.doMock('../services/OrderEventClient', () => ({
      orderEventClient: {
        subscribe: mockSubscribe,
      },
    }));

    const { useOrderEvents } = await import('../hooks/useOrderEvents');
    const callback = vi.fn();
    const { unmount } = renderHook(() => useOrderEvents(callback));

    expect(mockSubscribe).toHaveBeenCalledWith(callback);

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
