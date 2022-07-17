import OAuth2Strategy from "passport-oauth2";
import request from "request";
import { config } from "./config";

export type TwitchUser = {
  id: string,
  login: string,
  displayName: string,
  profileImageUrl: string,
  email: string,
  _raw: any;
}

export const fetchTwitchUser = (accessToken: string) => {
  return new Promise<TwitchUser>((resolve, reject) => {
    const options = {
      url: 'https://api.twitch.tv/helix/users',
      method: 'GET',
      headers: {
        'Client-ID': config.twitchClientId,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': `Bearer ${accessToken}`
      }
    };

    request(options, function (error, response, body) {
      const json = JSON.parse(body);
      if (response && response.statusCode == 200) {
        resolve({
          id: json.data[0].id,
          login: json.data[0].login,
          displayName: json.data[0].display_name,
          profileImageUrl: json.data[0].profile_image_url,
          email: json.data[0].email,
          _raw: json
        });
      } else {
        reject(json);
      }
    });
  })
}

class TwitchStrategy extends OAuth2Strategy {
  userProfile = function(accessToken: string, done: (err?: Error, user?: any) => void) {
    fetchTwitchUser(accessToken).then((user) => {
      done(null, user)
    }).catch((err) => {
      done(err);
    })
  }
}

const passportConfig = {
  authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
  tokenURL: 'https://id.twitch.tv/oauth2/token',
  clientID: config.twitchClientId,
  clientSecret: config.twitchClientSecret,
  callbackURL: `http://localhost:${config.port}/auth/callback`,
  scope: 'user_read',
  state: true
};

const passportCallback = (accessToken: string, refreshToken: string, profile: any, done: (err?: Error, user?: any) => void) => {
  done(null, { ...profile, accessToken, refreshToken });
}

export const twitchStrategy = new TwitchStrategy(passportConfig, passportCallback);
