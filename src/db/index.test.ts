import Database from "./index";
import AWS from "aws-sdk";
import {PutItemInput} from "aws-sdk/clients/dynamodb";

jest.mock("aws-sdk", () => {
	return {
		DynamoDB: jest.fn(() => ({
			putItem: jest.fn(),
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
		connection.putItem.mockImplementation((params: PutItemInput, callback) => callback(null, 'test'));

		const item = {};
		await db.putItem(item);

		expect(connection.putItem).toHaveBeenCalledWith(item, expect.anything());
	});

	it("should call getItem successfully", async () => {
		const item = {};
		await db.getItem(item);

		expect(connection.getItem).toHaveBeenCalledWith(item, expect.anything());
	});

	it("should call scan successfully", async () => {
		const item = {};
		await db.scan(item);

		expect(connection.scan).toHaveBeenCalledWith(item, expect.anything());
	});
});
