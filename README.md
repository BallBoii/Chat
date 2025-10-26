# Chat - Real-time Web Chat Application

A modern, real-time chat application frontend built with Next.js, React, and Socket.IO.

## Features

- 🚀 Real-time messaging using WebSocket (Socket.IO)
- 💬 Clean and responsive chat interface
- 🎨 Dark mode support
- ✨ Modern UI with Tailwind CSS
- 📱 Mobile-friendly design
- ⚡ Built with Next.js 15 and React 19
- 🔒 TypeScript for type safety

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- A Socket.IO server running (see Backend Setup below)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/BallBoii/Chat.git
cd Chat
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your WebSocket server URL:
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Lint

To run the linter:

```bash
npm run lint
```

## Backend Setup

This frontend application requires a Socket.IO backend server. The server should support the following events:

### Server Events (Emit to Client):
- `connect` - When client connects to the server
- `disconnect` - When client disconnects
- `message` - Broadcast new messages to all clients
- `chat-history` - Send message history to newly connected clients

### Client Events (Emit to Server):
- `send-message` - Send a new message to the server

### Example Message Format:
```typescript
{
  id: string;
  username: string;
  text: string;
  timestamp: Date;
}
```

### Simple Backend Example:

Create a basic Socket.IO server in a separate project:

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const messages = [];

io.on('connection', (socket) => {
  console.log('User connected');
  
  // Send chat history to new user
  socket.emit('chat-history', messages);
  
  socket.on('send-message', (message) => {
    const newMessage = {
      id: Date.now().toString(),
      username: message.username,
      text: message.text,
      timestamp: new Date()
    };
    messages.push(newMessage);
    io.emit('message', newMessage);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server running on port 3001');
});
```

## Project Structure

```
Chat/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Main chat page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ChatInput.tsx       # Message input component
│   │   ├── ChatMessages.tsx    # Message display component
│   │   ├── ConnectionStatus.tsx # WebSocket connection indicator
│   │   └── UsernameInput.tsx   # Username modal
│   ├── context/
│   │   └── SocketContext.tsx   # WebSocket context provider
│   └── types/
│       └── chat.ts             # TypeScript type definitions
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Socket.IO Client** - Real-time WebSocket communication
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
