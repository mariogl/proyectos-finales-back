require("dotenv").config();
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../database/models/User");
const connectDB = require("../../database");
const app = require("../index");

let mongoServer;
const existingUser = {
  name: "Existing user",
  username: "existing-user",
  password: "existing-user-password",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectDB(connectionString);
});

beforeEach(async () => {
  const hashedPassword = await bcrypt.hash(
    existingUser.password,
    +process.env.ROUNDS_BCRYPT
  );
  await User.create({
    ...existingUser,
    password: hashedPassword,
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

describe("Given a /users/login endpoint", () => {
  describe("When it receives a POST request with right credentials", () => {
    test("Then it should respond with a 200 status and a token", async () => {
      const path = "/users/login";
      const user = {
        username: existingUser.username,
        password: existingUser.password,
      };

      const { body } = await request(app).post(path).send(user).expect(200);

      expect(body).toHaveProperty("token");
      expect(body.token).not.toBe("");
    });
  });

  describe("When it receives a POST request with wrong username", () => {
    test("Then it should respond with a 401 status and a 'Wrong credentials' error", async () => {
      const path = "/users/login";
      const user = {
        username: "doesnt-exist",
        password: existingUser.password,
      };
      const expectedResponse = {
        error: true,
        message: "Wrong credentials",
      };

      const { body } = await request(app).post(path).send(user).expect(401);

      expect(body).toEqual(expectedResponse);
    });
  });

  describe("When it receives a POST request with wrong password", () => {
    test("Then it should respond with a 401 status and a 'Wrong credentials' error", async () => {
      const path = "/users/login";
      const user = {
        username: existingUser.username,
        password: "doesnt-exist",
      };
      const expectedResponse = {
        error: true,
        message: "Wrong credentials",
      };

      const { body } = await request(app).post(path).send(user).expect(401);

      expect(body).toEqual(expectedResponse);
    });
  });
});
