import { DynamoDB } from "aws-sdk";

import { USER_PREFIX } from "../../constants";
import Database from "../../db";

export interface PutItem {
  ID: string;
  RecordType: string;
  text: string;
  score: number;
  type: string;
  date: number;
}

export interface GetItem {
  ID: string;
  RecordType: string;
}

export interface Query {
  KeyConditionExpression: string;
  ExpressionAttributeNames?: object;
  ExpressionAttributeValues: object;
  Limit?: string;
  LastEvaluatedKey?: object;
}

export default class QuestoSource {
  public _db: Database;
  async getDatabase() {
    if (!this._db) {
      this._db = new Database();
      await this._db.connect();
    }

    return this._db;
  }

  async put(data: DynamoDB.DocumentClient.Put) {
    const db = await this.getDatabase();
    return await db.putItem(data);
  }

  async get(data: DynamoDB.DocumentClient.Get) {
    const db = await this.getDatabase();
    return await db.getItem(data);
  }

  async dbQuery(data: DynamoDB.QueryInput) {
    const db = await this.getDatabase();
    return await db.query(data);
  }

  async putRecord(params: PutItem) {
    const dynamoPutItem = {
      Item: params,
      TableName: process.env.DB_TABLE_NAME,
    };

    return await this.put(dynamoPutItem);
  }

  async getRecord(params: GetItem) {
    const dynamoGetItem = {
      Key: params,
      TableName: process.env.DB_TABLE_NAME,
    };

    const result: DynamoDB.GetItemOutput = await this.get(dynamoGetItem);
    return result.Item;
  }

  async query(params: Query) {
    const dynamoScan = {
      TableName: process.env.DB_TABLE_NAME,
      ...params,
    };

    const result: DynamoDB.QueryOutput = await this.dbQuery(
      dynamoScan as DynamoDB.QueryInput
    );
    return result;
  }

  async getUserById({ ID }: { ID: string }) {
    return await this.getRecord({ ID, RecordType: USER_PREFIX });
  }

  async getUserByUsername({ username }: { username: string }) {
    const args = {
      IndexName: "TextIndex",
      KeyConditionExpression: "RecordType=:rtype AND #text=:text",
      ExpressionAttributeValues: {
        ":rtype": USER_PREFIX,
        ":text": username,
      },
      ExpressionAttributeNames: {
        "#text": "text",
      },
    };

    const results = await this.query(args);

    return results?.Items?.pop();
  }
}
