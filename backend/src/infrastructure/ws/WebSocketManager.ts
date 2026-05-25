import { WebSocketServer, WebSocket } from 'ws';
import type { Server } from 'http';
import type { OrderProcessingEngine } from '../../domain/service/OrderProcessingEngine';

export class WebSocketManager {
  private wss: WebSocketServer | null = null;

  attach(server: Server, engine: OrderProcessingEngine): void {
    this.wss = new WebSocketServer({ server, path: '/ws' });

    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('error', () => {
        // ignore client errors
      });
    });

    engine.addListener('order:completed', (payload) => {
      this.broadcast('order:completed', payload);
    });

    engine.addListener('bot:status_changed', (payload) => {
      this.broadcast('bot:status_changed', payload);
    });
  }

  private broadcast(event: string, payload: unknown): void {
    if (!this.wss) return;
    const message = JSON.stringify({ event, payload });
    for (const client of this.wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}
