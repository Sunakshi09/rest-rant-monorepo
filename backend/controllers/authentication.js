const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("json-web-token");

router.post("/", async (req, res) => {
  let user = await User.findOne({
    where: { email: req.body.email },
  });

  if (
    !user ||
    !(await bcrypt.compare(req.body.password, user.passwordDigest))
  ) {
    res.status(404).json({
      message: `Could not find a user with the provided username and password`,
    });
  } else {
    req.session.UserId = user.userId;
    res.json({ user });
  }
});

router.get("/profile", async (req, res) => {
  try {
    let user = await User.findOne({
      where: {
        userId: req.session.userId,
      },
    });
    res.json(user);
  } catch {
    res.json(null);
  }
});
