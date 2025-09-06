export const config = {
  clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  revenueCatAndroidApiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY!
}

if (!config.clerkPublishableKey || !config.revenueCatAndroidApiKey) {
  throw new Error('Missing env variables')
}
