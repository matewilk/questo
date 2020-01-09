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
                    { ID: "QUE_123", RecordType: "QUE", text: "getRecord item", score: 10, type: "politics", date: 1575933092219 }
                )),
                query: jest.fn().mockImplementation(() => ([
                        { ID: "QUE_123", RecordType: "QUE", text: "scan item 1", score: 20, type: "sport", date: 1575933092223 },
                        { ID: "QUE_987", RecordType: "QUE", text: "scan item 2", score: 30, type: "news", date: 1575933095678 }
                    ]
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

            expect(dataSourcesMock.dataSources.questoSource.query).toHaveBeenCalledWith(args);
            expect(result).toEqual([
                { ID: "QUE_123", RecordType: "QUE", text: "scan item 1", popularity: 20, category: "sport", date: 1575933092223 },
                { ID: "QUE_987", RecordType: "QUE", text: "scan item 2", popularity: 30, category: "news", date: 1575933095678 }
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
                category: "politics",
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

        describe("createQuestion", () => {
            it("should create and immediately get and return question record", async () => {
                const args = { text: "question text", popularity: 10, category: "test" };
                const ID = "QUE_987654321";

                const result = await Mutation.createQuestion(null, args, dataSourcesMock);

                expect(dataSourcesMock.dataSources.questoSource.putRecord).toHaveBeenCalledWith({
                    ID: ID,
                    RecordType: `${process.env.QUESTION_PREFIX}`,
                    text: "question text",
                    score: 10,
                    type: "test",
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
                    category: "politics",
                    date: 1575933092219, // date from the mocked result
                    popularity: 10,
                });
            });

            it("should call Date.now() when calling putRecord db adapter method", async () => {
                const args = { text: "question text" };

                await Mutation.createQuestion(null, args, dataSourcesMock);

                expect(dateNowStub).toHaveBeenCalledTimes(1);
            });

            it("should map score & type property to popularity & category respectively", async () => {
                const args = { text: "question text" };

                const result = await Mutation.createQuestion(null, args, dataSourcesMock);

                expect(result).toEqual({
                    text: "getRecord item",
                    ID: "QUE_123",
                    RecordType: "QUE",
                    category: "politics",
                    date: 1575933092219,
                    popularity: 10,
                });
            });
        });

        describe("answerQuestion", () => {
            beforeEach(() => {
                dataSourcesMock.dataSources.questoSource.getRecord
                    .mockImplementation(() => (
                        { ID: "QUE_123", RecordType: "AR_ANS_987654321", text: "answer to question", score: 50, type: "boolean", date: 1575933092219 }
                    ));
            });

           it("should create ANS record", async () => {
                const answerArgs = { QUE_ID: "ANS_123", text: "answer to question", score: 50, type: "boolean" };

                await Mutation.answerQuestion(null, answerArgs, dataSourcesMock);

               expect(dataSourcesMock.dataSources.questoSource.putRecord).toHaveBeenCalledWith({
                   ID: "ANS_987654321", // mocked shortid value
                   RecordType: `${process.env.ANSWER_PREFIX}`,
                   text: "answer to question",
                   score: 50,
                   type: "boolean",
                   date: fakeDateNow
               });
           });

           it("should create & return QUE record with appropriate QUE_ID and ANS_ID", async () => {
               const answerArgs = { QUE_ID: "QUE_123", text: "answer to question", score: 50, type: "boolean" };

               await Mutation.answerQuestion(null, answerArgs, dataSourcesMock);

               expect(dataSourcesMock.dataSources.questoSource.putRecord).toHaveBeenCalledWith({
                   ID: "QUE_123", // mocked shortid value
                   RecordType: "AR_ANS_987654321",
                   text: "answer to question",
                   score: 50,
                   type: "boolean",
                   date: fakeDateNow
               });
           });

           it("should return created QUE record with AR as SK", async () => {
               const answerArgs = { QUE_ID: "QUE_123", text: "answer to question", score: 50, type: "boolean" };

               const result = await Mutation.answerQuestion(null, answerArgs, dataSourcesMock);

               expect(result).toEqual({
                   ID: "QUE_123",
                   RecordType: "AR_ANS_987654321",
                   text: "answer to question",
                   popularity: 50,
                   category: "boolean",
                   date: 1575933092219
               });
           })
        });
    });
});
