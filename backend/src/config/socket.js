import { Server } from 'socket.io';

const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default initSocket;
