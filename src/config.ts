export const config = {
  port: process.env.PORT ?? 1337,
  twitchClientId: process.env.TWITCH_CLIENT_ID,
  twitchClientSecret: process.env.TWITCH_CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
};
