import { createWorkspaceModel } from '@yaakapp-internal/models';
import { jotaiStore } from '../lib/jotai';
import { showPrompt } from '../lib/prompt';
import { setWorkspaceSearchParams } from '../lib/setWorkspaceSearchParams';
import { activeWorkspaceIdAtom } from './useActiveWorkspace';
import { useFastMutation } from './useFastMutation';

export function useCreateCookieJar() {
  return useFastMutation({
    mutationKey: ['create_cookie_jar'],
    mutationFn: async () => {
      const workspaceId = jotaiStore.get(activeWorkspaceIdAtom);
      if (workspaceId == null) {
        throw new Error("Cannot create cookie jar when there's no active workspace");
      }

      const name = await showPrompt({
        id: 'new-cookie-jar',
        title: '新建CookieJar',
        placeholder: '我的Jar',
        confirmText: '创建',
        cancelText: '取消',
        label: '名称',
        defaultValue: '我的Jar',
      });
      if (name == null) return null;

      return createWorkspaceModel({ model: 'cookie_jar', workspaceId, name });
    },
    onSuccess: async (cookieJarId) => {
      setWorkspaceSearchParams({ cookie_jar_id: cookieJarId });
    },
  });
}
