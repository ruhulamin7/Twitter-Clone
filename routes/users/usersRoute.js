const getUsers = require('../../controllers/APIs/getUsers');

const usersRoute = require('express').Router();

usersRoute.get('/', getUsers);

module.exports = usersRoute;
