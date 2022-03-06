const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/User");
const { loginUser, registerUser } = require("./users");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../database/models/User");

describe("Given a loginUser controller", () => {
  describe("When it's invoked with right credentials", () => {
    test("Then it should call json method of the response with a generated token", async () => {
      const req = {
        body: {
          username: "right",
          password: "right",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const existingUser = {
        id: 3,
        name: "Mario",
      };
      const token = "test-token";

      User.findOne = jest.fn().mockResolvedValue(existingUser);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(token);

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ token });
    });
  });

  describe("When it's invoked with wrong username", () => {
    test("Then it should call next function with a 401 error with 'Wrong credentials' message", async () => {
      const req = {
        body: {
          username: "wrong",
          password: "right",
        },
      };
      const existingUser = null;
      const expectedError = {
        statusCode: 401,
        message: "Wrong credentials",
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(existingUser);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it's invoked with wrong password", () => {
    test("Then it should call next function with a 401 error with 'Wrong credentials' message", async () => {
      const req = {
        body: {
          username: "right",
          password: "wrong",
        },
      };
      const existingUser = {
        id: 3,
        name: "Mario",
      };
      const expectedError = {
        statusCode: 401,
        message: "Wrong credentials",
      };
      const next = jest.fn();
      User.findOne = jest.fn().mockResolvedValue(existingUser);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a registerUser controller", () => {
  describe("When it's invoked with a new user", () => {
    test("Then it should call method status with 201 and method json with {}", async () => {
      const req = {
        body: {
          username: "new-user",
          password: "new-user",
          name: "New User",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const status = 201;
      bcrypt.hash = jest.fn().mockReturnValue("hashedpassword");
      User.create = jest.fn().mockResolvedValue();

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith({});
    });
  });

  describe("When it's invoked with an existent user", () => {
    test("Then it should call method next with a 409 error with 'User already exists' message", async () => {
      const req = {
        body: {
          username: "existing-user",
          password: "existing-user",
          name: "Existing User",
        },
      };

      bcrypt.hash = jest.fn().mockReturnValue("hashedpassword");
      User.create = jest.fn().mockRejectedValue();
      const next = jest.fn();
      const expectedError = {
        statusCode: 409,
        message: "User already exists",
      };

      await registerUser(req, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
