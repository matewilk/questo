import {
  answerQuestion,
  createQuestion,
  question,
  questions,
} from "./question.api";
import { createTestQuestion } from "./helpers";

describe("Question", () => {
  describe("createQuestion($text: String!, $popularity: Int!, $category: String!): Question", () => {
    it("creates and returns newly created Question", async () => {
      const text = "What is this test for?";
      const popularity = 10;
      const category = "test";

      const input = { text, popularity, category };

      const { data } = await createQuestion(input);
      const question = data.data.createQuestion;

      expect(question).toEqual({
        text,
        popularity,
        category,
        RecordType: "QUE",
        date: expect.any(String),
        ID: expect.any(String),
      });
    });
  });

  describe("question(ID: ID!): Question", () => {
    it("returns a question record with the given ID", async () => {
      const text = "test question?";
      const popularity = 15;
      const category = "test";

      const createdQuestion = await createTestQuestion(
        text,
        popularity,
        category
      );

      const { data } = await question({ ID: createdQuestion.ID });

      expect(data.data.question).toEqual(createdQuestion);
    });
  });

  describe("answerQuestion(QUE_ID: String!, text: String!, score: Int!, type: String!): Question", () => {
    it("answers a specific question and returns Question's answer record", async () => {
      const question = "What is your hair colour?";
      const popularity = 200000;
      const category = "test";

      const createdQuestion = await createTestQuestion(
        question,
        popularity,
        category
      );

      const answer = "blond";
      const score = 10000;
      const type = "text";
      const { data } = await answerQuestion({
        QUE_ID: createdQuestion.ID,
        text: answer,
        score,
        type,
      });

      expect(data.data.answerQuestion).toEqual({
        ID: expect.any(String), // regex QUE_*
        RecordType: expect.any(String), // fix it with regex AR_ANS_*
        text: answer,
        popularity: score,
        category: type,
        date: expect.any(String), // timestamp regex ?
      });
    });
  });

  describe("questions(cursor: String, limit: Int): Questions!", () => {
    it("returns list of questions as edges and pageInfo", async () => {
      const { data } = await questions();

      expect(data.data.questions).toHaveProperty("edges");
      expect(data.data.questions).toHaveProperty("pageInfo");
      expect(data.data.questions.edges.length).toBeGreaterThanOrEqual(3);
      expect(data.data.questions.pageInfo).toHaveProperty("cursor");
      expect(data.data.questions.pageInfo).toHaveProperty("count");
    });

    it("returns limited number of items and cursor when limit is set", async () => {
      const { data } = await questions({ limit: 1 });

      expect(data.data.questions.edges.length).toEqual(1);
      expect(data.data.questions.pageInfo).toHaveProperty(
        "cursor",
        expect.stringMatching(
          /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/
        ) // base64 str
      );
      expect(data.data.questions.pageInfo).toHaveProperty("count", 1);
    });

    it("returns items with offset when cursor is set", async () => {
      const questionFirst = await questions({ limit: 1 });
      const questionSecond = await questions({ limit: 2 });

      const { data } = await questions({
        limit: 1,
        cursor: questionFirst.data.data.questions.pageInfo.cursor,
      });

      expect(questionSecond.data.data.questions.edges[1]).toEqual(
        data.data.questions.edges[0]
      );
    });

    it("returns no cursor value when items array size is smaller than limit", async () => {
      const { data } = await questions({ limit: 100000 });

      expect(data.data.questions.pageInfo.cursor).toEqual(null);
    });
  });
});
