import { db } from './db';

import * as m1 from './migrations/001_create_tasks';
import * as m2 from './migrations/002_add_position';


const migrations = [
  {
    version:1,
    up:m1.up,
    down:m1.down
  },

  {
    version:2,
    up:m2.up,
    down:m2.down
  }
];


export function migrate(){
    console.log("Running migrations...");

  initMigrationTable();


  let current =
    getCurrentVersion();
    console.log("DB version:", current);


  for(const migration of migrations){

    if(migration.version > current){

      db.execSync('BEGIN');

      try {

        migration.up();

        setVersion(
          migration.version
        );

        db.execSync('COMMIT');

      } catch(e){

        db.execSync('ROLLBACK');

        throw e;
      }
    }
  }

}

export function initMigrationTable() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS migrations (
      version INTEGER PRIMARY KEY NOT NULL,
      applied_at TEXT NOT NULL
    );
  `);
}


export function getCurrentVersion() {
  const result = db.getFirstSync<{
    version: number
  }>(
    `
    SELECT version
    FROM migrations
    ORDER BY version DESC
    LIMIT 1
    `
  );

  return result?.version ?? 0;
}


export function setVersion(version:number) {
  db.runSync(
    `
    INSERT INTO migrations
    (version, applied_at)
    VALUES (?, ?)
    `,
    [
      version,
      new Date().toISOString()
    ]
  );
}