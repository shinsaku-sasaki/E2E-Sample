import { test, expect } from "@playwright/test";
import { TODO_APP_URL } from "../constants";

test("タイトルの表示", async ({ page }) => {
  await page.goto(TODO_APP_URL);

  await expect(page).toHaveTitle(/My Sample ToDo List/);
});

test("ToDoを追加", async ({ page }) => {
  await page.goto(TODO_APP_URL);
  // 「New ToDo」ボタンを押す
  const newTodoButton = page.getByRole("button", { name: "New ToDo" });
  await newTodoButton.click();

  // モーダルが表示される
  const modal = page.getByRole("dialog");
  expect(modal).toBeVisible();

  // 内容を入力する
  const input = page.getByRole("textbox");
  const timestamp = new Date().getTime().toString();
  await input.fill(timestamp);

  // 「作成する」ボタンを押す
  const createButton = page.getByRole("button", { name: "作成する" });
  await createButton.click();

  // 追加されたことを確認
  const newToDo = page.getByRole("listitem").first();
  await expect(newToDo).toHaveText(timestamp);
});

test("ToDoを編集", async ({ page }) => {
  await page.goto(TODO_APP_URL);
  // 先頭のToDoを取得
  const firstToDo = page.getByRole("listitem").first();
  const editButton = firstToDo.getByLabel("edit");
  await editButton.click();

  // モーダルが表示される
  const modal = page.getByRole("dialog");
  expect(modal).toBeVisible();

  // 内容を編集する
  const input = page.getByRole("textbox");
  const timestamp = new Date().getTime().toString();
  await input.fill(timestamp);

  // 「更新する」ボタンを押す
  const updateButton = page.getByRole("button", { name: "更新する" });
  await updateButton.click();

  // 編集されたことを確認
  await expect(firstToDo).toHaveText(timestamp);
});

test("ToDoを削除", async ({ page }) => {
  await page.goto(TODO_APP_URL);

  await page.waitForTimeout(1000);
  const toDoCountBefore = await page.getByRole("listitem").count();
  const firstToDo = page.getByRole("listitem").first();

  const deleteButton = firstToDo.getByLabel("Delete");
  await deleteButton.click();

  const toDoCountAfter = await page.getByRole("listitem").count();

  // 個数が1つ減っていることを確認
  expect(toDoCountBefore).toBe(toDoCountAfter + 1);
});
