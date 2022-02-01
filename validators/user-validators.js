const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
    return [

        body('firstName').trim().not().isEmpty().withMessage('First Name can not be empty'),
        body('lastName').trim().not().isEmpty().withMessage('Last Name can not be empty'),
        body('dob').not().isEmpty().withMessage('DOB can not be empty'),
        body('mobile').not().isEmpty().withMessage('Mobile number can not be empty'),
        body('mobile').isInt().withMessage('It should be number').isLength({ min: 10, max: 12 })
            .withMessage('Must be at least 10 chars long'),
        // username must be an email
        body('email').not().isEmpty().withMessage('Email can not be empty').isEmail().withMessage("Invalid Email"),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }).withMessage("Password should be greater than 5 chars long"),
    ]
}

const loginValidationRules = () => {
    return [
        // username must be an email
        body('email').not().isEmpty().withMessage('Email can not be empty').isEmail().withMessage("Invalid Email"),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }).withMessage("Password should be greater than 5 chars long"),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    loginValidationRules,
    validate,
}