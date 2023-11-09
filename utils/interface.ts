import mongoose from "mongoose";

export interface iAuth {
  name: string;
  email: string;
  password: string;
  secretKey: string;
  verify: boolean;
  token: string;
  gift: {}[];
  wallet: number;
}

export interface iWallet {
  userID: string;
  amount: number;
  user: {};
  email: string;
  typeOfTransaction:'credit' | 'debit';
}

export interface iWalletData extends iWallet, mongoose.Document {}

export interface iAuthData extends iAuth, mongoose.Document {}
