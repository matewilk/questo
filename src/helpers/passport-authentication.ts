import passport from "passport";
import { Strategy } from "passport-local";
import QuestoSource, { PutItem } from "../graphql/dataSource/questo";
import { Request } from "express";
import { AuthenticationError } from "apollo-server";

const serializeUserFn = (user: { ID: string }, done) => {
  done(null, user.ID);
};

const deserializeUserFn =
  (questoSource: QuestoSource) => async (ID: string, done) => {
    const user = await questoSource.getUserById({ ID });
    done(null, user);
  };

const passportStrategyFn =
  (questoSource: QuestoSource) => async (req, username, password, done) => {
    // get user by username
    const user = await questoSource.getUserByUsername({ username });
    // check if password does NOT match password from fn params
    if (user?.passwd !== password) {
      done(null, false);
    }
    // if all good, pass user to done fn
    done(null, user);
  };

const passportConfig = (questoSource: QuestoSource) => {
  passport.serializeUser(serializeUserFn);
  passport.deserializeUser(deserializeUserFn(questoSource));

  passport.use(
    new Strategy(
      {
        passReqToCallback: true,
      },
      passportStrategyFn(questoSource)
    )
  );
};

const localStrategyFn = (req, resolve, reject) =>
  function (err, user /*, info */) {
    if (err) {
      reject(err);
    }
    req.login(user, (err) => {
      if (err) {
        reject(err);
      }
      resolve(user);
    });
  };

const handleAuth = async (
  username: string,
  password: string,
  req: Request
): Promise<PutItem> => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "local",
      localStrategyFn(req, resolve, reject)
    )({ body: { username, password } });
  });
};

const logout = (req: Request) => {
  return new Promise((resolve, reject) => {
    req.session.destroy((err: Error) => {
      if (err) {
        reject(new AuthenticationError("Logout failed"));
      } else {
        req.logout();
        resolve({ success: true });
      }
    });
  });
};

export {
  passportConfig,
  handleAuth,
  logout,
  serializeUserFn,
  deserializeUserFn,
  passportStrategyFn,
};
