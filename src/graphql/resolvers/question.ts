import shortid from 'shortid'

export default {
    Query: {
        questions: async (parent, args, { dataSources }) => {
            try {
                const result = await dataSources.questoSource.scan({});
                return result.Items;
            } catch (err) {
                console.log(err);
            }
        },
        question: (parent, args) => {}
    },

    Mutation: {
        createQuestion: async (parent, { text }, { dataSources }) => {
            try {
                const ID = `QUE_${shortid.generate()}`;
                await dataSources.questoSource.putRecord({
                    ID: `${ID}`,
                    type: '__meta__',
                    // text: text,
                    params: {}
                });

                const result = await dataSources.questoSource.getRecord({
                    ID: `${ID}`,
                    type: '__meta__'
                });

                return result.Item;
            } catch (err) {
                console.log(err);
            }
        }
    }
}
