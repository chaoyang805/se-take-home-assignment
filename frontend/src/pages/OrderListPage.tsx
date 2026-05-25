import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Order } from '../types';
import { getOrders, createOrder } from '../services/api';
import { useOrderEvents } from '../hooks/useOrderEvents';
import OrderControls from '../components/OrderControls';
import PendingColumn from '../components/PendingColumn';
import CompleteColumn from '../components/CompleteColumn';

export default function OrderListPage() {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  useOrderEvents((event) => {
    if (event.event === 'order:completed') {
      const completed = event.payload as Order;
      queryClient.setQueryData<Order[]>(['orders'], (prev) =>
        (prev ?? []).map((o) => (o.id === completed.id ? completed : o)),
      );
    }
  });

  const pendingOrders = orders.filter((o) => o.status === 'PENDING');
  const completedOrders = orders.filter((o) => o.status === 'COMPLETE');

  return (
    <div>
      <OrderControls
        onNewNormal={() => createOrderMutation.mutate('NORMAL')}
        onNewVip={() => createOrderMutation.mutate('VIP')}
        disabled={createOrderMutation.isPending}
      />
      <div style={{ display: 'flex', gap: '24px' }}>
        <PendingColumn orders={pendingOrders} />
        <CompleteColumn orders={completedOrders} />
      </div>
    </div>
  );
}
