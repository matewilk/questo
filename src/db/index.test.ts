import Database, { GetItem, PutItem, Scan } from "./index";
import AWS from "aws-sdk";

jest.mock("aws-sdk", () => {
	return {
		DynamoDB: jest.fn(() => ({
			putItem: jest.fn().mockImplementation((params, callback) => callback(null, 'test')),
			getItem: jest.fn().mockImplementation((params, callback) => callback(null, 'test')),
			scan: jest.fn().mockImplementation((params, callback) => callback(null, 'test'))
		}))
	}
});

describe("Database", () => {
	let db: Database;
	let connection: AWS.DynamoDB;
	let putItem: PutItem = { ID: 'USR_1', type: 'QR_QUE_1', params: {}};
	let getItem: GetItem = { ID: 'QUE_1', type: 'AR_ANS_1' };
	let scan: Scan = { params: {} };

	beforeEach(async () => {
		db = new Database();
		connection = await db.connect();
	});

	it("should connect to db driver successfully", () => {
		expect(AWS.DynamoDB).toHaveBeenCalledWith({
			endpoint: "http://localhost:8000",
			region: "local",
			accessKeyId: "local",
			secretAccessKey: "local"
		})
	});

	it("should call putItem successfully", async () => {
		const expectedDynamoItem = {
			Item: { ID: { S: putItem.ID }, type: { S: putItem.type }, parameters: { M: {} } },
			TableName: process.env.DB_TABLE_NAME
		};

		await db.putItem(putItem);

		expect(connection.putItem).toHaveBeenCalledWith(expectedDynamoItem, expect.anything());
	});

	it("should call putItem and reject", async () => {
		connection.putItem.mockImplementation((putItem, callback) => callback('putItem error'));

		await expect(db.putItem(putItem)).rejects.toMatch('putItem error')
	});

	it("should call getItem successfully", async () => {
		const expectedDynamoItem = {
			Key: { ID: { S: getItem.ID }, type: { S: getItem.type } },
			TableName: process.env.DB_TABLE_NAME
		};

		await db.getItem(getItem);

		expect(connection.getItem).toHaveBeenCalledWith(expectedDynamoItem, expect.anything());
	});

	it("should call getItem and reject", async () => {
		connection.getItem.mockImplementation((param, callback) => callback('getItem error'));

		await expect(db.getItem(getItem)).rejects.toMatch('getItem error')
	});

	it("should call scan successfully", async () => {
		const expectedScanItem = {
			ExpressionAttributeValues: scan,
			TableName: process.env.DB_TABLE_NAME
		};

		await db.scan(scan);

		expect(connection.scan).toHaveBeenCalledWith(expectedScanItem, expect.anything());
	});

	it("should call scan and reject", async () => {
		connection.scan.mockImplementation((param, callback) => callback('scan error'));
		const item = {};

		await expect(db.scan(item)).rejects.toMatch('scan error')
	});
});
