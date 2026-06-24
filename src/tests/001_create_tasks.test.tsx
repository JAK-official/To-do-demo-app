import { up, down } from "@/database/migrations/001_create_tasks";
import { db } from "@/database/db";

jest.mock("@/database/db", () => ({
  db: {
    execSync: jest.fn(),
  },
}));

describe("001_create_tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("creates tasks table", () => {
    up();

    expect(db.execSync).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE IF NOT EXISTS tasks"),
    );
  });

  test("drops tasks table", () => {
    down();

    expect(db.execSync).toHaveBeenCalledWith(
      expect.stringContaining("DROP TABLE IF EXISTS tasks"),
    );
  });
});
