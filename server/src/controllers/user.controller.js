import passport from "passport";
import {
  createUser,
  getAllUsersFromDB,
  getAppTitleFromDB,
  updateAppTitleInDB,
} from "../services/user.services.js";
import { strategy } from "../config/configs.js";

passport.use(strategy);

export const createUserAndLogin = async (req, res) => {
  try {
    const user = await createUser(req.body);
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.status(201).json({username: user.username});
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const login = function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send("User not found");
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);
      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersFromDB();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppTitle = async (req, res) => {
  try {
    const title = req.params.title;
    await updateAppTitleInDB(title);
    res.status(200).json(title);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getAppTitle = async (req, res) => {
  try {
    const title = await getAppTitleFromDB();
    res.status(200).json(title);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
