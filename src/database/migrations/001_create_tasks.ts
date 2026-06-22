import { db } from "../db";

export function up() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      title TEXT NOT NULL,

      completed INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL

    );
  `);
}

export function down() {
  db.execSync(`
    DROP TABLE IF EXISTS tasks;
  `);
}
