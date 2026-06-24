import { up, down } from "@/database/migrations/002_add_position";
import { db } from "@/database/db";

jest.mock("@/database/db", () => ({
  db: {
    execSync: jest.fn(),
  },
}));

describe("002_add_position", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("adds position column", () => {
    up();

    expect(db.execSync).toHaveBeenCalledWith(
      expect.stringContaining("ADD COLUMN position"),
    );
  });

  test("removes position column", () => {
    down();

    expect(db.execSync).toHaveBeenCalledWith(
      expect.stringContaining("DROP COLUMN position"),
    );
  });
});
