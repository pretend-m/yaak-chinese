import type { GrpcConnection } from '@yaakapp-internal/models';
import { deleteModel } from '@yaakapp-internal/models';
import { formatDistanceToNowStrict } from 'date-fns';
import { useDeleteGrpcConnections } from '../hooks/useDeleteGrpcConnections';
import { pluralizeCount } from '../lib/pluralize';
import { Dropdown } from './core/Dropdown';
import { Icon } from './core/Icon';
import { IconButton } from './core/IconButton';
import { HStack } from './core/Stacks';

interface Props {
  connections: GrpcConnection[];
  activeConnection: GrpcConnection;
  onPinnedConnectionId: (id: string) => void;
}

export function RecentGrpcConnectionsDropdown({
  activeConnection,
  connections,
  onPinnedConnectionId,
}: Props) {
  const deleteAllConnections = useDeleteGrpcConnections(activeConnection?.requestId);
  const latestConnectionId = connections[0]?.id ?? 'n/a';

  return (
    <Dropdown
      items={[
        {
          label: '清除连接',
          onSelect: () => deleteModel(activeConnection),
          disabled: connections.length === 0,
        },
        {
          label: `清除 ${pluralizeCount('Connection', connections.length)}`,
          onSelect: deleteAllConnections.mutate,
          hidden: connections.length <= 1,
          disabled: connections.length === 0,
        },
        { type: 'separator', label: '历史' },
        ...connections.map((c) => ({
          label: (
            <HStack space={2}>
              {formatDistanceToNowStrict(c.createdAt + 'Z')} ago &bull;{' '}
              <span className="font-mono text-sm">{c.elapsed}ms</span>
            </HStack>
          ),
          leftSlot: activeConnection?.id === c.id ? <Icon icon="check" /> : <Icon icon="empty" />,
          onSelect: () => onPinnedConnectionId(c.id),
        })),
      ]}
    >
      <IconButton
        title="显示历史连接记录"
        icon={activeConnection?.id === latestConnectionId ? 'chevron_down' : 'pin'}
        className="m-0.5 text-text-subtle"
        size="sm"
        iconSize="md"
      />
    </Dropdown>
  );
}
