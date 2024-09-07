import express, { request, response } from "express";
const app = express();
app.use(express.json());

const loggingMiddleware = (request, response, next) => {
  console.log(`${request.method} - ${request.url}`);
};
const resolveIndexByUserId = (request, response, next) => {
  const {
    params: { id },
  } = request;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return response.sendStatus(400);
  const findUserIndex = data.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return response.sendStatus(404);
  request.findUserIndex = findUserIndex;
  next();
};

const PORT = process.env.PORT || 3000;

const data = [
  { id: 1, name: "Kullu" },
  { id: 2, name: "laila" },
  { id: 3, name: "Gina" },
  { id: 4, name: "aman" },
];

const list = [
  { name: "laila", Instagram_followers: "1m" },
  { name: "gina", Instagram_followers: "2m" },
  { name: "shivam", Instagram_followers: "3m" },
];

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

app.get("/",  (request, response) => {
  response.status(201).send({ name: "Express", number: 1234 });
});

app.get("/api/user", (request, response) => {
  response.send(data);
  console.log(request.query);
  const { filter, value } = request.query;
  let filterData = data;
  if (filter && value) {
    filterData = data.filter((user) => user[filter].includes(value));
  }
  return filterData;
});
//learning post request
app.post("/api/user", (request, response) => {
  console.log(request.body);
  const { body } = request; // getting data from when sending it to the user
  const newUser = { id: data[data.length - 1].id + 1, ...body };
  data.push(newUser);
  return response.send(newUser);
});
// Learning route params: how to get a request when a user enters data on it
app.get("/api/user/:id",resolveIndexByUserId, (request, response) => {
 const {findUserIndex}=request
  const findUser = data[findUserIndex];
  if (!findUser) return response.sendStatus(404);
  return response.send(findUser);
});

app.get("/api/followers", (request, response) => {
  response.send(list);
});

// Learning route params
app.get("/api/followers/:name", (request, response) => {
  console.log(request.params);
  const parsName = request.params.name.toLowerCase(); // Convert to lowercase for case-insensitive comparison
  const findFollowers = list.find(
    (follower) => follower.name.toLowerCase() === parsName
  );
  if (!findFollowers) return response.sendStatus(404);
  return response.send(findFollowers);
});

//learning put method a put method is used to update the entire selected data
app.put("/api/user/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  data[findUserIndex] = { id: data[findUserIndex].id, ...body };
  response.sendStatus(200);
});
app.put("/api/followers/:name", (request, response) => {
  const {
    body,
    params: { name },
  } = request;
  const parsName = request.params.name.toLowerCase();
  const findFollowerIndex = list.findIndex(
    (follower) => follower.name.toLowerCase() === parsName
  );
  if (!findFollowerIndex) return response.sendStatus(404);
  list[findFollowerIndex] = { ...list[findFollowerIndex], ...body };
  response.sendStatus(200);
});

//learning patch request
app.patch("/api/user/:id", (request, response) => {
  const {
    body,
    params: { id },
  } = request;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return response.sendStatus(400);
  const findUserIndex = data.findIndex((user) => user.id === parseId);
  if (!findUserIndex) response.sendStatus(404);
  data[findUserIndex] = { ...data[findUserIndex], ...body };
  response.sendStatus(200);
});

// learning delete request
app.delete("/api/user/:id", (request, response) => {
  const {findUserIndex} =request
  data.splice(findUserIndex, 1);
  response.sendStatus(200);
});
