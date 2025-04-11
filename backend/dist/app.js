"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const user_route_1 = require("./app/modules/user/user.route");
const post_route_1 = require("./app/modules/post/post.route");
const conversation_route_1 = require("./app/modules/conversation/conversation.route");
const admin_route_1 = require("./app/modules/admin/admin.route");
const appointment_route_1 = require("./app/modules/appointment/appointment.route");
const blood_bank_route_1 = require("./app/modules/blood-banks/blood-bank.route");
const app = (0, express_1.default)();
// ---------------------Socket io servier---------------//
const io = new socket_io_1.Server(4001, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
const connectedClients = {};
// Handle socket connections
io.on("connection", (socket) => {
    //unique client ID 
    const clientId = socket.handshake.query.clientId;
    console.log(`User connected: ${socket.id} (Client ID: ${clientId})`);
    // Store client information
    connectedClients[socket.id] = {
        socketId: socket.id,
        clientId: clientId,
        rooms: [],
    };
    //----------- Handle room joining---------
    socket.on("join-room", (room) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(room);
        // Add room to client's room list
        if (connectedClients[socket.id]) {
            connectedClients[socket.id].rooms.push(room.toString());
        }
        console.log(`Client ${socket.id} (${clientId}) joined room ${room}`);
        // Notify room members
        io.to(room).emit("joinRoomNavigate", {
            room,
            socketId: socket.id,
            clientId: clientId,
        });
        // Send details of joined room
        io.to(room).emit("joinedRoomsDetailsPass", {
            room,
            socketId: socket.id,
            clientId: clientId,
            connectedUsers: Object.values(connectedClients).filter((client) => client.rooms.includes(room.toString())),
        });
        // Associate user ID with socket
        socket.on("set-user-id", (userId) => {
            if (connectedClients[socket.id]) {
                connectedClients[socket.id].userId = userId;
                console.log(`Associated userId ${userId} with socket ${socket.id}`);
            }
        });
        // Track active user in a specific room
        socket.on("user-active-in-room", (data) => {
            const { room, userId } = data;
            console.log(`User ${userId} active in room ${room}`);
            // Broadcast to the room that this user is active
            io.to(room).emit("user-active-status", {
                userId: userId,
                isActive: true,
                room: room,
            });
        });
        // Track user leaves a specific room
        socket.on("user-inactive-in-room", (data) => {
            const { room, userId } = data;
            console.log(`User ${userId} inactive in room ${room}`);
            // Broadcast about user is inactive
            io.to(room).emit("user-active-status", {
                userId: userId,
                isActive: false,
                room: room,
            });
        });
        // Handle read status updates
        socket.on("mark-messages-read", (data) => {
            const { room, readerId } = data;
            console.log(`User ${readerId} marked messages as read in room ${room}`);
            // Broadcast about user has read messages
            io.to(room).emit("messages-marked-read", {
                room: room,
                readerId: readerId,
            });
        });
    }));
    // ----------Handle messages-----------
    socket.on("message", (data) => {
        console.log("Received message:", data);
        io.emit("new-message-alert", "fetch unread message");
        if (data.room) {
            io.to(data.room).emit("message", Object.assign(Object.assign({}, data), { socketId: socket.id, clientId: clientId }));
        }
        else {
            io.emit("message", Object.assign(Object.assign({}, data), { socketId: socket.id, clientId: clientId }));
        }
    });
    //----- Associate email with client------
    socket.on("set-user-email", (email) => {
        if (connectedClients[socket.id]) {
            connectedClients[socket.id].email = email;
            console.log(`Associated email ${email} with socket ${socket.id}`);
        }
    });
    // -------Handle disconnection------
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id} (Client ID: ${clientId})`);
        // Clean up client info
        delete connectedClients[socket.id];
    });
});
// -------------------------Basic backend server------------------------//
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// API Routes
app.use("/api/user", user_route_1.userRoutes);
app.use("/api/post", post_route_1.postRoutes);
app.use("/api/conversation", conversation_route_1.conversationRoutes);
app.use("/api/admin", admin_route_1.adminRoutes);
app.use("/api/appointment", appointment_route_1.appointmentRoutes);
app.use("/api/blood-banks", blood_bank_route_1.bloodBankRoutes);
// Default route
app.get("/", (req, res) => {
    res.send("Blood donation backend");
});
exports.default = app;
