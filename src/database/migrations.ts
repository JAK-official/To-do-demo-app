import { db } from "./db";

import * as m1 from "./migrations/001_create_tasks";
import * as m2 from "./migrations/002_add_position";

const migrations = [
  {
    version: 1,
    up: m1.up,
    down: m1.down,
  },

  {
    version: 2,
    up: m2.up,
    down: m2.down,
  },
];

const LATEST_VERSION = Math.max(...migrations.map((m) => m.version));

export function migrate(targetVersion = LATEST_VERSION) {
  if (targetVersion < 0) {
    throw new Error(`Invalid migration version: ${targetVersion}`);
  }

  if (targetVersion > LATEST_VERSION) {
    throw new Error(
      `Migration ${targetVersion} does not exist. Latest is ${LATEST_VERSION}`,
    );
  }

  console.log("Running migrations...");

  initMigrationTable();

  let current = getCurrentVersion();

  console.log(`Database: ${current} → ${targetVersion}`);

  while (current < targetVersion) {
    const migration = migrations.find((m) => m.version === current + 1);

    if (!migration) break;

    db.execSync("BEGIN");

    try {
      migration.up();

      setVersion(migration.version);

      db.execSync("COMMIT");

      current = migration.version;
    } catch (e) {
      db.execSync("ROLLBACK");

      throw e;
    }
  }

  while (current > targetVersion) {
    const migration = migrations.find((m) => m.version === current);

    if (!migration) break;

    db.execSync("BEGIN");

    try {
      migration.down();

      db.runSync(
        `
        DELETE FROM migrations
        WHERE version = ?
        `,
        [migration.version],
      );

      db.execSync("COMMIT");

      current = migration.version - 1;
    } catch (e) {
      db.execSync("ROLLBACK");

      throw e;
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
    version: number;
  }>(
    `
    SELECT version
    FROM migrations
    ORDER BY version DESC
    LIMIT 1
    `,
  );

  return result?.version ?? 0;
}

export function setVersion(version: number) {
  db.runSync(
    `
    INSERT INTO migrations
    (version, applied_at)
    VALUES (?, ?)
    `,
    [version, new Date().toISOString()],
  );
}
