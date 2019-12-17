import { createQuestion } from "./api";

describe("Question", () => {
    describe("createQuestion(text: String!, popularity: Int!, category: String!): Question", () => {
        it("returns newly created Question", async () => {
            const params = {
                text: "What is your age?",
                popularity: 10,
                category: "general"
            };
            const result = await createQuestion(params);

            expect(result.data).toContainEqual({
                ...params,
                RecordType: "QUE",
                date: expect.any(String),
                ID: expect.any(String)
            })
        });
    })
});
