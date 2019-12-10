import answerResolver from './answer';

jest.mock("shortid", () => {
    return {
        generate: () => '123456789'
    }
});

describe("Answer Resolver", () => {
    const dataSourcesMock = {
        dataSources: {
            questoSource: {
                putRecord: jest.fn(),
                getRecord: jest.fn().mockImplementation(() => (
                    { ID: "ANS_123456789", RecordType: "ANS", text: "getRecord item", score: 20, type: "boolean", date: 1575933092219 }
                )),
                scan: jest.fn().mockImplementation(() => ([
                        { ID: "ANS_123", RecordType: "ANS", text: "scan item 1", score: 20, type: "discrete", date: 1575933092223 },
                        { ID: "ANS_987", RecordType: "QUE", text: "scan item 2", score: 30, type: "boolean", date: 1575933095678 }
                    ]
                ))
            }
        }
    };

    describe("Mutation", () => {
        const { Mutation } = answerResolver;
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

        it("createAnswer resolver should create and immediately get and return answer record", async () => {
            const args = { text: "answer to question", score: 20, type: "boolean" };
            const ID = "ANS_123456789";

            const result = await Mutation.createAnswer(null, args, dataSourcesMock);

            expect(dataSourcesMock.dataSources.questoSource.putRecord).toHaveBeenCalledWith({
                ID,
                RecordType: `${process.env.ANSWER_PREFIX}`,
                text: "answer to question",
                score: 20,
                type: "boolean",
                date: fakeDateNow
            });
            expect(dataSourcesMock.dataSources.questoSource.getRecord).toHaveBeenCalledWith({
                ID,
                RecordType: `${process.env.ANSWER_PREFIX}`
            });
            expect(result).toEqual({
                ID,
                RecordType: "ANS",
                answer: "getRecord item",
                score: 20,
                type: "boolean",
                date: 1575933092219 // date from the mocked result
            })
        })
    });
});
