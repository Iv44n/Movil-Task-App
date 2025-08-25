export const config = {
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
}

if (!config.clerkPublishableKey) {
  throw new Error('Missing env variables')
}
