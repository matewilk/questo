import { answers } from "./answer.api";
import { answerQuestion } from "./question.api";
import { createTestQuestion } from "./helpers";

describe("Answer", () => {
  let testQuestion;
  beforeAll(async () => {
    const text = "What is your name?";
    const popularity = 10;
    const category = "test";
    testQuestion = await createTestQuestion(text, popularity, category);
    await answerQuestion({
      QUE_ID: testQuestion.ID,
      text: "Adam",
      score: 10,
      type: "test",
    });
    await answerQuestion({
      QUE_ID: testQuestion.ID,
      text: "Bob",
      score: 20,
      type: "test",
    });
    await answerQuestion({
      QUE_ID: testQuestion.ID,
      text: "Natalie",
      score: 30,
      type: "test",
    });
  });

  describe("answers(QUE_ID: ID!): [Answer!]", () => {
    it("returns all answers to a question by QUE_ID", async () => {
      const { data } = await answers({ QUE_ID: testQuestion.ID });

      expect(data.data.answers).toContainEqual(
        expect.objectContaining({ answer: "Adam", score: 10 })
      );
      expect(data.data.answers).toContainEqual(
        expect.objectContaining({ answer: "Bob", score: 20 })
      );
      expect(data.data.answers).toContainEqual(
        expect.objectContaining({ answer: "Natalie", score: 30 })
      );
    });
  });
});
