//================== Imports ====================//
const mongoose = require('mongoose');
const appError = require('../../../utlis/appError');
const httpStatus = require('../../../utlis/httpStatus');
const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../../../utlis/generateJWT');
const env = require('dotenv');
env.config();
//=================== CRUD =======================//

//Get all users
const getAllUsers = asyncWrapper(
    async (req, res) => {
        const query = req.query;
        const limit = query.limit;
        const page = Math.max(1, parseInt(query.page, 10) || 1);
        let totalUsers = await User.countDocuments();

        const users = await User.find({}, {"__v": false, "password": false}).limit(limit).skip((page-1) * limit);
        res.status(200).json({status: httpStatus.SUCCESS,
            data: {
                users,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalUsers/limit),
                    totalUsers,
                    hasNextPage: page * limit < totalUsers,
                    hasPrevPage: page > 1
                }}});
    }
);

const register = asyncWrapper(
    async (req, res, next) => {
        const { firstName, lastName, email, password, role } = req.body;
        const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
        console.log(avatar);
        const isExist = await User.findOne({email: email});
        if(isExist)
           return next(appError('The email is already exist', 400, httpStatus.FAIL))
        //Hashing Password
        let hashedPassword = await bcrypt.hash(password, 10);

        let newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar
        });

        //Generate Token
        let token = await generateToken({email: newUser.email, id: newUser._id, role: newUser.role}, '10s');
        newUser.token = token;
        await newUser.save();
        newUser = await User.findById(newUser._id).select('-__v -password');
        res.status(201).json({status: httpStatus.SUCCESS, data: {user: newUser}});
    }
);

const login = asyncWrapper(
    async (req, res, next) => {
        var { email, password } = req.body;
        if(!email || !password)
            return next(appError('Email and password are required', 400, httpStatus.FAIL));

        var user = await User.findOne({ email: email }, {'__v': false});
        if(!user)
            return next(appError('The credentials are not correct', 404, httpStatus.FAIL));
        var matchedPassword = await bcrypt.compare(password, user.password);
        if(user && !matchedPassword)
            return next(appError('The credentials are not correct', 404, httpStatus.FAIL));

        const userObj = user.toObject();
        delete userObj.password;

        let token = await generateToken({email: user.email, id: user._id, role: user.role}, '15m');
        let refreshToken = user.refreshToken;
        user.token = token; 

        res.status(200).json({status: httpStatus.SUCCESS, data: { token: token, refreshToken: refreshToken} });
    }
);

module.exports = {
    getAllUsers,
    register,
    login
};