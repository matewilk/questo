import AWS from "aws-sdk";

export default class Database {
  private _connection: AWS.DynamoDB.DocumentClient;
  async connect() {
    if (!this._connection) {
      const params = {
        endpoint: process.env.DB_URL,
        region: process.env.DB_REGION,
        accessKeyId: process.env.DB_ACCESS_KEY,
        secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
      };

      this._connection = new AWS.DynamoDB.DocumentClient(params);
    }

    return this._connection;
  }

  async putItem(params: AWS.DynamoDB.DocumentClient.Put) {
    return new Promise((resolve, reject) => {
      this._connection.put(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async getItem(item: AWS.DynamoDB.DocumentClient.Get) {
    return new Promise((resolve, reject) => {
      this._connection.get(item, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async query(params: AWS.DynamoDB.DocumentClient.ScanInput) {
    return new Promise((resolve, reject) => {
      this._connection.query(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
