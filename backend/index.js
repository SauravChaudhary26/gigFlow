const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');

const gigRoutes = require('./src/routes/gigRoutes');
const bidRoutes = require('./src/routes/bidRoutes');

dotenv.config();

const port = process.env.PORT || 8080;
const frontendUrl = 'http://localhost:5173';

connectDB();

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: frontendUrl,
        methods: "*"
    }
});

// Socket.io connection logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join room based on userId
    const userId = socket.handshake.query.userId;
    if (userId) {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    }

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

app.use(cors({
    origin: frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

app.get('/', (req, res) => {
    res.send('Server is running fantastically');
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
