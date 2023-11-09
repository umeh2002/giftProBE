import { Request, Response } from "express";
import giftModel from "../Model/giftModel";
import authModel from "../Model/authModel";

export const creditAmount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { email, amount } = req.body;

    const user: any = await authModel.findById(userID);

    if (user) {
      const transaction = await giftModel.create({
        email,
        amount: parseInt(amount),
        type: "credit",
      });
      user.wallet += parseInt(amount);
      await user.save();
      return res.status(201).json({
        message: "Successfully created",
        data: transaction,
      });
    } else {
      return res.status(403).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    return res.status(404).json({
      message: "Invalid credit amount",
      data: error.message,
    });
  }
};

export const creditUserAccount = async (req: Request, res: Response) => {
  try {
    const { email, amount } = req.body;
    const { userId } = req.params;
    const user = await authModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wallet += amount;
    await user.save();

    const transaction = new giftModel({
      userId: userId,
      amount: amount,
      email,
      type: "credit",
    });
    await transaction.save();

    return res
      .status(200)
      .json({ message: "Account credited successfully", data: transaction });
  } catch (error) {
    return res.status(404).json({ message: "Error", error: error.message });
  }
};

export const deditAmount = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const { amount, email } = req.body;

    const user = await authModel.findById(userID);

    if (user) {
      if (user.wallet < amount) {
        return res.status(404).json({
          message: "insufficient funds",
        });
      } else {
        const transaction = await giftModel.create({
          email,
          amount: parseInt(amount),
          type: "debit",
        });
        user.wallet -= amount;
        await user.save();
        return res.status(201).json({
          message: "withdraw transaction",
          data: transaction,
        });
      }
    } else {
      return res.status(404).json({
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
