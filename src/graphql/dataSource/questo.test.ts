import AWS from "aws-sdk";

import QuestoSource, { PutItem, GetItem, Scan } from './questo';
import Database from '../../db';

describe("QuestoSource", () => {
    let putItem: PutItem = { ID: 'USR_1', type: 'QR_QUE_1', params: {}};
    let getItem: GetItem = { ID: 'QUE_1', type: 'AR_ANS_1' };
    let scan: Scan = { ExpressionAttributeValues: {},  ProjectionExpression: '', FilterExpression: ''};

    let connectMock;
    let putItemMock;
    let getItemMock;
    let scanMock;
    let questoSource: QuestoSource;

    beforeEach(() => {
        connectMock = jest.fn();
        putItemMock = jest.fn();
        getItemMock = jest.fn();
        scanMock = jest.fn();

        Database.prototype.connect = connectMock;
        Database.prototype.putItem = putItemMock;
        Database.prototype.getItem = getItemMock;
        Database.prototype.scan = scanMock;

        questoSource = new QuestoSource();
    });

    afterEach(() => jest.restoreAllMocks());

    it("getDatabase returns a db connected driver", async () => {
         const db = await questoSource.getDatabase();

         expect(db.connect).toHaveBeenCalled();
         expect(db).toBeInstanceOf(Database);
    });

    it("put method inserts item into the database", async () => {
        const db = await questoSource.getDatabase();
        const item = {} as AWS.DynamoDB.PutItemInput;
        await questoSource.put(item);

        expect(db.putItem).toHaveBeenCalled()
    });

    it("putRecord inserts question to the db", async () => {
        const expectedPutItem = {
            Item: putItem,
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.put = jest.fn();
        await questoSource.putRecord(putItem);

        expect(questoSource.put).toHaveBeenCalledWith(expectedPutItem);
    });

    it("getRecord returns item(s) properly", async () => {
        const expectedGetItem = {
            Key: getItem,
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.get = jest.fn();
        await questoSource.getRecord(getItem);

        expect(questoSource.get).toHaveBeenCalledWith(expectedGetItem)
    });

    it("scan returns all requested records properly", async () => {
        const expectedScanItem = {
            ...scan,
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.dbScan = jest.fn();
        await questoSource.scan(scan);

        expect(questoSource.dbScan).toHaveBeenCalledWith(expectedScanItem);
    });
});
