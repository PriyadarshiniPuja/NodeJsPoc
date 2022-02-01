const { body, validationResult } = require('express-validator')
const postValidationRules = () => {
    return [

        body('title').trim().not().isEmpty().withMessage('Title can not be blank'),
        body('description').trim().not().isEmpty().withMessage('Description can not be blank'),
        body('author').not().isEmpty().withMessage('Author can not be empty')
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
    postValidationRules,
    validate,
}