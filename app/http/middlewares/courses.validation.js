const {body} = require('express-validator');

const createCourseValidation = () => {
    return [
                body('title')
                    .notEmpty().withMessage('The title field is required')
                    .isLength({min: 6, max: 128}).withMessage('The title length must be between 6-150 character'),
                body('price')
                    .notEmpty().withMessage('The price field is required')
                    .isLength({min: 1, max: 1000}).withMessage('The price must be 1 at least.')
                    .isNumeric().withMessage('The price field must be a number')
                ];
};

const updateCourseValidation = () => {
    return [
        body('title')
            .optional()
            .isLength({min: 6, max: 128}).withMessage('The title length must be between 6-128 character'),
        body('price')
            .optional()
            .isNumeric()
     ];
};

module.exports = {
    createCourseValidation,
    updateCourseValidation
};