//============= Imports ================//
const mongoose = require('mongoose')
const Course = require('../../models/courses.model')
const {validationResult} = require('express-validator');
const {SUCCESS, FAIL, ERROR} = require('../../../utlis/httpStatus');
const path = require('path');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../../../utlis/appError')
//============= Functions ===============//

// Get Courses ( Pagination System )
const getAllCourse =  asyncWrapper(
 async (req, res) => {
        
            const query = req.query;
            const page = Math.max(1, parseInt(query.page, 10) || 1)
            const limit = query.limit || 10;
            const totalCourses =  await Course.countDocuments();
            const courses =  await Course.find({}, {"__v" : false}).limit(limit).skip((page - 1) * limit);

            //Return Area
            res.json({status: SUCCESS,
                 data: {
                    courses,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalCourses/limit),
                        totalCourses,
                        hasNextPage: page * limit < totalCourses,
                        hasPrevPage: page > 1
                    }
                }}); 
    }
);


const getCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseID);
        if(course)
            res.json({status: SUCCESS, data: {course}});
        else
        next(appError('Course not found', 404, FAIL));
    }
);

const addCourse = asyncWrapper(
    async (req, res, next) =>{
        console.log(req.headers)
        const errors = validationResult(req);
        if(!errors.isEmpty())
            next(appError(errors.array(), 400, FAIL))
        else{
            let newCourse =  new Course(req.body);
            await newCourse.save();
            newCourse = await Course.findById(newCourse.id).select('-_id -__v');
            res.status(201).json({status: SUCCESS, data: {course: newCourse}});
        }
     }
);

 const updateCourse = asyncWrapper( 
    async (req, res, next) => {
   
    const errors = validationResult(req);
    if(!errors.isEmpty())
        next(appError(errors.array(), 400, FAIL));
    else{
        let course = await Course.findByIdAndUpdate(req.params.courseID, {$set: {...req.body}}, {new: true});
        await course.save();
        res.status(200).json({status: SUCCESS, data: {course}});
    }
 }
);

 const deleteCourse = async (req, res) => {
    try{
        let course = await Course.findByIdAndDelete(req.params.courseID);
        if(course)
            res.json({status: SUCCESS, data: {course: 'Course deleted successfully'}});
        else
            res.status(404).json({status: FAIL, data: {course: 'Course not defined'}})
    }catch(err){
        res.status(400).json({status: ERROR, message: err.message});
    }
 };

 //=========== Module Exports ============//
 module.exports = {
    getAllCourse,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
 }