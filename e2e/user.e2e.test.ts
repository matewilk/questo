import { createUser, user, logout } from "./user.api";

// TODO: add login user tests (fake user needed)
describe("User", () => {
  describe("createUser(name: String!, type: String!): User", () => {
    it("creates and returns newly created User", async () => {
      const name = "Bob Kowalski";
      const type = "ADMIN";

      const { data } = await createUser({ name, type });
      const user = data.data.createUser;

      expect(user).toEqual({
        name,
        type,
        score: 0,
        RecordType: "USR",
        date: expect.any(String),
        ID: expect.any(String),
      });
    });
  });

  describe("user(ID: ID!): User", () => {
    it("returns user record with the given ID", async () => {
      const name = "Bob Kowalski";
      const type = "ADMIN";

      const result = await createUser({ name, type });
      const createdUser = result.data.data.createUser;

      const { data } = await user({ ID: createdUser.ID });

      expect(data.data.user).toEqual(createdUser);
    });
  });

  describe("logout", () => {
    it("returns logout success boolean status", async () => {
      const { data } = await logout();
      const { success } = data.data.logout;

      expect(success).toEqual(true);
    });
  })
});
