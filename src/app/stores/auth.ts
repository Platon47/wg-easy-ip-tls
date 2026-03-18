import type { H3Event } from 'h3';
import type { SharedPublicUser } from '~~/shared/utils/permissions';

export const useAuthStore = defineStore('Auth', () => {
  const userData = useState<SharedPublicUser | null>('user-data', () => null);

  async function getSession(event?: H3Event) {
    try {
      if (event) {
        return await event.$fetch<SharedPublicUser>('/api/session', {
          method: 'get',
        });
      }

      return await $fetch<SharedPublicUser>('/api/session', {
        method: 'get',
      });
    } catch {
      return null;
    }
  }

  async function update() {
    const data = await getSession();
    userData.value = data;
  }

  return { userData, update, getSession };
});
