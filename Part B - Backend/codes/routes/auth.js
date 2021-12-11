require("dotenv").config();
var express = require("express");
var router = express.Router();
const DButils = require("../modules/DButils");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    const users = await DButils.execQuery("SELECT username FROM users");

    if (users.find((x) => x.username === req.body.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      req.body.password,
      parseInt(process.env.bcrypt_saltRounds)
    );
    await DButils.execQuery(
      `INSERT INTO users ([username],[password],[firstname],[lastname],[country],[email],[image]) VALUES ('${req.body.username}', '${hash_password}','${req.body.firstname}','${req.body.lastname}','${req.body.country}','${req.body.email}','${req.body.image}')`
    );
    res.status(201).send({ message: "The user has been created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
    {
        //console.log(x.username);
        throw { status: 401, message: "Username or Password incorrect" };
    }

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set cookie
    req.session.username = user.username;
    // req.session.save();
    // res.cookie(session_options.cookieName, user.user_id, cookies_options);
    // return cookie
    res.status(200).send({ message: "user authenticated", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/Logout", function (req, res) {
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.send({ success: true, message: "logout succeeded" });
});

module.exports = router;
