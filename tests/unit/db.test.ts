import { describe, it, expect } from "vitest";
import { InMemoryStore } from "@/lib/db";

describe("InMemoryStore", () => {
  interface TestItem {
    id: string;
    name: string;
    value: number;
  }

  it("creates and retrieves items", async () => {
    const store = new InMemoryStore<TestItem>();
    const item = { id: "1", name: "test", value: 42 };
    await store.create(item);
    const found = await store.findById("1");
    expect(found).toEqual(item);
  });

  it("returns undefined for missing items", async () => {
    const store = new InMemoryStore<TestItem>();
    const found = await store.findById("nonexistent");
    expect(found).toBeUndefined();
  });

  it("lists all items", async () => {
    const store = new InMemoryStore<TestItem>();
    await store.create({ id: "1", name: "a", value: 1 });
    await store.create({ id: "2", name: "b", value: 2 });
    const all = await store.findAll();
    expect(all).toHaveLength(2);
  });

  it("updates items", async () => {
    const store = new InMemoryStore<TestItem>();
    await store.create({ id: "1", name: "old", value: 1 });
    const updated = await store.update("1", { name: "new" });
    expect(updated?.name).toBe("new");
    expect(updated?.value).toBe(1);
  });

  it("returns undefined when updating nonexistent item", async () => {
    const store = new InMemoryStore<TestItem>();
    const result = await store.update("nonexistent", { name: "test" });
    expect(result).toBeUndefined();
  });

  it("deletes items", async () => {
    const store = new InMemoryStore<TestItem>();
    await store.create({ id: "1", name: "test", value: 1 });
    const deleted = await store.delete("1");
    expect(deleted).toBe(true);
    const found = await store.findById("1");
    expect(found).toBeUndefined();
  });

  it("returns false when deleting nonexistent item", async () => {
    const store = new InMemoryStore<TestItem>();
    const deleted = await store.delete("nonexistent");
    expect(deleted).toBe(false);
  });

  it("filters items by predicate", async () => {
    const store = new InMemoryStore<TestItem>();
    await store.create({ id: "1", name: "a", value: 10 });
    await store.create({ id: "2", name: "b", value: 20 });
    await store.create({ id: "3", name: "c", value: 30 });
    const filtered = await store.filter((item) => item.value > 15);
    expect(filtered).toHaveLength(2);
  });

  it("counts items", async () => {
    const store = new InMemoryStore<TestItem>();
    await store.create({ id: "1", name: "a", value: 1 });
    await store.create({ id: "2", name: "b", value: 2 });
    const count = await store.count();
    expect(count).toBe(2);
  });

  it("seeds items correctly", () => {
    const store = new InMemoryStore<TestItem>();
    store.seed([
      { id: "1", name: "a", value: 1 },
      { id: "2", name: "b", value: 2 },
    ]);
    // Verify synchronously through async
    store.findAll().then((items) => {
      expect(items).toHaveLength(2);
    });
  });
});
