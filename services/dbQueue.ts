/**
 * Fila de escrituras para SQLite.
 *
 * expo-sqlite comparte UNA conexión: si dos withTransactionAsync corren al mismo
 * tiempo, una cierra la transacción de la otra y aparece
 * "cannot rollback - no transaction is active".
 * Todo lo que escribe (INSERT/UPDATE/DELETE o transacciones) debe pasar por aquí,
 * así se ejecuta una escritura a la vez. Las lecturas no necesitan la fila.
 */
let queue: Promise<unknown> = Promise.resolve();

export function runDbWrite<T>(task: () => Promise<T>): Promise<T> {
  // Corre la tarea cuando termine la anterior, aunque la anterior haya fallado
  const run = queue.then(task, task);
  // La fila nunca se queda "rota" por un error
  queue = run.catch(() => undefined);
  return run;
}