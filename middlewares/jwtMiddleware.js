const jwt = require("jsonwebtoken");
const db = require('../models');
require('dotenv').config();

const { JWT_SECRET_KEY } = require('../constants');


const jwtMiddleware = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader){
        next();
        return;
    }

    const token = authorizationHeader.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, JWT_SECRET_KEY);
        const subjectId = payload.sub;

        // Include the role
        const user = await db.User.findByPk(subjectId, {
            include: [{model: db.Role, as: 'userRole'}]
        });

        if(!user){
            console.error('No user found for the given token');
            next();
            return;
        }

        req.userData = user;
    } catch(e){
        console.log('Invalid token');
    }

    next();
}

module.exports = jwtMiddleware;