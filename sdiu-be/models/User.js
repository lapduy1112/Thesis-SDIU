const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "is required"],
    },
    email: {
      type: String,
      required: [true, "is required"],
      unique: true,
      index: true,
      validate: {
        validator: function (str) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    studentId: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      required: [true, "is required"],
      minlength: 6,
    },
    photoURL: {
      type: Array,
      default:
        "https://e7.pngegg.com/pngimages/705/224/png-clipart-user-computer-icons-avatar-miscellaneous-heroes.png",
      required: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmRegistrationToken: String,
    confirmRegistrationExpire: Date,
    notifications: {
      type: Array,
      default: [],
    },
    reports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Report" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    minimize: false,
    timestamps: true,
  }
);

UserSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("invalid credentials");
  const isSamePassword = bcrypt.compareSync(password, user.password);
  if (isSamePassword) return user;
  throw new Error("invalid credentials");
};

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  return userObject;
};

// //before saving => hash the password
// UserSchema.pre("save", function (next) {
//   const user = this;

//   if (!user.isModified("password")) return next();

//   bcrypt.genSalt(10, function (err, salt) {
//     if (err) return next(err);

//     bcrypt.hash(user.password, salt, function (err, hash) {
//       if (err) return next(err);

//       user.password = hash;
//       next();
//     });
//   });
// });

// UserSchema.pre("remove", function (next) {
//   this.model("Order").remove({ owner: this._id }, next);
// });
UserSchema.methods.getConfirmedToken = function () {
  const confirmToken = crypto.randomBytes(20).toString("hex");

  this.confirmRegistrationToken = crypto
    .createHash("sha256")
    .update(confirmToken)
    .digest("hex");

  this.confirmRegistrationExpire = Date.now() + 10 * (60 * 1000);
  return confirmToken;
};
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};
const User = mongoose.model("User", UserSchema);

module.exports = User;
