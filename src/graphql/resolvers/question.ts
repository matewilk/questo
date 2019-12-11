import shortid from "shortid"
import { PutItem } from "../dataSource/questo";

const mapItemToType = (item: PutItem) => ({
    ID: item.ID,
    RecordType: item.RecordType,
    text: item.text,
    popularity: item.score,
    category: item.type,
    date: item.date
});

export default {
    Query: {
        questions: async (parent, args, { dataSources }) => {
            try {
                const results = await dataSources.questoSource.scan(args);
                return results.map(mapItemToType)
            } catch (err) {
                console.log(err);
            }
        },
        question: async (parent, args, { dataSources }) => {
            try {
                const { ID } = args;
                const result = await dataSources.questoSource.getRecord({
                    ID,
                    RecordType: `${process.env.QUESTION_PREFIX}`
                });

                return mapItemToType(result);
            } catch (err) {
                console.log(err);
            }
        }
    },

    Mutation: {
        createQuestion: async (parent, { text }, { dataSources }) => {
            try {
                const QUE = `${process.env.QUESTION_PREFIX}`;
                const ID = `${QUE}_${shortid.generate()}`;

                await dataSources.questoSource.putRecord({
                    ID,
                    RecordType: QUE,
                    text: text,
                    score: 0, // popularity
                    type: " ", // category
                    date: Date.now()
                });

                const result = await dataSources.questoSource.getRecord({
                    ID: `${ID}`,
                    RecordType: QUE
                });

                return mapItemToType(result)
            } catch (err) {
                console.log(err);
            }
        },
        answerQuestion: async (parent, { QUE_ID, text, score, type }, { dataSources }) => {
            try {
                const ANS = `${process.env.ANSWER_PREFIX}`;
                const ANS_ID = `${ANS}_${shortid.generate()}`;
                const currentDate = Date.now();

                await dataSources.questoSource.putRecord({
                    ID: ANS_ID,
                    RecordType: ANS,
                    text,
                    score,
                    type,
                    date: currentDate
                });

                const answerRecordType = `AR_${ANS_ID}`;
                await dataSources.questoSource.putRecord({
                    ID: QUE_ID,
                    RecordType: answerRecordType,
                    text,
                    score,
                    type,
                    date: currentDate
                });

                return await dataSources.questoSource.getRecord({
                    ID: QUE_ID,
                    RecordType: answerRecordType
                });
            } catch (err) {
                console.log(err);
            }
        }
    }
}
