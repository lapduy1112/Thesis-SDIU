const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Verification = require("../models/EmailVertify");
const PasswordReset = require("../models/PasswordReset");
const express = require("express");
const router = express.Router();
const ApiErrors = require("../utils/ApiError");
const { hashString, compareString } = require("../utils/index");
const {
  sendVerificationEmail,
  resetPasswordLink,
} = require("../utils/sendEmail");
const path = require("path");

// const __dirname = path.resolve(path.dirname(""));

//signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, studentId, password, phone, isAdmin } = req.body;
    if (password.length <= 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });
    //generate new password
    const hashedPassword = await hashString(password);
    //create new user
    const newUser = new User({
      name: name,
      email: email,
      studentId: studentId,
      password: hashedPassword,
      phone: phone,
      isAdmin: isAdmin,
    });
    // const confirmToken = user.getConfirmToken();

    //send email vertification
    const user = await newUser.save();
    sendVerificationEmail(user, res);

    // res.status(200).json({ success: true, message:"Please confirm registration",verify });
  } catch (err) {
    if (err.code === 11000) return res.status(400).send("Email already exists");
    res.status(500).json(err.message);
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  try {
    if (!user) {
      throw new ApiErrors(404, "email is wrong");
    }
    if (!user?.verified) {
      throw new ApiErrors(
        403,
        "user email is not  verified. Check your email account and verify your email"
      );
    }

    const isMatched = bcrypt.compareSync(password, user.password);
    if (!isMatched) {
      throw new ApiErrors(404, " password is wrong");
    }
    const access_token = createAccessToken({ user });
    // const refresh_token = createRefreshToken({ id: user._id });

    // res.cookie("refreshtoken", refresh_token, {
    //   httpOnly: true,
    //   path: "/auth/refreshtoken",
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    // });
    user.password = "";
    res.status(200).json({ success: true, access_token, user });
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.get("/verify/:userId/:token", async (req, res) => {
  const { userId, token } = req.params;
  try {
    const result = await Verification.findOne({ userId });

    if (result) {
      const { expiresAt, token: hashedToken } = result;

      // token has expires
      if (expiresAt < Date.now()) {
        Verification.findOneAndDelete({ userId })
          .then(() => {
            User.findOneAndDelete({ _id: userId })
              .then(() => {
                const message = "Verification token has expired.";
                res.redirect(`/auth/verified?status=error&message=${message}`);
              })
              .catch((err) => {
                res.redirect(`/auth/verified?status=error&message=`);
              });
          })
          .catch((error) => {
            console.log(error);
            res.redirect(`/auth/verified?message=`);
          });
      } else {
        //token valid
        compareString(token, hashedToken)
          .then((isMatch) => {
            if (isMatch) {
              User.findOneAndUpdate({ _id: userId }, { verified: true })
                .then(() => {
                  Verification.findOneAndDelete({ userId }).then(() => {
                    const message = "Email verified successfully";
                    res.redirect(
                      `/auth/verified?status=success&message=${message}`
                    );
                  });
                })
                .catch((err) => {
                  console.log(err);
                  const message = "Verification failed or link is invalid";
                  res.redirect(
                    `/auth/verified?status=error&message=${message}`
                  );
                });
            } else {
              // invalid token
              const message = "Verification failed or link is invalid";
              res.redirect(`/auth/verified?status=error&message=${message}`);
            }
          })
          .catch((err) => {
            console.log(err);
            res.redirect(`/auth/verified?message=`);
          });
      }
    } else {
      const message = "Invalid verification link. Try again later.";
      res.redirect(`/auth/verified?status=error&message=${message}`);
    }
  } catch (error) {
    console.log(err);
    res.redirect(`/auth/verified?message=`);
  }
});

router.get("/verified", (req, res) => {
  // console.log(__dirname);
  res.sendFile(path.join(__dirname, "./views/build", "index.html"));
});

router.post("/request-passwordreset", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "FAILED",
        message: "Email address not found.",
      });
    }

    const existingRequest = await PasswordReset.findOne({ email });
    if (existingRequest) {
      if (existingRequest.expiresAt > Date.now()) {
        return res.status(201).json({
          status: "PENDING",
          message: "Reset password link has already been sent tp your email.",
        });
      }
      await PasswordReset.findOneAndDelete({ email });
    }
    await resetPasswordLink(user, res);
    console.log("hehe");
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.get("/reset-password/:userId/:token", async (req, res) => {
  const { userId, token } = req.params;
  try {
    // find record
    const user = await User.findById(userId);

    if (!user) {
      const message = "Invalid password reset link. Try again";
      res.redirect(`/auth/resetpassword?status=error&message=${message}`);
    }

    const resetPassword = await PasswordReset.findOne({ userId });

    if (!resetPassword) {
      const message = "Invalid password reset link. Try again";
      return res.redirect(
        `/auth/resetpassword?status=error&message=${message}`
      );
    }

    const { expiresAt, token: resetToken } = resetPassword;

    if (expiresAt < Date.now()) {
      const message = "Reset Password link has expired. Please try again";
      res.redirect(`/auth/resetpassword?status=error&message=${message}`);
    } else {
      const isMatch = await compareString(token, resetToken);

      if (!isMatch) {
        const message = "Invalid reset password link. Please try again";
        res.redirect(`/auth/resetpassword?status=error&message=${message}`);
      } else {
        res.redirect(`/auth/resetpassword?type=reset&id=${userId}`);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { userId, password } = req.body;

    const hashedpassword = await hashString(password);

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { password: hashedpassword }
    );

    if (user) {
      await PasswordReset.findOneAndDelete({ userId });

      res.status(200).json({
        ok: true,
      });
      console.log(password);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
});

router.get("/resetpassword", (req, res) => {
  res.sendFile(path.join(__dirname, "./views/build", "resetpass.html"));
});

//refresh token
const createAccessToken = (payload) => {
  return jwt.sign(
    {
      payload,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1 days" }
  );
};

const createRefreshToken = (payload) => {
  return jwt.sign(
    {
      payload,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" }
  );
};

//log out
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("refreshtoken", {
      path: "/auth/refreshtoken",
    });
    return res.json({ msg: "Logged out!" });
  } catch (e) {
    return res.status(500).json({ msg: e.message });
  }
});

//generate access token
router.post("/refreshtoken", async (req, res) => {
  try {
    // Kiểm tra xem cookie có tồn tại trong yêu cầu không
    const rf_token = req.cookies.refreshtoken;
    if (!rf_token) return res.status(400).json({ msg: "please login now" });
    jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login now." });
        console.log(result);
        const user = await User.findById(result.payload.id);

        if (!user) return res.status(400).json({ msg: "This does not exist." });

        const access_token = createAccessToken({ id: result.id });
        res.json({
          access_token,
          user,
        });
      }
    );
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "Can not find user" });
    }

    // Tạo một mật khẩu mới ngẫu nhiên
    const newPassword = generateRandomPassword(); // Tự định nghĩa hàm này ở phía dưới

    // Băm mật khẩu mới trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    sendNewPasswordEmail(user.email, newPassword);

    return res.status(201).send({ password: "Change success", newPassword });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

// Hàm tạo mật khẩu ngẫu nhiên (ví dụ)
function generateRandomPassword() {
  const randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passwordLength = 10;

  let newPassword = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * randomChars.length);
    newPassword += randomChars.charAt(randomIndex);
  }

  return newPassword;
}

router.post("/changepassword", async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: "Can not find user" });
    }

    const isMatched = bcrypt.compareSync(currentPassword, user.password);

    if (!isMatched) {
      return res.status(400).send({ error: "Current password is incorrect" });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    return res.status(200).send({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
});

module.exports = router;
