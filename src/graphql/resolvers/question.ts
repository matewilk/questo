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
                await dataSources.questoSource.putRecord({
                    ID: `QUE_${shortid.generate()}`,
                    type: '__meta__',
                    // text: text,
                    params: {}
                })
            } catch (err) {
                console.log(err);
            }
        }
    }
}
