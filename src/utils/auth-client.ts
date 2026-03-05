import { createAuthClient } from 'better-auth/vue'
import { adminClient, twoFactorClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: `${location.origin}/api/auth`,
  plugins: [adminClient(), twoFactorClient()],
})

export const session = authClient.useSession()
