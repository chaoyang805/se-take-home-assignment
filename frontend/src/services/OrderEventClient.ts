import type { OrderEvent } from '../types';

type Listener = (event: OrderEvent) => void;

class OrderEventClientImpl {
  private ws: WebSocket | null = null;
  private listeners: Set<Listener> = new Set();
  private url: string;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.url = (import.meta.env.VITE_WS_URL || 'ws://localhost:3000') + '/ws';
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(this.url);

    this.ws.onmessage = (event) => {
      try {
        const message: OrderEvent = JSON.parse(event.data as string);
        for (const listener of this.listeners) {
          listener(message);
        }
      } catch {
        // ignore parse errors
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.listeners.size === 1) {
      this.connect();
    }
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.disconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.listeners.size > 0) {
        this.connect();
      }
    }, 3000);
  }

  private disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.ws?.close();
    this.ws = null;
  }
}

export const orderEventClient = new OrderEventClientImpl();
