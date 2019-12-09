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
                const result = await dataSources.questoSource.scan(args);
                return result.Items.map(mapItemToType)
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

                return mapItemToType(result.Item);
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
                    ID: `${ID}`,
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

                return mapItemToType(result.Item)
            } catch (err) {
                console.log(err);
            }
        }
    }
}
