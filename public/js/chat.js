const socket = io();

socket.on("updateCount", (count) => {
  console.log("Updated count! ", count);
});

document.querySelector("#increment").addEventListener("click", () => {
  socket.emit("increment");
});
