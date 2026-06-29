"use client";

import { useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const initialTodos: Todo[] = [
  { id: 1, text: "Write a unit test", completed: false },
  { id: 2, text: "Try RTL interactions", completed: true },
];

export function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [newTodo, setNewTodo] = useState("");

  function handleAddTodo() {
    const trimmedTodo = newTodo.trim();

    if (!trimmedTodo) {
      return;
    }

    setTodos((currentTodos) => [
      ...currentTodos,
      {
        id: Date.now(),
        text: trimmedTodo,
        completed: false,
      },
    ]);
    setNewTodo("");
  }

  function handleToggleTodo(id: number) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  return (
    <section className="flex flex-col gap-4 bg-slate-50 p-8 text-slate-950">
      <h2 className="text-xl font-semibold">Todo list</h2>

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="todo-input">
          New todo
        </label>
        <input
          className="h-10 rounded-md border border-slate-300 px-3"
          data-testid="todo-input"
          id="todo-input"
          placeholder="New todo"
          value={newTodo}
          onChange={(event) => setNewTodo(event.target.value)}
        />
        <button
          className="h-10 rounded-md bg-slate-950 px-4 font-semibold text-white"
          data-testid="todo-add-button"
          onClick={handleAddTodo}
          type="button"
        >
          Add todo
        </button>
      </div>

      <ul className="grid gap-2" data-testid="todo-list">
        {todos.map((todo) => (
          <li
            className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3"
            data-testid="todo-item"
            key={todo.id}
          >
            <input
              aria-label={`Toggle ${todo.text}`}
              checked={todo.completed}
              data-testid={`todo-toggle-${todo.id}`}
              onChange={() => handleToggleTodo(todo.id)}
              type="checkbox"
            />
            <span
              className={todo.completed ? "line-through text-slate-500" : ""}
              data-testid={`todo-text-${todo.id}`}
            >
              {todo.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
