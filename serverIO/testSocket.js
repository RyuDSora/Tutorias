const { io } = require("socket.io-client");

const socket = io("https://tutorias-io.vercel.app", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

socket.on("connect", () => {
  console.log("Connected to socket.io server");

  // Emitir un evento user_connected para probar la conexión
  socket.emit("user_connected", "testUser");

  // Escuchar el evento active_users
  socket.on("active_users", (users) => {
    console.log("Active users:", users);
  });

  // Emitir un mensaje para probar el envío de mensajes
  socket.emit("send_message", { receptor: "testUser2", message: "Hello" });

  // Escuchar el evento receive_message
  socket.on("receive_message", (msg) => {
    console.log("Received message:", msg);
  });

  // Cerrar la conexión después de 5 segundos
  setTimeout(() => {
    socket.disconnect();
  }, 5000);
});

socket.on("disconnect", () => {
  console.log("Disconnected from socket.io server");
});
