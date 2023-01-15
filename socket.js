const { Server } = require('socket.io');
const http = require('http');
const httpServer = http.createServer();
const mongoose = require('mongoose');
const User = require('./models/User');
const { updateCacheData } = require('./utils/cacheManager');

const io = new Server(httpServer, {
  cors: ['http://localhost:3000', 'https://127.0.0.1:3000'],
  headers: ['POST', 'GET', 'PUT', 'DELETE'],
});

// user connection
io.on('connection', (socket) => {
  // new user setup
  socket.on('setup', (user) => {
    console.log(user.firstName + ' connected');
    socket.join(user._id);
    io.to(user._id).emit('connected');

    // user disconnection
    let isUserBack = true;
    socket.on('disconnect', () => {
      setTimeout(() => {
        let isActive = [...io.sockets.adapter.rooms.keys()].includes(user._id);
        if (!isActive) {
          User.findByIdAndUpdate(
            user._id,
            { $set: { activeStatus: false, lastSeen: new Date() } },
            { new: true }
          )
            .then((result) => {
              if (result) {
                updateCacheData(`users:${result._id}`, result);
                console.log(result);
                console.log(user.firstName + ' disconnected');
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log('User is back');
        }
      }, 10000);
    });
  });
});

let roomIds = [];
setInterval(async () => {
  roomIds = [...io.sockets.adapter.rooms.keys()];

  roomIds.forEach((id) => {
    if (mongoose.isValidObjectId(id)) {
      User.findByIdAndUpdate(
        id,
        { $set: { activeStatus: true } },
        { new: true }
      )
        .then((result) => {
          if (result) {
            updateCacheData(`users:${result._id}`, result);
            // console.log(roomIds);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}, 10000);
// module exports
module.exports = httpServer;
