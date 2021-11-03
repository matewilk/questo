import userResolver from "./user";
import { handleAuth, logout } from "../../helpers/passport-authentication";
import { AuthenticationError } from "apollo-server";

jest.mock("../../helpers/passport-authentication", () => {
  return {
    handleAuth: jest.fn().mockImplementation(() => ({ text: "test" })),
    logout: jest.fn().mockImplementation(() => ({ success: true })),
  };
});

jest.mock("shortid", () => {
  return {
    generate: () => "123456789",
  };
});

jest.useFakeTimers();

describe("User Resolver", () => {
  let dataSourcesMock;
  const usrRecord = {
    ID: "USR_123",
    RecordType: "USR",
    text: "Bob Swarovski",
    score: 0,
    type: "USER",
    date: 819170640000 /* 1995-12-17T03:24:00 */,
  };
  beforeEach(() => {
    dataSourcesMock = {
      dataSources: {
        questoSource: {
          putRecord: jest.fn(),
          getRecord: jest.fn().mockImplementation(() => usrRecord),
          getUserById: jest.fn().mockImplementation(() => usrRecord),
        },
      },
    };
  });

  afterEach(() => jest.resetAllMocks());

  describe("Query", () => {
    const { Query } = userResolver;

    describe("user resolver", () => {
      it("should call getUserById questoSource method and return user record", async () => {
        const args = {
          ID: "USR_123",
        };

        const result = await Query.user(null, args, dataSourcesMock);

        expect(
          dataSourcesMock.dataSources.questoSource.getUserById
        ).toHaveBeenCalledWith(args);

        expect(result).toEqual({
          ID: "USR_123",
          RecordType: "USR",
          name: "Bob Swarovski",
          type: "USER",
          date: 819170640000,
          score: 0,
        });
      });
    });

    describe("currentUser resolver", () => {
      it("should return user", async () => {
        const result = await Query.currentUser(null, null, { user: usrRecord });

        expect(result).toEqual(usrRecord);
      });
    });

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
    const fakeDateNow = 1581352732745;
    let realDateNow: () => number; // typescipt type definition
    let dateNowStub;

    beforeEach(() => {
      realDateNow = Date.now.bind(global.Date);
      dateNowStub = jest.fn(() => fakeDateNow);
      global.Date.now = dateNowStub;
    });

    afterEach(() => {
      global.Date.now = realDateNow;
    });

    describe("createUser", () => {
      it("should create and immediately get and return user record", async () => {
        const args = { name: "Bob Swarovski", type: "USER" };
        const ID = "USR_123456789";

        const result = await Mutation.createUser(null, args, dataSourcesMock);

        expect(
          dataSourcesMock.dataSources.questoSource.putRecord
        ).toHaveBeenCalledWith({
          ID: ID,
          RecordType: `${process.env.USER_PREFIX}`,
          text: "Bob Swarovski",
          score: 0,
          type: "USER",
          date: fakeDateNow,
        });

        expect(
          dataSourcesMock.dataSources.questoSource.getRecord
        ).toHaveBeenCalledWith({
          ID: ID,
          RecordType: `${process.env.USER_PREFIX}`,
        });

        expect(result).toEqual({
          ID: "USR_123",
          RecordType: "USR",
          name: "Bob Swarovski", // "text" is mapped to "name"
          type: "USER",
          date: 819170640000, // date from the mocked result
          score: 0,
        });
      });
    });

    describe("login", () => {
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
        expect(result).toEqual(expect.objectContaining({ name }));
      });
    });
  });
});
