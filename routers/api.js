//=============== Imports ======================//
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createCourseValidation, updateCourseValidation } = require('../app/http/middlewares/courses.validation.js');
const coursesController = require('../app/http/controllers/courses.controllers.js');
const usersController = require('../app/http/controllers/users.controllers.js');
const verifyToken = require('../app/http/middlewares/verifyToken.js')
const allowedTo = require('../app/http/middlewares/AllowedTo.js')
//Set up Form-Data body
const multer = require('multer');
const ROLES_LIST = require('../config.js/roles_list.js');
const appError = require('../utlis/appError.js');
const { FAIL } = require('../utlis/httpStatus.js');

//Setup File Uploads Using Multer.
const diskStorage = multer.diskStorage({
        destination: (req, file, cb) => {
                cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
                cb(null, `${file.fieldname}-${file.originalname}`)
        }
})

const fileFilter = (req, file, cb) =>{
        fileType = file.mimetype.split('/')[0];
        fileExt = file.mimetype.split('/')[1];
        return fileType == "image" 
        ? cb(null, true) 
        : cb(appError(`The avatar cannot be ${fileExt}`,400, FAIL), false);
};

const upload = multer({ 
        storage: diskStorage,
        fileFilter
});

//=============== Course CRUD ===================//
router.route('/courses')
        .get(coursesController.getAllCourse)
        .post(verifyToken, allowedTo(ROLES_LIST.MANGER), createCourseValidation(), coursesController.addCourse);

router.route('/courses/:courseID')
        .get(coursesController.getCourse)
        .patch(updateCourseValidation(), coursesController.updateCourse)
        .delete(verifyToken, allowedTo(ROLES_LIST.ADMIN, ROLES_LIST.MANGER), coursesController.deleteCourse);

//=============== Authentication ===================//
router.route('/users')
        .get(verifyToken, usersController.getAllUsers);
router.route('/login')
        .post(upload.none(), usersController.login);
router.route('/register')
        .post(upload.single('avatar'), usersController.register);

//=================== Exports ======================//
module.exports = router;