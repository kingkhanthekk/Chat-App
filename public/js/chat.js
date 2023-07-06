const socket = io();

const messages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  //New message element
  const newMessage = messages.lastElementChild;

  //Height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  //Visible height
  const visibleHeight = messages.offsetHeight;

  //Messages container height
  const containerHeight = messages.scrollHeight;

  //How far the messages are scrolled
  const scrolledOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrolledOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    time: moment(message.createdAt).format("d MMM, h:m a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
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
    username: message.username,
    url: message.text,
    time: moment(message.createdAt).format("d MMM, h:m a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;
const sidebar = document.querySelector("#sidebar");

socket.on("roomUsers", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  sidebar.innerHTML = html;
});
