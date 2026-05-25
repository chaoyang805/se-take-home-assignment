import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Bot } from '../types';
import { getBots, addBot, removeBot } from '../services/api';
import { useOrderEvents } from '../hooks/useOrderEvents';
import BotControls from '../components/BotControls';
import BotCard from '../components/BotCard';

export default function BotListPage() {
  const queryClient = useQueryClient();

  const { data: bots = [] } = useQuery<Bot[]>({
    queryKey: ['bots'],
    queryFn: getBots,
  });

  const addBotMutation = useMutation({
    mutationFn: addBot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
  });

  const removeBotMutation = useMutation({
    mutationFn: removeBot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
  });

  useOrderEvents((event) => {
    if (event.event === 'bot:status_changed') {
      const { botId, status, currentOrderId } = event.payload as {
        botId: number;
        status: 'IDLE' | 'PROCESSING';
        currentOrderId?: number;
      };
      queryClient.setQueryData<Bot[]>(['bots'], (prev) =>
        (prev ?? []).map((b) =>
          b.id === botId ? { ...b, status, currentOrderId } : b,
        ),
      );
    }
  });

  return (
    <div>
      <BotControls
        onAdd={() => addBotMutation.mutate()}
        onRemove={() => removeBotMutation.mutate()}
        disabled={addBotMutation.isPending || removeBotMutation.isPending}
      />
      {bots.length === 0 ? (
        <p style={{ color: '#999', fontStyle: 'italic' }}>暂无机器人，请点击 "+ Bot" 创建</p>
      ) : (
        bots.map((bot) => <BotCard key={bot.id} bot={bot} />)
      )}
    </div>
  );
}
