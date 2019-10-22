import Database from "./index";
import AWS from "aws-sdk";

jest.mock("aws-sdk", () => {
	return {
		DynamoDB: jest.fn()
	}
});

describe("database", () => {
	let db;
	beforeEach(() => {
		db = new Database();
	});

	it("connects to db driver successfully", async () => {
		await db.connect();

		expect(AWS.DynamoDB).toHaveBeenCalledWith({
			endpoint: "http://localhost:8000",
			region: "local",
			accessKeyId: "local",
			secretAccessKey: "local"
		})
	})
});
