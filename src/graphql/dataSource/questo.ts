import Database from "../../db";

export default class QuestoSource {
	public _db: Database;
	async getDatabase() {
		if (!this._db) {
			this._db = new Database();
			await this._db.connect();
		}

		return this._db;
	}

	async put(data) {
		const db = await this.getDatabase();
		await db.putItem(data);
	}
}
