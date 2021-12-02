import AWS from "aws-sdk";

export default class Database {
  private _connection: AWS.DynamoDB.DocumentClient;
  async connect() {
    if (!this._connection) {
      const params = {
        endpoint:
          process.env.DB_URL ||
          `https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`,
        region: process.env.AWS_REGION || "local",
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "local",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "local",
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
