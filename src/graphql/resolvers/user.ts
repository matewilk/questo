import shortid from "shortid";
import { AuthenticationError } from 'apollo-server';

import { PutItem } from "../dataSource/questo";
import { handleAuth } from "../../helpers/passport-authentication";

const mapItemToType = (item: PutItem) => ({
  ID: item?.ID,
  RecordType: item?.RecordType,
  name: item?.text,
  score: item?.score,
  type: item?.type,
  date: item?.date,
});

export default {
  Query: {
    user: async (parent, { ID }, { dataSources }) => {
      try {
        const result = await dataSources.questoSource.getUserById({ ID });

        return mapItemToType(result);
      } catch (err) {
        console.log(err);
      }
    },
    currentUser: async (_parent, _args, { user }) => {
      try {
        return user;
      } catch (err) {
        console.log(err);
      }
    },
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
          date: Date.now(),
        });

        const result = await dataSources.questoSource.getRecord({
          ID: `${ID}`,
          RecordType: USR,
        });

        return mapItemToType(result);
      } catch (err) {
        console.log(err);
      }
    },
    login: async (parent, { name, password }, { req }) => {
      try {
        const result = await handleAuth(name, password, req)

        return mapItemToType(result);
      } catch (err) {
        throw new AuthenticationError('Authentication Failed')
      }
    },
  },
};
