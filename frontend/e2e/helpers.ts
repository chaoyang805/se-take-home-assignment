import type { APIRequestContext } from '@playwright/test';

const API_BASE = 'http://localhost:3000';

export async function resetTestState(request: APIRequestContext): Promise<void> {
  const response = await request.post(`${API_BASE}/api/test/reset`);
  if (!response.ok()) {
    throw new Error(`Failed to reset test state: ${response.status()}`);
  }
}
