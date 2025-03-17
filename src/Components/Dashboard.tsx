"use client"; // Ensure this component runs on the client

import React, { useState, useEffect, useMemo } from "react";
import NoteForm from "@/Components/NoteForm";
import NoteList from "@/Components/NoteList";
//import TodoList from "@/Components/TodoList";

interface Note {
  id: string;
  subject: string;
  content: string;
}

interface Todo {
  id: string;
  subject: string;
  text: string;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const [isClient, setIsClient] = useState(false); // Fixes hydration issue
  const [notes, setNotes] = useState<Note[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState("");
  const [viewMode, setViewMode] = useState<"add" | "view" | "todo">("view");
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering
    
    // Load notes
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      const parsedNotes: Note[] = JSON.parse(storedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setSelectedSubject(parsedNotes[0].subject);
      }
    }
    
    // Load todos
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // 🛠 Optimized: UseMemo to avoid re-calculating subjects every render
  const subjects = useMemo(() => {
    return [...new Set(notes.map((note) => note.subject))];
  }, [notes]);

  const handleAddSubject = () => {
    if (newSubject.trim() === "") return;
    
    // Check if subject already exists
    if (!subjects.includes(newSubject)) {
      // Create a dummy note to ensure the subject appears
      const newNote: Note = {
        id: Date.now().toString(),
        subject: newSubject,
        content: ""
      };
      
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      setSelectedSubject(newSubject);
      setNewSubject("");
    } else {
      // If subject exists, just select it
      setSelectedSubject(newSubject);
      setNewSubject("");
    }
  };

  const handleDeleteSubject = (subjectToDelete: string) => {
    // Filter out all notes with the subject to delete
    const updatedNotes = notes.filter(note => note.subject !== subjectToDelete);
    
    // Update state and localStorage
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    
    // Also delete todos with this subject
    const updatedTodos = todos.filter(todo => todo.subject !== subjectToDelete);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    
    // If the currently selected subject is being deleted, select another subject or set to null
    if (selectedSubject === subjectToDelete) {
      const remainingSubjects = [...new Set(updatedNotes.map(note => note.subject))];
      setSelectedSubject(remainingSubjects.length > 0 ? remainingSubjects[0] : null);
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.trim() || !selectedSubject) return;
    
    const newTodoItem: Todo = {
      id: Date.now().toString(),
      subject: selectedSubject,
      text: newTodo,
      completed: false
    };
    
    const updatedTodos = [...todos, newTodoItem];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setNewTodo("");
  };

  const handleToggleTodo = (id: string) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  if (!isClient) return <p className="text-white">Loading...</p>; // Prevents SSR/CSR mismatch

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Stats Header */}
      <div className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Notes Dashboard</h1>
          <div className="flex flex-wrap gap-4">
            <div className="bg-blue-600 rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold">Total Subjects</h3>
              <p className="text-3xl font-bold">{subjects.length}</p>
            </div>
            <div className="bg-purple-600 rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold">Total Notes</h3>
              <p className="text-3xl font-bold">{notes.length}</p>
            </div>
            <div className="bg-green-600 rounded-lg p-4 flex-1">
              <h3 className="text-lg font-semibold">Total Tasks</h3>
              <p className="text-3xl font-bold">{todos.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar - Subjects */}
        <div className="md:w-1/4 w-full bg-gray-900 p-5 border-b md:border-b-0 md:border-r border-gray-700 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Subjects</h2>
          </div>
          
          {/* Add new subject */}
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Add New Subject</h3>
            <div className="flex">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 p-2 rounded-l-lg text-white bg-gray-700"
                placeholder="Subject name"
              />
              <button 
                onClick={handleAddSubject}
                className="bg-green-600 hover:bg-green-700 px-3 rounded-r-lg"
              >
                Add
              </button>
            </div>
          </div>
          
          <ul className="space-y-2">
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <li
                  key={subject}
                  className={`flex justify-between items-center cursor-pointer p-2 rounded-lg ${
                    selectedSubject === subject ? "bg-blue-500" : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <span 
                    className="flex-grow"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    {subject}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(subject);
                    }}
                    className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-700"
                    title="Delete subject"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No subjects added yet</p>
            )}
          </ul>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4 w-full flex flex-col overflow-hidden">
          {selectedSubject && (
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  {selectedSubject}
                </h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setViewMode("add")}
                    className={`px-4 py-2 rounded ${viewMode === "add" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  >
                    Add Note
                  </button>
                  <button 
                    onClick={() => setViewMode("view")}
                    className={`px-4 py-2 rounded ${viewMode === "view" ? "bg-blue-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  >
                    View Notes
                  </button>
                  <button 
                    onClick={() => setViewMode("todo")}
                    className={`px-4 py-2 rounded ${viewMode === "todo" ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600"}`}
                  >
                    To-Do List
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6 overflow-y-auto flex-1">
            {!selectedSubject ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-gray-400">Please select a subject from the left or add a new one</p>
              </div>
            ) : viewMode === "add" ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Add New Note</h3>
                <NoteForm selectedSubject={selectedSubject} setNotes={setNotes} />
              </div>
            ) : viewMode === "view" ? (
              <div>
                <h3 className="text-lg font-medium mb-4">Subject Notes</h3>
                <NoteList selectedSubject={selectedSubject} notes={notes} />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">To-Do List</h3>
                
                {/* Add new todo */}
                <div className="mb-6 bg-gray-800 p-4 rounded-lg">
                  <div className="flex">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      className="flex-1 p-2 rounded-l-lg text-white bg-gray-700"
                      placeholder="Add a new task..."
                    />
                    <button 
                      onClick={handleAddTodo}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
                
                {/* Todo list */}
                <div className="space-y-2">
                  {todos.filter(todo => todo.subject === selectedSubject).length === 0 ? (
                    <p className="text-gray-400 text-center">No tasks for this subject yet</p>
                  ) : (
                    todos
                      .filter(todo => todo.subject === selectedSubject)
                      .map(todo => (
                        <div 
                          key={todo.id} 
                          className="flex items-center p-3 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => handleToggleTodo(todo.id)}
                            className="w-5 h-5 mr-3 rounded border-gray-600 text-green-500 focus:ring-green-500"
                          />
                          <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {todo.text}
                          </span>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
