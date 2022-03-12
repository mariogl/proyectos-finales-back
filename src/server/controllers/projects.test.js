const Project = require("../../database/models/Project");
const { getAllProjects } = require("./projects");

jest.mock("../../database/models/Project");

describe("Given a getAllProjects controller", () => {
  describe("When it receives a response object", () => {
    test("Then it should invoke the response's method json with a list of projects", async () => {
      const res = {
        json: jest.fn(),
      };
      const expectedProjects = { projects: [] };

      Project.find = jest.fn().mockReturnThis();
      Project.sort = jest.fn().mockReturnThis();
      Project.populate = jest.fn().mockResolvedValue(expectedProjects.projects);

      await getAllProjects(null, res);

      expect(res.json).toHaveBeenCalledWith(expectedProjects);
    });
  });
});
