import shortid from 'shortid';
import { PutItem } from '../dataSource/questo';

const mapItemToType = (item: PutItem) => ({
    ID: item.ID,
    RecordType: item.RecordType,
    name: item.text,
    score: item.score,
    type: item.type,
    date: item.date
});

export default {
    Query: {
        user: async (parent, args, { dataSources }) => {
            try {
                const { ID } = args;
                const result = await dataSources.questoSource.getRecord({
                    ID,
                    RecordType: `${process.env.USER_PREFIX}`
                });

                return mapItemToType(result);
            } catch (err) {
                console.log(err);
            }
        }
    },

    Mutation: {
        createUser: async (parent, { name, type }, { dataSources }) => {
            try {
                const USR = `${process.env.USER_PREFIX}`;
                const ID = `${USR}_${shortid.generate()}`;

                await dataSources.questoSource.putRecord({
                    ID,
                    RecordType: USR,
                    text: name,
                    score: 0,
                    type,
                    date: Date.now()
                });

                const result = await dataSources.questoSource.getRecord({
                    ID: `${ID}`,
                    RecordType: USR
                });

                return mapItemToType(result);
            } catch (err) {
                console.log(err);
            }
        }
    }
}
