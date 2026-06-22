import { db } from "../db";

export function up() {
  db.execSync(`
    ALTER TABLE tasks
    ADD COLUMN position INTEGER DEFAULT 0;
  `);
}

export function down() {
  db.execSync(`
    CREATE TABLE tasks_backup AS
    SELECT
      id,
      title,
      completed,
      created_at
    FROM tasks;


    DROP TABLE tasks;


    CREATE TABLE tasks (

      id INTEGER PRIMARY KEY AUTOINCREMENT,

      title TEXT NOT NULL,

      completed INTEGER NOT NULL DEFAULT 0,

      created_at TEXT NOT NULL

    );


    INSERT INTO tasks
    SELECT *
    FROM tasks_backup;


    DROP TABLE tasks_backup;

  `);
}
