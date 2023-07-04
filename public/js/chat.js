const socket = io();

const messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room });

socket.on("message", (message) => {
  console.log(message);

  const html = Mustache.render(messageTemplate, {
    message: message.text,
    time: moment(message.createdAt).format("d MMM, h:m a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
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

const locationButton = document.querySelector("#share-location");

locationButton.addEventListener("click", () => {
  //Disable when pressed
  locationButton.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) alert("Your browser doesn't support this!");

  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    socket.emit("shareLocation", location, () => {
      //Enable button when location sent
      locationButton.removeAttribute("disabled");

      console.log("Location shared!");
    });
  });
});

const locationMessageTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationMessageTemplate, {
    url: message.text,
    time: moment(message.createdAt).format("d MMM, h:m a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  console.log(message);
});
