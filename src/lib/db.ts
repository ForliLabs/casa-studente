/**
 * In-memory data store for development and MVP usage.
 *
 * Provides a Map-backed, async-compatible CRUD interface that mirrors
 * typical database repository patterns. All methods return Promises to
 * ensure a seamless migration path to Prisma/PostgreSQL — swap the
 * implementation without changing calling code.
 *
 * @remarks
 * - **Not suitable for production** — data is lost on server restart and
 *   not shared across serverless function instances.
 * - Use {@link seed} to populate stores with demo data at import time.
 * - For production, migrate to the Prisma-based repositories in
 *   `src/lib/repositories/`.
 *
 * @module db
 */

/** Base constraint for all storable records. */
export type DbRecord = object;

/**
 * Generic in-memory data store with async CRUD operations.
 *
 * @typeParam T - Entity type. Must have a string `id` field used as the primary key.
 *
 * @example
 * ```typescript
 * interface Todo { id: string; title: string; done: boolean }
 * const store = new InMemoryStore<Todo>();
 * await store.create({ id: "1", title: "Buy milk", done: false });
 * const todo = await store.findById("1");
 * ```
 */
export class InMemoryStore<T extends { id: string }> {
  private data: Map<string, T> = new Map();

  /** Retrieve all records in insertion order. */
  async findAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  /**
   * Find a single record by its primary key.
   * @param id - The record's unique identifier.
   * @returns The matching record, or `undefined` if not found.
   */
  async findById(id: string): Promise<T | undefined> {
    return this.data.get(id);
  }

  /**
   * Insert a new record. Overwrites if `id` already exists.
   * @param item - The record to insert.
   * @returns The inserted record.
   */
  async create(item: T): Promise<T> {
    this.data.set(item.id, item);
    return item;
  }

  /**
   * Partially update an existing record by merging fields.
   * @param id - The record's unique identifier.
   * @param updates - Partial fields to merge into the existing record.
   * @returns The updated record, or `undefined` if the ID was not found.
   */
  async update(id: string, updates: Partial<T>): Promise<T | undefined> {
    const existing = this.data.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates } as T;
    this.data.set(id, updated);
    return updated;
  }

  /**
   * Delete a record by ID.
   * @param id - The record's unique identifier.
   * @returns `true` if the record existed and was deleted, `false` otherwise.
   */
  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  /**
   * Filter records using a predicate function.
   * @param predicate - A function that returns `true` for records to include.
   * @returns An array of matching records.
   */
  async filter(predicate: (item: T) => boolean): Promise<T[]> {
    return Array.from(this.data.values()).filter(predicate);
  }

  /** Return the total number of records in the store. */
  async count(): Promise<number> {
    return this.data.size;
  }

  /**
   * Bulk-insert records for initialization (e.g., demo data).
   * This is a **synchronous** convenience method intended for use at
   * module load time.
   * @param items - Records to insert. Existing IDs are overwritten.
   */
  seed(items: T[]): void {
    items.forEach((item) => this.data.set(item.id, item));
  }
}
