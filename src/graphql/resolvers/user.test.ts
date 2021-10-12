import userResolver from "./user";

jest.mock("shortid", () => {
  return {
    generate: () => "123456789",
  };
});

jest.useFakeTimers();

describe("User Resolver", () => {
  let dataSourcesMock;
  beforeEach(() => {
    dataSourcesMock = {
      dataSources: {
        questoSource: {
          putRecord: jest.fn(),
          getRecord: jest.fn().mockImplementation(() => ({
            ID: "USR_123",
            RecordType: "USR",
            text: "Bob Swarovski",
            score: 0,
            type: "USER",
            date: 819170640000 /* 1995-12-17T03:24:00 */,
          })),
        },
      },
    };
  });

  afterEach(() => jest.resetAllMocks());

  describe("Query", () => {
    const { Query } = userResolver;

    describe("user resolver", () => {
      it("should call getRecord questoSource method and return user record", async () => {
        const args = {
          ID: "USR_123",
          RecordType: `${process.env.USER_PREFIX}`,
        };

        const result = await Query.user(null, args, dataSourcesMock);

        expect(
          dataSourcesMock.dataSources.questoSource.getRecord
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
  });
});
