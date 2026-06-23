import { db } from "../db";

export function up() {
  db.execSync(`
    ALTER TABLE tasks
    ADD COLUMN position INTEGER DEFAULT 0;
  `);
}

export function down() {
  db.execSync(`
    ALTER TABLE tasks
    DROP COLUMN position;
  `);
}