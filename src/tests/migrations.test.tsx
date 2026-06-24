import {
  migrate,
  initMigrationTable,
  getCurrentVersion,
  setVersion,
} from "@/database/migrations";

import { db } from "@/database/db";

import * as m1 from "@/database/migrations/001_create_tasks";
import * as m2 from "@/database/migrations/002_add_position";

jest.mock("@/database/db", () => ({
  db: {
    execSync: jest.fn(),
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
  },
}));

jest.mock("@/database/migrations/001_create_tasks", () => ({
  up: jest.fn(),
  down: jest.fn(),
}));

jest.mock("@/database/migrations/002_add_position", () => ({
  up: jest.fn(),
  down: jest.fn(),
}));

const mockedDb = db as jest.Mocked<typeof db>;

describe("migrate", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("creates migration table", () => {
    initMigrationTable();

    expect(mockedDb.execSync).toHaveBeenCalledWith(
      expect.stringContaining(
        "CREATE TABLE IF NOT EXISTS migrations",
      ),
    );
  });

  test("returns current version", () => {
    mockedDb.getFirstSync.mockReturnValue({
      version: 2,
    });

    expect(getCurrentVersion()).toBe(2);
  });

  test("returns 0 when no version exists", () => {
    mockedDb.getFirstSync.mockReturnValue(null);

    expect(getCurrentVersion()).toBe(0);
  });

  test("stores version", () => {
    setVersion(2);

    expect(mockedDb.runSync).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO migrations"),
      expect.arrayContaining([2]),
    );
  });

  test("throws on negative version", () => {
    expect(() => migrate(-1)).toThrow(
      "Invalid migration version: -1",
    );
  });

  test("throws when target version does not exist", () => {
    expect(() => migrate(999)).toThrow(
      "Migration 999 does not exist. Latest is 2",
    );
  });

  test("runs migration 1", () => {
    mockedDb.getFirstSync.mockReturnValue(null);

    migrate(1);

    expect(m1.up).toHaveBeenCalled();
  });

  test("runs migration 2", () => {
    mockedDb.getFirstSync
      .mockReturnValueOnce({ version: 1 })
      .mockReturnValueOnce({ version: 1 });

    migrate(2);

    expect(m2.up).toHaveBeenCalled();
  });

  test("rolls back migration on failure", () => {
    mockedDb.getFirstSync.mockReturnValue(null);

    (m1.up as jest.Mock).mockImplementation(() => {
      throw new Error("boom");
    });

    expect(() => migrate(1)).toThrow("boom");

    expect(mockedDb.execSync).toHaveBeenCalledWith(
      "ROLLBACK",
    );
  });

  test("downgrades migration", () => {
    mockedDb.getFirstSync.mockReturnValue({
      version: 2,
    });

    migrate(1);

    expect(m2.down).toHaveBeenCalled();
  });
});