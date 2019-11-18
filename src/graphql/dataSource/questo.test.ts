import QuestoSource from './questo';
import Database from '../../db';

describe("QuestoSource", () => {
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

    });

    it("putAnswer inserts answer to the db", async () => {

    });

    it("putUser inserts user to the db", async () => {

    });
});
