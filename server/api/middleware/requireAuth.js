const jwt = require("jsonwebtoken");
const users = require("../models/users");

const requireAuth = async (req, res, next) => {
  try {
    //Read the token off the cookie

    const token = req.cookies.Authorization;

    //decode the token
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("req.cookie==>", decoded);
    //Find the user decoded sub
    const user = await users.findById(decoded.encode);
    if (!user) return res.sendStatus(401);

    //connect the user to the req
    req.user = user;
    //continue on
    next();
  } catch (error) {
    return res.sendStatus(401).send({ message: error });
  }
};

module.exports = requireAuth;
