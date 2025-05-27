const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');


const authController = {
};

module.exports = authController;