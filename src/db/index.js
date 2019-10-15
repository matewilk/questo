import AWS from "aws-sdk";
import dotenv from "dotenv";

export default class Database {
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

	async putItem(params) {
		return new Promise((resolve, reject) => {
			this._connection.putItem(params, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

	async getItem(params) {
		return new Promise((resolve, reject) => {
			this._connection.getItem(params, (err, data) => {
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
