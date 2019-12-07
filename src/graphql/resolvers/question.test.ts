import questionResolver from "./question";

jest.mock("shortid", () => {
    return {
        generate: () => '987654321'
    }
});

describe("Question Resolver", () => {
    const dataSourcesMock = {
        dataSources: {
            questoSource: {
                putRecord: jest.fn(),
                getRecord: jest.fn().mockImplementation(() => ({ Item: {test: "getRecord item" } })),
                scan: jest.fn().mockImplementation(() => ({ Items: [{ test: "scan item 1" }, { test: "scan item 2"}] }))
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
            expect(result).toEqual([{ test: "scan item 1" }, { test: "scan item 2" }]);
        });

        it("question resolver should call getRecord questoSource method", async () => {
            const args = { ID: "QUE_123", RecordType: "__meta__" };

            const result = await Query.question(null, args, dataSourcesMock);

            expect(dataSourcesMock.dataSources.questoSource.getRecord).toHaveBeenCalledWith(args);
            expect(result).toEqual({ test: "getRecord item" })
        });
    });

    describe("Mutation", () => {
        const { Mutation } = questionResolver;

        it("createQuestion resolver should create and immediately get and return question record", async () => {
            const args = { text: "question text"};
            const ID = "QUE_987654321";

            const result = await Mutation.createQuestion(null, args, dataSourcesMock);

            expect(dataSourcesMock.dataSources.questoSource.putRecord).toHaveBeenCalledWith({
                ID: ID, RecordType: "__meta__", text: "question text", params: {}
            });
            expect(dataSourcesMock.dataSources.questoSource.getRecord).toHaveBeenCalledWith({
                ID: ID, RecordType: "__meta__"
            });
            expect(result).toEqual({ test: "getRecord item"});
        });
    });
});
