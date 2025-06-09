# 🌐 PortLife Server

This is the **relay server** component of the PortLife project. It listens for WebSocket connections from clients and HTTP requests from users. When an HTTP request is received, it forwards it to the connected client, waits for a response, and sends it back to the original requester.

## 📦 What It Does

- Accepts any HTTP request at `http://your-server.com/{clientId}/...`
- Matches the `{clientId}` with a connected WebSocket client
- Forwards the request to the client via WebSocket
- Waits for a response and sends it back to the requester

## 🚀 How to Run

```bash
git clone https://github.com/wajih-awad/portLife-server
cd portLife-server
npm install
node server.js
```

The server will start on port `8080`. (You can change it from the server.js file)

## 📂 File Structure

- `index.js`: main relay server logic
- Handles all HTTP methods (`GET`, `POST`, etc.)
- Supports proxying of binary/image content via base64 encoding

## 🧩 Related Project

You must pair this with the client:
👉 [PortLife Client](https://github.com/wajih-awad/portlife-client)
