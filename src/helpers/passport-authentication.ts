import passport from "passport";
import { Strategy } from "passport-local";
import QuestoSource, { PutItem } from "../graphql/dataSource/questo";
import { Request } from "express";

const passportConfig = (questoSource: QuestoSource) => {
  passport.serializeUser((user: { ID: string }, done) => {
    done(null, user.ID);
  });
  passport.deserializeUser(async (ID: string, done) => {
    const user = await questoSource.getUserById({ ID });
    done(null, user);
  });

  passport.use(
    new Strategy(
      {
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        // get user by username
        const user = await questoSource.getUserByUsername({ username });
        // check if password does NOT match password from fn params
        if (user?.passwd !== password) {
          done(null, false);
        }
        // if all good, pass user to done fn
        done(null, user);
      }
    )
  );
};

const handleAuth = async (
  username: string,
  password: string,
  req: Request
): Promise<PutItem> => {
  return new Promise((resolve, reject) => {
    passport.authenticate("local", function (err, user /*, info */) {
      if (err) {
        reject(err);
      }
      req.login(user, (err) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    })({ body: { username, password } });
  });
};

export { passportConfig, handleAuth };
