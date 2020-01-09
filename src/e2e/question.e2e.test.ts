import {
    answerQuestion,
    createQuestion,
    question
} from "./question.api";
import { createTestQuestion } from "./helpers";

describe("Question", () => {
    describe("createQuestion(text: String!, popularity: Int!, category: String!): Question", () => {
        it("creates and returns newly created Question", async () => {
            const text = "What is this test for?";
            const popularity = 10;
            const category = "test";

            const { data } = await createQuestion({text, popularity, category});
            const question = data.data.createQuestion;

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
    });

    describe("answerQuestion(QUE_ID: String!, text: String!, score: Int!, type: String!): Question", () => {
        it("answers a specific question and returns Question's answer record", async () => {
            const question = "What is your hair colour?";
            const popularity = 200000;
            const category = "test";

            const createdQuestion = await createTestQuestion(question, popularity, category);

            const answer = "blond";
            const score = 10000;
            const type = "text";
            const { data } = await answerQuestion({
                QUE_ID: createdQuestion.ID,
                text: answer,
                score,
                type
            });

            expect(data.data.answerQuestion).toEqual({
                ID: expect.any(String), // regex QUE_*
                RecordType: expect.any(String), // fix it with regex AR_ANS_*
                text: answer,
                popularity: score,
                category: type,
                date: expect.any(String), // timestamp regex ?
            })
        });
    });
});
