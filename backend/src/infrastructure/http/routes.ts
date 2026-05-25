import { Router, Request, Response } from 'express';
import type { OrderService } from '../../application/service/OrderService';
import type { BotService } from '../../application/service/BotService';

export function createRouter(orderService: OrderService, botService: BotService): Router {
  const router = Router();

  router.post('/api/orders', (req: Request, res: Response) => {
    const { type } = req.body;
    if (type !== 'VIP' && type !== 'NORMAL') {
      res.status(400).json({ error: 'type must be VIP or NORMAL' });
      return;
    }
    const order = orderService.createOrder(type);
    res.status(201).json(order);
  });

  router.get('/api/orders', (_req: Request, res: Response) => {
    const orders = orderService.getOrders();
    res.json(orders);
  });

  router.post('/api/bots', (_req: Request, res: Response) => {
    const bot = botService.addBot();
    res.status(201).json(bot);
  });

  router.delete('/api/bots', (_req: Request, res: Response) => {
    botService.removeBot();
    res.status(204).send();
  });

  router.get('/api/bots', (_req: Request, res: Response) => {
    const bots = botService.getBots();
    res.json(bots);
  });

  return router;
}
