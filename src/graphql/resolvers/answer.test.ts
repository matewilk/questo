import answerResolver from "./answer";

jest.mock("shortid", () => {
  return {
    generate: () => "123456789",
  };
});

describe("Answer Resolver", () => {
  const fakeDateNow = 1576017504620;
  let realDateNow: () => number;
  let dateNowStub;

  beforeEach(() => {
    realDateNow = Date.now.bind(global.Date);
    dateNowStub = jest.fn(() => fakeDateNow);
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    global.Date.now = realDateNow;
  });

  const dataSourcesMock = {
    dataSources: {
      questoSource: {
        putRecord: jest.fn(),
        getRecord: jest.fn().mockImplementation(() => ({
          ID: "ANS_123456789",
          RecordType: "ANS",
          text: "getRecord item",
          score: 20,
          type: "boolean",
          date: 1575933092219,
        })),
        query: jest.fn().mockImplementation(() => ({
          Items: [
            {
              ID: "QUE_123",
              RecordType: "AR_ANS_1",
              text: "test answer 1",
              score: 10,
              type: "test type",
              date: 1578586873397,
            },
            {
              ID: "QUE_123",
              RecordType: "AR_ANS_2",
              text: "test answer 2",
              score: 10,
              type: "test type",
              date: 1578586894013,
            },
          ],
        })),
      },
    },
  };

  describe("Query", () => {
    const { Query } = answerResolver;

    it("answers resolver should return all answers to a question", async () => {
      const QUE_ID = "QUE_123";
      const args = {
        QUE_ID: QUE_ID,
      };
      const queryArgsExpectation = {
        KeyConditionExpression: "ID=:id and begins_with(RecordType, :rtype)",
        ExpressionAttributeValues: { ":id": QUE_ID, ":rtype": "AR_ANS" },
      };

      const result = await Query.answers(null, args, dataSourcesMock);

      expect(
        dataSourcesMock.dataSources.questoSource.query
      ).toHaveBeenCalledWith(queryArgsExpectation);
      expect(result).toEqual([
        {
          ID: "QUE_123",
          RecordType: "AR_ANS_1",
          answer: "test answer 1",
          score: 10,
          type: "test type",
          date: 1578586873397,
        },
        {
          ID: "QUE_123",
          RecordType: "AR_ANS_2",
          answer: "test answer 2",
          score: 10,
          type: "test type",
          date: 1578586894013,
        },
      ]);
    });
  });

  describe("Mutation", () => {
    const { Mutation } = answerResolver;

    it("createAnswer resolver should create and immediately get and return answer record", async () => {
      const args = { text: "answer to question", score: 20, type: "boolean" };
      const ID = "ANS_123456789";

      const result = await Mutation.createAnswer(null, args, dataSourcesMock);

      expect(
        dataSourcesMock.dataSources.questoSource.putRecord
      ).toHaveBeenCalledWith({
        ID,
        RecordType: `${process.env.ANSWER_PREFIX}`,
        text: "answer to question",
        score: 20,
        type: "boolean",
        date: fakeDateNow,
      });
      expect(
        dataSourcesMock.dataSources.questoSource.getRecord
      ).toHaveBeenCalledWith({
        ID,
        RecordType: `${process.env.ANSWER_PREFIX}`,
      });
      expect(result).toEqual({
        ID,
        RecordType: "ANS",
        answer: "getRecord item",
        score: 20,
        type: "boolean",
        date: 1575933092219, // date from the mocked result
      });
    });
  });
});
