import Database from "../../db";
import { DynamoDB } from "aws-sdk";

export interface PutItem {
	ID: string
	RecordType: string,
	text: string,
	score: number,
	type: string,
	date: number
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

	async put(data: DynamoDB.DocumentClient.Put) {
		const db = await this.getDatabase();
		return await db.putItem(data);
	}

	async get(data: DynamoDB.DocumentClient.Get) {
		const db = await this.getDatabase();
		return await db.getItem(data)
	}

	async dbScan(data: DynamoDB.ScanInput) {
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

		const result: DynamoDB.GetItemOutput = await this.get(dynamoGetItem);
		return result.Item;
	}

	async scan(params: Scan) {
		const dynamoScan = {
			TableName: process.env.DB_TABLE_NAME,
			...params
		};

		const result: DynamoDB.ScanOutput = await this.dbScan(dynamoScan as DynamoDB.ScanInput);
		return result.Items;
	}
}
