const User = require("../model/userModel");
const bcrypt = require("bcrypt");
// register function
module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    const emailCheck = await User.findOne({ email });
    if (usernameCheck) {
      return res.json({ message: "Username already exists", status: false });
    }
    if (emailCheck) {
      return res.json({ message: "Email already exists", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// login function
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.json({
        message: "Username not found",
        status: false,
      });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.json({
        message: "Incorrect Password",
        status: false,
      });
    }
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

// setAvatar function
module.exports.setAvatar = async (req, res, next) => {
  try {
    const user_id = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(user_id, {
      avatarImage,
      isAvatarImageSet: true,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

// allUsers function
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
