import { useEffect } from 'react';
import { orderEventClient } from '../services/OrderEventClient';
import type { OrderEvent } from '../types';

export function useOrderEvents(onEvent: (event: OrderEvent) => void): void {
  useEffect(() => {
    return orderEventClient.subscribe(onEvent);
  }, [onEvent]);
}
