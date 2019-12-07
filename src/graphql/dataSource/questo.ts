import Database from "../../db";
import AWS from "aws-sdk";

export interface PutItem {
	ID: string
	RecordType: string,
	text: string,
	params: object
}

export interface GetItem {
	ID: string
	RecordType: string
}

export interface Scan {
	ExpressionAttributeValues?: object
	ProjectionExpression?: string
	FilterExpression?: string
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

	async put(data: AWS.DynamoDB.DocumentClient.Put) {
		const db = await this.getDatabase();
		return await db.putItem(data);
	}

	async get(data: AWS.DynamoDB.DocumentClient.Get) {
		const db = await this.getDatabase();
		return await db.getItem(data)
	}

	async dbScan(data: AWS.DynamoDB.ScanInput) {
		const db = await this.getDatabase();
		return await db.scan(data);
	}

	async putRecord(params: PutItem) {
		const dynamoPutItem = {
			Item: params,
			TableName: process.env.DB_TABLE_NAME
		};

		return await this.put(dynamoPutItem)
	}

	async getRecord(params: GetItem) {
		const dynamoGetItem = {
			Key: params,
			TableName: process.env.DB_TABLE_NAME
		};

		return await this.get(dynamoGetItem)
	}

	async scan(params: Scan) {
		const dynamoScan = {
			TableName: process.env.DB_TABLE_NAME,
			...params
		};

		return await this.dbScan(dynamoScan as AWS.DynamoDB.ScanInput);
	}
}
