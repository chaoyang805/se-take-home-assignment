import type { Order, Bot } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function createOrder(type: 'VIP' | 'NORMAL'): Promise<Order> {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  });
  if (!res.ok) throw new Error(`Failed to create order: ${res.status}`);
  return res.json();
}

export async function getOrders(): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/api/orders`);
  if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
  return res.json();
}

export async function addBot(): Promise<Bot> {
  const res = await fetch(`${BASE_URL}/api/bots`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to add bot: ${res.status}`);
  return res.json();
}

export async function removeBot(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/bots`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to remove bot: ${res.status}`);
}

export async function getBots(): Promise<Bot[]> {
  const res = await fetch(`${BASE_URL}/api/bots`);
  if (!res.ok) throw new Error(`Failed to fetch bots: ${res.status}`);
  return res.json();
}
