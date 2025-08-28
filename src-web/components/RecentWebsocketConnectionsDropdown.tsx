import type { WebsocketConnection } from '@yaakapp-internal/models';
import { deleteModel, getModel } from '@yaakapp-internal/models';
import { formatDistanceToNowStrict } from 'date-fns';
import { deleteWebsocketConnections } from '../commands/deleteWebsocketConnections';
import { pluralizeCount } from '../lib/pluralize';
import { Dropdown } from './core/Dropdown';
import { Icon } from './core/Icon';
import { IconButton } from './core/IconButton';
import { HStack } from './core/Stacks';

interface Props {
  connections: WebsocketConnection[];
  activeConnection: WebsocketConnection;
  onPinnedConnectionId: (id: string) => void;
}

export function RecentWebsocketConnectionsDropdown({
  activeConnection,
  connections,
  onPinnedConnectionId,
}: Props) {
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
          onSelect: () => {
            const request = getModel('websocket_request', activeConnection.requestId);
            if (request != null) {
              deleteWebsocketConnections.mutate(request);
            }
          },
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
        title="Show connection history"
        icon={activeConnection?.id === latestConnectionId ? 'chevron_down' : 'pin'}
        className="m-0.5 text-text-subtle"
        size="sm"
        iconSize="md"
      />
    </Dropdown>
  );
}
