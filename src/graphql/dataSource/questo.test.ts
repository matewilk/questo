import QuestoSource, { PutItem, GetItem, Scan } from './questo';
import Database from '../../db';

describe("QuestoSource", () => {
    let putItem: PutItem = { ID: 'USR_1', type: 'QR_QUE_1', params: {}};
    let getItem: GetItem = { ID: 'QUE_1', type: 'AR_ANS_1' };
    let scan: Scan = { params: {} };

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
        const item = {};
        await questoSource.put(item);

        expect(db.putItem).toHaveBeenCalled()
    });

    it("putQuestion inserts question to the db", async () => {
        const expectedDynamoItem = {
            Item: { ID: { S: putItem.ID }, type: { S: putItem.type }, parameters: { M: putItem.params } },
            TableName: process.env.DB_TABLE_NAME
        };
        questoSource.put = jest.fn();
        await questoSource.putQuestion(putItem);

        expect(questoSource.put).toHaveBeenCalledWith(expectedDynamoItem);
    });

    it("putAnswer inserts answer to the db", async () => {

    });

    it("putUser inserts user to the db", async () => {

    });

    it("getQuestion gets the item properly", () => {
        const expectedDynamoItem = {
            Key: { ID: { S: getItem.ID }, type: { S: getItem.type } },
            TableName: process.env.DB_TABLE_NAME
        };
    })
});
