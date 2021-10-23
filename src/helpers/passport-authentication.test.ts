import {
  deserializeUserFn,
  serializeUserFn,
  passportStrategyFn,
  handleAuth,
} from "./passport-authentication";

describe("passport.js authentication", () => {
  let doneFnMock;
  let questoSource;
  const user = {
    ID: "321",
    name: "Bob",
    passwd: "secretpassword",
  };
  beforeEach(() => {
    doneFnMock = jest.fn();
    questoSource = {
      getUserById: jest.fn().mockImplementation(() => Promise.resolve(user)),
      getUserByUsername: jest
        .fn()
        .mockImplementation(() => Promise.resolve(user)),
    };
  });

  afterEach(() => jest.resetAllMocks());

  describe("serializeUserFn", () => {
    it("should call `done` with appropriate params", () => {
      const ID = user.ID;
      serializeUserFn({ ID }, doneFnMock);

      expect(doneFnMock).toHaveBeenCalledWith(null, ID);
    });
  });

  describe("deserializeUserFn", () => {
    beforeEach(async () => {
      const ID = user.ID;
      const deserializeUser = deserializeUserFn(questoSource);
      await deserializeUser(ID, doneFnMock);
    });

    it("should call getUserById", async () => {
      expect(questoSource.getUserById).toHaveBeenCalledWith({ ID: user.ID });
    });

    it("should call `done` with appropriate params", async () => {
      expect(doneFnMock).toHaveBeenCalledWith(null, user);
    });
  });

  describe("passportStrategyFn", () => {
    const username = user.name;
    const password = "secretpassword";
    let passportStrategy;

    beforeEach(async () => {
      passportStrategy = passportStrategyFn(questoSource);
    });

    it("should call getUserByUsername", async () => {
      await passportStrategy(null, username, password, doneFnMock);

      expect(questoSource.getUserByUsername).toHaveBeenCalledWith({
        username: user.name,
      });
    });

    it("should call `done` with appropriate params if password match", async () => {
      await passportStrategy(null, username, password, doneFnMock);

      expect(doneFnMock).toHaveBeenCalledWith(null, user);
    });

    it("should call `done` with appropriate params if password DOES NOT match", async () => {
      await passportStrategy(null, username, "wrongpassword", doneFnMock);

      expect(doneFnMock).toHaveBeenCalledWith(null, false);
    });
  });
});
