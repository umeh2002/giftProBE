import mongoose from "mongoose";
import { iAuthData } from "../utils/interface";
import { iAuth } from "../utils/interface";

const authModel = new mongoose.Schema<iAuthData>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
    },
    wallet:{
      type:Number,
    },
    token: {
      type: String,
    },
    secretKey: {
      type: String,
    },
    gift:[{
      type:mongoose.Types.ObjectId,
      ref:"gifts"
    }]
  },
  { timestamps: true }
);

export default mongoose.model<iAuthData>("auths", authModel);
