import Database from "./index";
import AWS from "aws-sdk";

jest.mock("aws-sdk", () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => ({
        put: jest
          .fn()
          .mockImplementation((params, callback) => callback(null, "test")),
        get: jest
          .fn()
          .mockImplementation((params, callback) => callback(null, "test")),
        query: jest
          .fn()
          .mockImplementation((params, callback) => callback(null, "test")),
      })),
    },
  };
});

describe("Database", () => {
  let db: Database;
  let connection: AWS.DynamoDB.DocumentClient;

  beforeEach(async () => {
    db = new Database();
    connection = await db.connect();
  });

  it("should connect to db driver successfully", () => {
    expect(AWS.DynamoDB.DocumentClient).toHaveBeenCalledWith({
      endpoint: "`https://dynamodb.${process.env.AWS_REGION}.amazonaws.com`",
      region: "local",
      accessKeyId: "local",
      secretAccessKey: "local",
    });
  });

  it("should call putItem successfully", async () => {
    const item = {} as AWS.DynamoDB.DocumentClient.Put;
    await db.putItem(item);

    expect(connection.put).toHaveBeenCalledWith(item, expect.anything());
  });

  it("should call putItem and reject", async () => {
    const item = {} as AWS.DynamoDB.DocumentClient.Put;
    connection.put.mockImplementation((putItem, callback) =>
      callback("putItem error")
    );

    await expect(db.putItem(item)).rejects.toMatch("putItem error");
  });

  it("should call getItem successfully", async () => {
    const item = {} as AWS.DynamoDB.DocumentClient.Get;
    await db.getItem(item);

    expect(connection.get).toHaveBeenCalledWith(item, expect.anything());
  });

  it("should call getItem and reject", async () => {
    const item = {} as AWS.DynamoDB.DocumentClient.Get;
    connection.get.mockImplementation((param, callback) =>
      callback("getItem error")
    );

    await expect(db.getItem(item)).rejects.toMatch("getItem error");
  });

  it("should call query successfully", async () => {
    const params = {} as AWS.DynamoDB.DocumentClient.QueryInput;
    await db.query(params);

    expect(connection.query).toHaveBeenCalledWith(params, expect.anything());
  });

  it("should call query and reject", async () => {
    connection.query.mockImplementation((param, callback) =>
      callback("query error")
    );
    const params = {} as AWS.DynamoDB.QueryInput;

    await expect(db.query(params)).rejects.toMatch("query error");
  });
});
