import Joi from 'joi'

export const signUpSchema = {
    body :Joi.object({
        email : Joi.string().email(),
        phoneNumber : Joi.string(),
        userName : Joi.string().alphanum().min(3).max(15).required(),
        password :  Joi.string().min(5).required().pattern(/[a-z]/, 'lowercase').pattern(/[A-Z]/, 'uppercase').pattern(/[0-9]/, 'number'),
        gender : Joi.string().valid("male","female"),
        confirmPassword : Joi.valid(Joi.ref('password')).required()
    })
}
