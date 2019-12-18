import { createQuestion, question } from "./api";

const createTestQuestion = async (text: string, popularity: number, category: string) => {
    const params = {
        text: text,
        popularity: popularity,
        category: category
    };
    const { data } = await createQuestion(params);
    return data.data.createQuestion;
};

describe("Question", () => {
    describe("createQuestion(text: String!, popularity: Int!, category: String!): Question", () => {
        it("creates and returns newly created Question", async () => {
            const text = "What is this test for?";
            const popularity = 10;
            const category = "test";

            const question = await createTestQuestion(text, popularity, category);

            expect(question).toEqual({
                text,
                popularity,
                category,
                RecordType: "QUE",
                date: expect.any(String),
                ID: expect.any(String)
            })
        });
    });

    describe("question(ID: ID!): Question", () => {
        it("returns a question record with the given ID", async () => {
            const text = "test question?";
            const popularity = 15;
            const category = "test";

            const createdQuestion = await createTestQuestion(text, popularity, category);

            const { data } = await question({ ID: createdQuestion.ID });

            expect(data.data.question).toEqual(createdQuestion);
        });
    })
});
