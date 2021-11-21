import userResolver from "./user";
import { handleAuth, logout } from "../../helpers/passport-authentication";
import { AuthenticationError } from "apollo-server";

jest.mock("../../helpers/passport-authentication", () => {
  return {
    handleAuth: jest.fn().mockImplementation(() => ({ text: "test" })),
    logout: jest.fn().mockImplementation(() => ({ success: true })),
  };
});

describe("User Auth (Resolver)", () => {
  describe("Query", () => {
    const { Query } = userResolver;

    describe("logout resolver", () => {
      it("should return logout success boolean", async () => {
        const fakeReq = { fake: "request" };

        const result = await Query.logout(null, null, { req: fakeReq });

        expect(logout).toHaveBeenCalledWith(fakeReq);
        expect(result).toEqual({ success: true });
      });

      it("should return AuthenticationError on error", async () => {
        const fakeReq = { fake: "request" };
        logout.mockImplementation(async () =>
          Promise.reject(new AuthenticationError("Auth failed!"))
        );

        await expect(
          Query.logout(null, null, { req: fakeReq })
        ).rejects.toThrow(AuthenticationError);
      });
    });
  });

  describe("Mutation", () => {
    const { Mutation } = userResolver;

    describe("login resolver", () => {
      it("should call handleAuth with params and return its result", async () => {
        const name = "test";
        const password = "testpassword";
        const fakeReq = { req: "fake req" };
        const result = await Mutation.login(
          null,
          { name, password },
          { req: fakeReq }
        );

        expect(handleAuth).toHaveBeenCalledWith(name, password, fakeReq);
        expect(result).toMatchObject({ name });
      });
    });
  });
});
