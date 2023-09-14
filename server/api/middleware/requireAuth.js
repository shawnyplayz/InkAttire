const jwt = require("jsonwebtoken");
const users = require("../models/users");

// const requireAuth = async (req, res, next) => {
//   try {
//     //Read the token off the cookie

//     console.log("req.cookies==>", req.cookies);
//     const token = req.cookies.Authorization;
//     //decode the token
//     const decoded = jwt.verify(token, process.env.SECRET);
//     console.log("req.cookie==>", decoded);
//     //Find the user decoded sub
//     const user = await users.findById(decoded.encode);
//     if (!user) return res.sendStatus(401);

//     //connect the user to the req
//     req.user = user;
//     //continue on
//     next();
//   } catch (error) {
//     return res.status(401).send({ message: error });
//   }
// };
const requireAuth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("authHeader==>", authHeader);

  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      let decoded = jwt.verify(token, process.env.SECRET);
      if (decoded) {
        console.log("decoded", decoded);
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
