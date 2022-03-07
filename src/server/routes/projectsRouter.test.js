const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Project = require("../../database/models/Project");
const connectDB = require("../../database");
const app = require("..");

let mongoServer;
const mockedProjects = [
  {
    id: "1",
    name: "Project 1",
    student: "Student 1",
  },
  {
    id: "2",
    name: "Project 2",
    student: "Student 2",
  },
];

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectDB(connectionString);
});

beforeEach(async () => {
  await Project.create(mockedProjects[0]);
  await Project.create(mockedProjects[1]);
});

afterEach(async () => {
  await Project.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a /projects/ endpoint", () => {
  describe("When it receives a GET request with no token", () => {
    test("Then it should respond with a 400 status and a 'Validation Failed' error", async () => {
      const path = "/projects/";
      const expectedResponse = {
        error: true,
        message: "Validation Failed",
      };

      const { body } = await request(app).post(path).expect(400);

      expect(body).toEqual(expectedResponse);
    });
  });

  describe("When it receives a GET request with an invalid token", () => {
    test("Then it should respond with a 401 status and a 'Token invalid' error", async () => {
      const path = "/projects/";
      const expectedResponse = {
        error: true,
        message: "Token invalid",
      };

      const { body } = await request(app)
        .post(path)
        .set(
          "Authorization",
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDY2ODUxNDYsImV4cCI6MTY3ODIyMTE0NiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.vIfiyyDOAQrHizc_UdS-ViiEN9b_RIF3U3CVGQeZ-t0"
        )
        .expect(401);

      expect(body).toEqual(expectedResponse);
    });
  });
});
