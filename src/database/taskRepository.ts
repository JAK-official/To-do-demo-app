import { db } from './db';


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
    `
  );
}


export function insertTask(title: string) {

  const result = db.runSync(
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
      0,
      new Date().toISOString()
    ]
  );


  return {
    id: result.lastInsertRowId
  };
}


export function updateTaskCompleted(
  id: number,
  completed: number
) {

  db.runSync(
    `
    UPDATE tasks
    SET completed = ?
    WHERE id = ?
    `,
    [
      completed,
      id
    ]
  );

}


export function deleteTask(id:number) {

  db.runSync(
    `
    DELETE FROM tasks
    WHERE id = ?
    `,
    [id]
  );

}