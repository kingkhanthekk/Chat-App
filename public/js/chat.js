const socket = io();

socket.on("message", (message) => {
  console.log(message);
});

const form = document.querySelector("form");
const formInput = form.querySelector("input");
const formButton = form.querySelector("button");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //Disable button when a message in submitted
  formButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, (error) => {
    //Enable button when message is sent
    formButton.removeAttribute("disabled");
    //Clear input and focus
    formInput.value = "";
    formInput.focus();

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
    socket.emit("shareLocation", location, () => {
      console.log("Location shared!");
    });
  });
});
