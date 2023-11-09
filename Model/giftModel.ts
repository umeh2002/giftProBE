import mongoose from "mongoose";
import { iWalletData } from "../utils/interface";

const giftModel = new mongoose.Schema<iWalletData>(
  {
    userID: {
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "auths",
    },
    amount: {
      type: Number,
    },
    email: {
      type: String,
    },
    typeOfTransaction: {
      type: String,
      enum: ['credit', 'debit']
    },
  },
  { timestamps: true }
);

export default mongoose.model<iWalletData>("gifts", giftModel);
