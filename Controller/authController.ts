import { Request, Response } from "express";
import authModel from "../Model/authModel";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendAccountMail, sendFirstAccountMail } from "../utils/email";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, password, email } = req.body;

    const salt: any = await bcrypt.genSalt(10);
    const hash: any = await bcrypt.hash(password, salt);

    const value = crypto.randomBytes(10).toString("hex");
    const token = jwt.sign(value, "secret");

    const user = await authModel.create({
      name,
      password: hash,
      email,
      token,
      wallet: 200,
    });
    sendFirstAccountMail(user).then(() => {
      console.log("sent an otp");
    });
    return res.status(201).json({
      message: "created user successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error registering",
      data: error.message,
    });
  }
};

export const viewAll = async (req: Request, res: Response) => {
  try {
    const user = await authModel.find();
    return res.status(200).json({
      message: "Success",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await authModel.findByIdAndDelete(userID);

    return res.status(201).json({
      message: "deleted user successfully",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "User not deleted",
      data: error.message,
    });
  }
};

export const signInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await authModel.findOne({ email: email });

    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.verify && user.token === "") {
          const token = jwt.sign({ id: user._id }, "secret");

          return res.status(201).json({
            message: `welcome ${user.name}`,
            data: token,
          });
        } else {
          return res.status(403).json({
            message: "user is not authorized",
          });
        }
      } else {
        return res.status(403).json({
          message: "password is incorrect",
        });
      }
    } else {
      return res.status(403).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const getID: any = jwt.verify(token, "secret", (err: any, payload: any) => {
      if (err) {
        return err;
      } else {
        return payload;
      }
    });

    const user = await authModel.findByIdAndUpdate(
      getID.id,
      { token: "", verify: true },
      { new: true }
    );
    return res.status(201).json({
      message: "verification successful",
      data: user,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: "error",
      data: error.message,
    });
  }
};

export const firstVerified = async (req: Request, res: Response) => {
  try {
    const { secretKey } = req.body;
    const { token } = req.params;

    jwt.verify(token, "secret", async (err: any, payload: any) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }

      const user: any = await authModel.findByIdAndUpdate(
        payload.id,
        { secretKey },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      user.secretKey = secretKey;
      try {
        await user.save();
        sendAccountMail(user).then(() => {
          console.log("sent verification email");
        });
        return res.status(201).json({
          message: "success",
          data: user,
        });
      } catch (emailError: any) {
        return res.status(500).json({
          message: "Error sending verification email",
          data: emailError.message,
        });
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Internal server error",
      data: error.message,
    });
  }
};
