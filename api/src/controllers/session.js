const botName = 'Immersive Bot';
const formatMessage = require('../models/message');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../models/chat');

let io;

exports.init = (socketIoInstance) => {
    io = socketIoInstance;
    io.on('connection', (socket) => {
        console.log('A user has connected');
        socket.on('joinRoom', ({ username, room ,  gender }) => {
            const user = userJoin(socket.id, username, room, null , gender);
            socket.join(user.room);

            // Welcome current user
            socket.emit('message', formatMessage(botName, 'Welcome to Immersive chat!'));

            // Broadcast when a user connects
            socket.broadcast.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );
            // Notify all users that a new user has joined
            socket.broadcast.to(user.room).emit('userJoin', {
                id: user.id,
                username: user.username,
                position: user.position,
                rotation: user.rotation,
                isMoving : false,
                gender: user.gender,
            });

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
            });


            socket.on('updatePosition', ({ position, rotation }) => {
                const user = getCurrentUser(socket.id);
                console.log(position, rotation);
                if (user) {
                    console.log(user);
                    io.to(user.room).emit('updateUserPosition', {
                        id: user.id,
                        username: user.username,
                        position: position,
                        rotation: rotation,
                        gender: user.gender
                    });
                }
            });

            // Receive audio stream and broadcast to others
            // Receive audio stream and broadcast to others
            socket.on('audioStream', (audioData) => {
                const user = getCurrentUser(socket.id);
                
                // Broadcast the audio to all clients in the room, marking the current user's stream with true or false
                io.to(user.room).emit('usersAudioStream', audioData, socket.id); 
            });
  

             // Listen for chatMessage
            socket.on('chatMessage', (text) => {
            const user = getCurrentUser(socket.id);
            if(socket.id === user.id) {
                io.to(user.room).emit('message', formatMessage(user.username, text, true ));
            }else{
                io.to(user.room).emit('message', formatMessage(user.username, text, false ));
            }
            });
              
            

        });


        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if (user) {
                io.to(user.room).emit(
                    'message',
                    formatMessage(botName, `${user.username} has left the chat`)
                );
                // Emit the userLeave event to remove the avatar from the scene
                io.to(user.room).emit('userLeave', user.id);
                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }
        });
    });
};
