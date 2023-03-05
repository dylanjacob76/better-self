const router = require("express").Router();
const { User } = require("../../models");

// Get all users (for Postman test)
router.get("/", async (req, res) => {
  try{
    const userData = await User.findAll();

    res.json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
})

// Create a user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
    });

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try{
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      return res.status(400).json({ message: "Incorrect email or password, please try again" });
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect email or password, please try again" });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
    });

    res.json({ user: userData, message: "You are now logged in!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Logout
router.post("/logout", async (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.json("you are now logged out")
      res.status(204).end();
    });
  } else {
    res.status(404).end();

  }
});

module.exports = router;