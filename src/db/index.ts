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

export default class Database {
	private _connection: AWS.DynamoDB;
	async connect() {
		if (!this._connection){
			const params = {
				endpoint: process.env.DB_URL,
				region: process.env.DB_REGION,
				accessKeyId: process.env.DB_ACCESS_KEY,
				secretAccessKey: process.env.DB_SECRET_ACCESS_KEY
			};

			this._connection = new AWS.DynamoDB(params);
		}

		return this._connection;
	}

	async putItem(params: PutItem) {
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

		return new Promise((resolve, reject) => {
			this._connection.putItem(dynamoItem, (err, data) => {
				if (err) {
					 reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	async getItem(params: GetItem) {
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

		return new Promise((resolve, reject) => {
			this._connection.getItem(dynamoItem, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	async scan(params = {}) {
		return new Promise((resolve, reject) => {
			this._connection.scan(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}
}
