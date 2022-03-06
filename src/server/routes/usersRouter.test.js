const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../database/models/User");
const connectDB = require("../../database");
const app = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectDB(connectionString);
});

beforeEach(async () => {
  await User.create({
    name: "Existing user",
    username: "existing-user",
    password: "hashedpassword",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a /users/register endpoint", () => {
  describe("When it receives a POST request with a new user", () => {
    test("Then it should respond with a 201 status and an empty object", async () => {
      const path = "/users/register";
      const newUser = {
        name: "A new user",
        username: "a-new-user",
        password: "a-new-user-pwd",
      };

      const { body } = await request(app).post(path).send(newUser).expect(201);

      expect(body).toEqual({});
    });
  });
});
