import joi from "joi"

export const registerValidator = joi.object({
    email: joi.string().email().lowercase().trim().required(),
    password: joi.string().required(),
    name: joi.string().required(),
    confirm:joi.ref("password")
  });
  
  export const signInValidator = joi.object({
    email: joi.string().email().lowercase().trim().required(),
    password: joi.string().required(),
  });