import shortid from "shortid";
import { PutItem } from "../dataSource/questo";
import { ANSWER_PREFIX, QUESTION_PREFIX } from "../../constants";

const mapItemToType = (item: PutItem) => ({
  ID: item.ID,
  RecordType: item.RecordType,
  text: item.text,
  popularity: item.score,
  category: item.type,
  date: item.date,
});

const toCursorHash = (string: string): string =>
  Buffer.from(string).toString("base64");

const fromCursorHash = (string: string): string =>
  Buffer.from(string, "base64").toString("ascii");

export default {
  Query: {
    questions: async (parent, { cursor, limit }, { dataSources }) => {
      try {
        const args = {
          IndexName: "EntitiesIndex",
          KeyConditionExpression: "RecordType=:rtype",
          ExpressionAttributeValues: {
            ":rtype": QUESTION_PREFIX,
          },
          Limit: limit ? limit : 10,
          ExclusiveStartKey: cursor ? JSON.parse(fromCursorHash(cursor)) : null,
        };

        const results = await dataSources.questoSource.query(args);

        const questions = results.Items;
        const hasNextPage = questions.length > limit;

        return {
          edges: questions.map(mapItemToType),
          pageInfo: {
            hasNextPage,
            count: results.Count,
            cursor: results.LastEvaluatedKey
              ? toCursorHash(JSON.stringify(results.LastEvaluatedKey))
              : null,
          },
        };
      } catch (err) {
        console.log(err);
      }
    },
    question: async (parent, args, { dataSources }) => {
      try {
        const { ID } = args;
        const result = await dataSources.questoSource.getRecord({
          ID,
          RecordType: `${QUESTION_PREFIX}`,
        });

        return mapItemToType(result);
      } catch (err) {
        console.log(err);
      }
    },
  },

  Mutation: {
    createQuestion: async (
      parent,
      { text, popularity, category },
      { dataSources }
    ) => {
      try {
        const QUE = `${QUESTION_PREFIX}`;
        const ID = `${QUE}_${shortid.generate()}`;

        await dataSources.questoSource.putRecord({
          ID,
          RecordType: QUE,
          text: text,
          score: popularity, // popularity
          type: category, // category
          date: Date.now(),
        });

        const result = await dataSources.questoSource.getRecord({
          ID: `${ID}`,
          RecordType: QUE,
        });

        return mapItemToType(result);
      } catch (err) {
        console.log(err);
      }
    },
    answerQuestion: async (
      parent,
      { QUE_ID, text, score, type },
      { dataSources }
    ) => {
      try {
        const ANS = `${ANSWER_PREFIX}`;
        const ANS_ID = `${ANS}_${shortid.generate()}`;
        const currentDate = Date.now();

        await dataSources.questoSource.putRecord({
          ID: ANS_ID,
          RecordType: ANS,
          text,
          score,
          type,
          date: currentDate,
        });

        const answerRecordType = `AR_${ANS_ID}`;
        await dataSources.questoSource.putRecord({
          ID: QUE_ID,
          RecordType: answerRecordType,
          text,
          score,
          type,
          date: currentDate,
        });

        const result = await dataSources.questoSource.getRecord({
          ID: QUE_ID,
          RecordType: answerRecordType,
        });

        return mapItemToType(result);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
