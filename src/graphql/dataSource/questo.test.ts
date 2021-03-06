import AWS from "aws-sdk";

import QuestoSource, { PutItem, GetItem, Query } from './questo';
import Database from '../../db';

describe("QuestoSource", () => {
    let putItem: PutItem = {
        ID: 'USR_1',
        RecordType: 'QR_QUE_1',
        text: "abcd",
        score: 0,
        type: "",
        date: 1576015896949
    };
    let getItem: GetItem = { ID: 'QUE_1', RecordType: 'AR_ANS_1' };
    let query: Query = { KeyConditionExpression: '',  ExpressionAttributeNames: {}, ExpressionAttributeValues: {} };

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

        expect(db.putItem).toHaveBeenCalled()
    });

    it("putRecord gets appropriate params & inserts record to the db", async () => {
        const expectedPutItem = {
            Item: putItem,
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.put = jest.fn();
        await questoSource.putRecord(putItem);

        expect(questoSource.put).toHaveBeenCalledWith(expectedPutItem);
    });

    it("getRecord gets appropriate params & returns item(s) properly", async () => {
        const expectedGetItem = {
            Key: getItem,
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.get = jest.fn().mockReturnValue(({ Item: {} }));
        await questoSource.getRecord(getItem);

        expect(questoSource.get).toHaveBeenCalledWith(expectedGetItem)
    });

    it("query method gets appropriate params & returns all requested records properly", async () => {
        const expectedScanItem = {
            ...query,
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.dbQuery = jest.fn().mockReturnValue(({ Items: [] }));
        await questoSource.query(query);

        expect(questoSource.dbQuery).toHaveBeenCalledWith(expectedScanItem);
    });
});
