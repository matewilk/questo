import questionResolver from "./question";

jest.mock("shortid", () => {
    return {
        generate: () => '987654321'
    }
});

jest.useFakeTimers();

describe("Question Resolver", () => {
    const dataSourcesMock = {
        dataSources: {
            questoSource: {
                putRecord: jest.fn(),
                getRecord: jest.fn().mockImplementation(() => (
                    { Item: { ID: "QUE_123", RecordType: "QUE", text: "getRecord item", score: 10, type: " ", date: 1575933092219 } }
                )),
                scan: jest.fn().mockImplementation(() => (
                    { Items: [
                        { ID: "QUE_123", RecordType: "QUE", text: "scan item 1", score: 20, type: " ", date: 1575933092223 },
                        { ID: "QUE_987", RecordType: "QUE", text: "scan item 2", score: 30, type: " ", date: 1575933095678 }
                    ]}
                ))
            }
        }
    };

    afterEach(() => jest.restoreAllMocks());

    describe("Query", () => {
        const { Query } = questionResolver;

        it("questions resolver should call scan questoSource method", async () => {
            const args = {};

            const result = await Query.questions(null, args, dataSourcesMock);

            expect(dataSourcesMock.dataSources.questoSource.scan).toHaveBeenCalledWith(args);
            expect(result).toEqual([
                { ID: "QUE_123", RecordType: "QUE", text: "scan item 1", popularity: 20, category: " ", date: 1575933092223 },
                { ID: "QUE_987", RecordType: "QUE", text: "scan item 2", popularity: 30, category: " ", date: 1575933095678 }
            ]);
        });

        it("question resolver should call getRecord questoSource method", async () => {
            const args = { ID: "QUE_123", RecordType: `${process.env.QUESTION_PREFIX}` };

            const result = await Query.question(null, args, dataSourcesMock);

            expect(dataSourcesMock.dataSources.questoSource.getRecord).toHaveBeenCalledWith(args);
            expect(result).toEqual({
                text: "getRecord item",
                ID: "QUE_123",
                RecordType: "QUE",
                category: " ",
                date: 1575933092219,
                popularity: 10,
            })
        });
    });

    describe("Mutation", () => {
        const { Mutation } = questionResolver;
        const fakeDateNow = 1575919667866;
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

        it("createQuestion resolver should create and immediately get and return question record", async () => {
            const args = { text: "question text" };
            const ID = "QUE_987654321";

            const result = await Mutation.createQuestion(null, args, dataSourcesMock);

            expect(dataSourcesMock.dataSources.questoSource.putRecord).toHaveBeenCalledWith({
                ID: ID,
                RecordType: `${process.env.QUESTION_PREFIX}`,
                text: "question text",
                score: 0,
                type: " ",
                date: fakeDateNow
            });
            expect(dataSourcesMock.dataSources.questoSource.getRecord).toHaveBeenCalledWith({
                ID: ID,
                RecordType: `${process.env.QUESTION_PREFIX}`,
            });
            expect(result).toEqual({
                text: "getRecord item",
                ID: "QUE_123",
                RecordType: "QUE",
                category: " ",
                date: 1575933092219,
                popularity: 10,
            });
        });

        it("createQuestion resolver calls Date.now() when calling putRecord db adapter method", async () => {
            const args = { text: "question text" };

            await Mutation.createQuestion(null, args, dataSourcesMock);

            expect(dateNowStub).toHaveBeenCalledTimes(1);
        })
    });
});
