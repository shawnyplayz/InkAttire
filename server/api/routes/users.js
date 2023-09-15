const users = require("../models/users");
const express = require("express");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const allUsers = async (req, res) => {
  const allUsers = await users.find({});
  try {
    return res.json(allUsers);
    next();
  } catch (error) {
    res.sendStatus(500).send({ message: error });
  }
};

const signup = async (req, res) => {
  try {
    // Get email and password off req body
    const { userId, firstName, lastName, email, password, roleId, role } =
      req.body;
    //Check if the user exists
    const checkSimilarUser = await users.findOne({ email });
    if (checkSimilarUser)
      return res.sendStatus(500).send({ message: "User already exists!" });
    //hashing the password
    const hashPassword = bcrypt.hashSync(password, 8);
    //Create user
    await users.create({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      roleId: roleId,
      role: role,
    });

    //respond
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400).send({ message: error });
  }
};

const login = async (req, res) => {
  try {
    //Get all details off the req
    const { email, password } = req.body;
    console.log(password);
    if (!(email || password)) {
      return res
        .status(400)
        .json({ message: "Need to fill in both, email and password" });
    }
    //Find the user
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email" });
    }
    //Compare sent in password with found user password hash
    const passMatch = bcrypt.compareSync(password, user.password);
    if (!passMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    //Create a jwt token
    const exp = Date.now() + 1000 * 60 * 60 * 24 * 30;
    const token = jwt.sign({ encode: user._id, exp }, process.env.SECRET);

    //Create a cookie
    // res.cookie("Authorization", token, {
    //   expires: new Date(exp),
    //   httpOnly: true,
    //   sameSite: "lax",
    //   secure: process.env.NODE_ENV == "production",
    // });
    //send it
    const sendUserInfo = await users.find(
      { email },
      {
        _id: 0, // Exclude the _id field
        firstName: 1, // Include the firstname field
        lastName: 1, // Include the lastname field
      }
    );
    // const { firstName, lastName } = sendUserInfo;
    res.status(200).json({ sendUserInfo, token });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const logout = (req, res) => {};

const checkAuth = (req, res) => {
  console.log("req.user==>", req.user);
  return res.sendStatus(200);
};
module.exports = {
  allUsers,
  signup,
  login,
  logout,
  checkAuth,
};
