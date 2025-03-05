import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [taskInput, setTaskInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (savedTasks.length > 0) {
      setTasks(
        savedTasks.map((task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }))
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskInput.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      text: taskInput,
      completed: false,
      priority: Math.floor(Math.random() * 3) + 1,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
    setTaskInput("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (id, text) => {
    setEditingTaskId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, text: editText } : task))
    );
    setEditingTaskId(null);
    setEditText("");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <h2>📋 To-Do List</h2>

      <div>
        <input
          type="text"
          placeholder="Add a task..."
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div>
        <label>Filter: </label>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={task.completed ? "completed" : ""}
                    >
                      {editingTaskId === task.id ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <button onClick={() => saveEdit(task.id)}>
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <span onClick={() => toggleComplete(task.id)}>
                            {task.completed ? "✅" : "⬜"} {task.text}
                          </span>
                          <div>
                            <button
                              onClick={() => startEditing(task.id, task.text)}
                            >
                              Edit
                            </button>
                            <button onClick={() => deleteTask(task.id)}>
                              Remove
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
