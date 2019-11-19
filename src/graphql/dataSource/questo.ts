import Database from "../../db";
import AWS from "aws-sdk";

export interface PutItem {
	ID: string
	type: string
	params: object
}

export interface GetItem {
	ID: string
	type: string
}

export interface Scan {
	params: object
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

	async put(data: AWS.DynamoDB.PutItemInput) {
		const db = await this.getDatabase();
		await db.putItem(data);
	}

	async putQuestion(params: PutItem) {
		const item = {
			ID: {
				S: params.ID
			},
			type: {
				S: params.type
			},
			parameters: {
				M: params.params as {}
			}
		};

		const dynamoItem = {
			Item: item,
			TableName: process.env.DB_TABLE_NAME
		};

		await this.put(dynamoItem)
	}

	async getQuestion(params: GetItem) {
		const item = {
			ID: {
				S: params.ID
			},
			type: {
				S: params.type
			}
		};

		const dynamoItem = {
			Key: item,
			TableName: process.env.DB_TABLE_NAME
		};
	}

	async scan(params: Scan) {
		const dynamoScan = {
			TableName: process.env.DB_TABLE_NAME,
			ExpressionAttributeValues: params
		};
	}
}
