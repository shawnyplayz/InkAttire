const mongoose = require("mongoose");
(Schema = mongoose.Schema),
  (bcrypt = require("bcrypt")),
  (SALT_WORK_FACTOR = 10);

const usersSchema = new mongoose.Schema({
  userId: {
    type: Number,
    require: true,
  },
  firstName: {
    type: String,
    require: true,
  },
  LastName: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  roleId: {
    type: Number,
    require: true,
  },
  role: {
    type: String,
    require: true,
  },
});
UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};
module.exports = mongoose.model("users", usersSchema);
