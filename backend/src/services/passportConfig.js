import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/userModel.js";

passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await UserModel.findOne({ username });

      if (!user) {
        return done(null, false, {
          message: `Can't find Username! Create One..`,
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        console.log("Not Match Password");
        return done(null, false, {
          message: `Incorrect Password`,
        });
      }

      return done(null, user, {
        message: `User Logged in Successfully! Hello ${user.username}`,
      });
    } catch (error) {
      return done(error, false, { message: `Error Found` });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
  try {
    const user = await UserModel.findById({ _id });
    if (user) {
      done(null, user);
    }
  } catch (error) {
    done(error, null);
  }
});
