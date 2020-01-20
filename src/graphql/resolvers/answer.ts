import shortid from "shortid"
import {PutItem} from "../dataSource/questo";

const mapItemToType = (item: PutItem) => ({
    ID: item.ID,
    RecordType: item.RecordType,
    answer: item.text,
    score: item.score,
    type: item.type,
    date: item.date
});

export default {
    Query: {
        answers: async (parent, { QUE_ID }, { dataSources }) => {
            try {
                const args = {
                    KeyConditionExpression: "ID=:id and begins_with(RecordType, :rtype)",
                    ExpressionAttributeValues: {
                        ":id": QUE_ID,
                        ":rtype": "AR_ANS"
                    }
                };

                const result = await dataSources.questoSource.query(args);
                return result.Items.map(mapItemToType);
            } catch (err) {
                console.log(err);
            }
        }
    },
    Mutation: {
        createAnswer: async (parent, { text, score, type }, { dataSources }) => {
            try {
                const ANS = `${process.env.ANSWER_PREFIX}`;
                const ID = `${ANS}_${shortid.generate()}`;

                await dataSources.questoSource.putRecord({
                    ID,
                    RecordType: ANS,
                    text, // answer
                    score,
                    type,
                    date: Date.now()
                });

                const result = await dataSources.questoSource.getRecord({
                    ID, RecordType: ANS
                });

                return mapItemToType(result);
            } catch (err) {
                console.log(err);
            }
        }
    }
}
