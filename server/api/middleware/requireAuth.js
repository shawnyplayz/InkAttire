const jwt = require("jsonwebtoken");
const users = require("../models/users");

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRET);
      if (decoded) {
        // const email = decoded.email;
        const persistedUser = await users.findById(decoded.encode);
        if (persistedUser) {
          //connect the user to the req
          req.user = persistedUser;
          //continue on}
          next();
        } else {
          //User does not exist
          return res.json({ success: false, message: "User Dosen't exists" });
        }
      } else {
        //decoding fails
        res
          .status(401)
          .json({ success: false, message: "No Authorization Headers found" });
      }
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Token has been tampered" });
    }
  } else {
    //no authentication headers sent
    res.status(401).json({ message: "No Authorization Headers found" });
  }
};
module.exports = requireAuth;
