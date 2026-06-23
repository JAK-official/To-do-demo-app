import { db } from "./db";

export function getTasks() {
  return db.getAllSync<{
    id: number;
    title: string;
    completed: number;
    position: number;
    created_at: string;
  }>(
    `
    SELECT *
    FROM tasks
    ORDER BY position ASC
    `,
  );
}

export function insertTask(title: string) {
  const result = db.getFirstSync<{ maxPosition: number }>(
    `
    SELECT MAX(position) as maxPosition
    FROM tasks
    `
  );

  const position = (result?.maxPosition ?? -1) + 1;

  const insert = db.runSync(
    `
    INSERT INTO tasks
    (
      title,
      completed,
      position,
      created_at
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      title,
      0,
      position,
      new Date().toISOString(),
    ],
  );

  return {
    id: insert.lastInsertRowId,
  };
}

export function updateTaskCompleted(id: number, completed: number) {
  db.runSync(
    `
    UPDATE tasks
    SET completed = ?
    WHERE id = ?
    `,
    [completed, id],
  );
}

export function deleteTask(id: number) {
  db.runSync(
    `
    DELETE FROM tasks
    WHERE id = ?
    `,
    [id],
  );
}

export function updateTaskPosition(
  id: number,
  position: number
) {
  db.runSync(
    `
    UPDATE tasks
    SET position = ?
    WHERE id = ?
    `,
    [position, id]
  );
}
