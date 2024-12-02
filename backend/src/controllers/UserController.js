import { UserModel } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import jwt from "jsonwebtoken";

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(500)
      .json({ message: `Please fill up all details properly` });

  try {
    const hashedPassword = await bcrypt.hash(password, 6);
    const user = await UserModel.create({
      username: username,
      password: hashedPassword,
      isMfaActive: false,
    });

    return res
      .status(200)
      .json({ message: `User Created Succesfully ${user}` });
  } catch (error) {
    return res.status(500).json({ message: `Error Found ${error}` });
  }
}

async function login(req, res) {
  const currUser = req.user;
  return res.status(200).json({
    message: `User is Logged in Successfully`,
    username: currUser.username,
    isMfaActive: currUser.isMfaActive,
  });
}

const authStatus = (req, res) => {
  try {
    if (!req.user) {
      return res.status(500).json({ message: `User not Logged in` });
    }
    return res.status(200).json({
      message: `User is Logged in`,
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error Found ${error}` });
  }
};

async function logout(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: `Already Logged Out` });
    }
    req.logout((err) => {
      if (err)
        return res.status(400).json({ message: `User is not Logged in` });
      return res
        .status(200)
        .json({ message: `User is successfully Logged out` });
    });
  } catch (error) {
    return res.status(500).json({ message: `Error Found ${error}` });
  }
}

async function setup2FA(req, res) {
  try {
    const user = req.user;

    if (user.isMfaActive) {
      return res.status(500).json({ message: `Already MFA activated` });
    }

    var secret = speakeasy.generateSecret();

    user.twoFactorSecret = secret.base32;
    user.isMfaActive = true;
    await UserModel.findByIdAndUpdate(req.user._id, user);

    const url = speakeasy.otpauthURL({
      secret: secret.base32,
      label: `${req.user.username}`,
      issuer: "https://linktr.ee/Najaf_Ali_Balti",
      encoding: "base32",
    });

    const qrCodeImgUrl = await qrcode.toDataURL(url);
    return res.status(200).json({
      secret: secret.base32,
      qrCode: qrCodeImgUrl,
    });
  } catch (error) {
    return res.status(500).json({ message: `Error when setup 2FA ${error}` });
  }
}

async function verify2FA(req, res) {
  try {
    const { token } = req.body;
    
    const user = req.user;

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token,
    });

    if (verified) {
      const jwtToken = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1hr" }
      );
      return res
        .status(200)
        .json({ message: `2FA successfully Setup, Token is ${jwtToken}` });
    } else {
      return res.status(500).json({ message: `Invalid 2FA Token` });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Error Found While Checking Verification for 2FA ${error}`,
    });
  }
}

async function reset2FA(req, res) {
  try {
    const user = req.user;
    user.twoFactorSecret = "";
    user.isMfaActive = false;

    await user.save();
    return res
      .status(500)
      .json({ message: `Successfully Reset MFA Now user status is: ${user}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error when resetting 2FA authentication ${error}` });
  }
}

export { register, login, authStatus, logout, setup2FA, verify2FA, reset2FA };
