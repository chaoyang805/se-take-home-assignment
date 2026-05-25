import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { OrderProcessingEngine } from './domain/service/OrderProcessingEngine';
import { OrderService } from './application/service/OrderService';
import { BotService } from './application/service/BotService';
import { createRouter } from './infrastructure/http/routes';
import { WebSocketManager } from './infrastructure/ws/WebSocketManager';

const app: express.Express = express();
app.use(cors());
app.use(express.json());

const engine = new OrderProcessingEngine();
const orderService = new OrderService(engine);
const botService = new BotService(engine);

app.use(createRouter(orderService, botService));

const server = createServer(app);

const wsManager = new WebSocketManager();
wsManager.attach(server, engine);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

export { app, engine, orderService, botService };
