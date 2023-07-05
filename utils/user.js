const users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return {
      error: "Username and Room name are required.",
    };
  }

  const userExist = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (userExist) {
    return {
      error: "Username already exist.",
    };
  }

  const user = { id, username, room };
  users.push(user);

  return { user };
};
