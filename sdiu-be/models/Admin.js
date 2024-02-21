const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const AdminSchema = mongoose.Schema(
  {
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
    password: {
      type: String,
      required: [true, "is required"],
      minlength: 6,
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

AdminSchema.statics.findByCredentials = async function (email, password) {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error("invalid credentials");
  const isSamePassword = bcrypt.compareSync(password, admin.password);
  if (isSamePassword) return user;
  throw new Error("invalid credentials");
};

AdminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  return adminObject;
};


const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
