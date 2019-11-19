import Database from "./index";
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
		const item = {};
		await db.putItem(item);

		expect(connection.putItem).toHaveBeenCalledWith(item, expect.anything());
	});

	it("should call putItem and reject", async () => {
		const item = {};
		connection.putItem.mockImplementation((putItem, callback) => callback('putItem error'));

		await expect(db.putItem(item)).rejects.toMatch('putItem error')
	});

	it("should call getItem successfully", async () => {
		const item = {} as AWS.DynamoDB.GetItemInput;
		await db.getItem(item);

		expect(connection.getItem).toHaveBeenCalledWith(item, expect.anything());
	});

	it("should call getItem and reject", async () => {
		const item = {} as AWS.DynamoDB.GetItemInput;
		connection.getItem.mockImplementation((param, callback) => callback('getItem error'));

		await expect(db.getItem(item)).rejects.toMatch('getItem error')
	});

	it("should call scan successfully", async () => {
		const params = {} as AWS.DynamoDB.ScanInput;
		await db.scan(params);

		expect(connection.scan).toHaveBeenCalledWith(params, expect.anything());
	});

	it("should call scan and reject", async () => {
		connection.scan.mockImplementation((param, callback) => callback('scan error'));
		const params = {} as AWS.DynamoDB.ScanInput;

		await expect(db.scan(params)).rejects.toMatch('scan error')
	});
});
