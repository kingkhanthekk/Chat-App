const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    if (error) return console.log(error);

    console.log("Message delivered!");
  });
});

document.querySelector("#share-location").addEventListener("click", () => {
  if (!navigator.geolocation) alert("Your browser doesn't support this!");

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("shareLocation", location);
  });
});
