import AWS from "aws-sdk";

import { USER_PREFIX } from "../../constants";
import QuestoSource, { PutItem, GetItem, Query } from "./questo";
import Database from "../../db";

describe("QuestoSource", () => {
  let putItem: PutItem = {
    ID: "USR_1",
    RecordType: "QR_QUE_1",
    text: "abcd",
    score: 0,
    type: "",
    date: 1576015896949,
  };
  let getItem: GetItem = { ID: "QUE_1", RecordType: "AR_ANS_1" };
  let query: Query = {
    KeyConditionExpression: "",
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  let connectMock;
  let putItemMock;
  let getItemMock;
  let queryMock;
  let questoSource: QuestoSource;

  beforeEach(() => {
    connectMock = jest.fn();
    putItemMock = jest.fn();
    getItemMock = jest.fn();
    queryMock = jest.fn();

    Database.prototype.connect = connectMock;
    Database.prototype.putItem = putItemMock;
    Database.prototype.getItem = getItemMock;
    Database.prototype.query = queryMock;

    questoSource = new QuestoSource();
  });

  afterEach(() => jest.restoreAllMocks());

  it("getDatabase method returns a db connected driver", async () => {
    const db = await questoSource.getDatabase();

    expect(db.connect).toHaveBeenCalled();
    expect(db).toBeInstanceOf(Database);
  });

  it("put method gets appropriate params & inserts item into the database", async () => {
    const db = await questoSource.getDatabase();
    const item = {} as AWS.DynamoDB.PutItemInput;
    await questoSource.put(item);

    expect(db.putItem).toHaveBeenCalled();
  });

  it("putRecord gets appropriate params & inserts record to the db", async () => {
    const expectedPutItem = {
      Item: putItem,
      TableName: process.env.DB_TABLE_NAME,
    };
    questoSource.put = jest.fn();
    await questoSource.putRecord(putItem);

    expect(questoSource.put).toHaveBeenCalledWith(expectedPutItem);
  });

  it("getRecord gets appropriate params & returns item(s) properly", async () => {
    const expectedGetItem = {
      Key: getItem,
      TableName: process.env.DB_TABLE_NAME,
    };
    questoSource.get = jest.fn().mockReturnValue({ Item: {} });
    await questoSource.getRecord(getItem);

    expect(questoSource.get).toHaveBeenCalledWith(expectedGetItem);
  });

  it("query method gets appropriate params & returns all requested records properly", async () => {
    const expectedScanItem = {
      ...query,
      TableName: process.env.DB_TABLE_NAME,
    };
    questoSource.dbQuery = jest.fn().mockReturnValue({ Items: [] });
    await questoSource.query(query);

    expect(questoSource.dbQuery).toHaveBeenCalledWith(expectedScanItem);
  });

  it("getUserById calls getRecord with appropriate params", async () => {
    questoSource.getRecord = jest.fn();
    const ID = "123";
    const params = { ID };
    const USR = USER_PREFIX;

    await questoSource.getUserById(params);

    expect(questoSource.getRecord).toHaveBeenCalledWith({
      ID,
      RecordType: USR,
    });
  });

  it("getUserByUsername calls query method with appropriate params and returns record properly", async () => {
    const returnItem = { test: "item " };
    questoSource.query = jest.fn().mockReturnValue({ Items: [returnItem] });
    const username = "myusername";
    const args = { username };

    const result = await questoSource.getUserByUsername(args);

    expect(questoSource.query).toHaveBeenCalledWith({
      IndexName: "TextIndex",
      KeyConditionExpression: "RecordType=:rtype AND #text=:text",
      ExpressionAttributeValues: {
        ":rtype": USER_PREFIX,
        ":text": username,
      },
      ExpressionAttributeNames: {
        "#text": "text",
      },
    });

    expect(result).toBe(returnItem);
  });
});
