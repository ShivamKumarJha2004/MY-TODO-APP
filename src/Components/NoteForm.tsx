"use client";
import React, { useState } from "react";

interface Note {
  id: string;
  subject: string;
  content: string;
}

interface NoteFormProps {
  selectedSubject: string;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>; // ✅ Receive setNotes function
}

const NoteForm: React.FC<NoteFormProps> = ({ selectedSubject, setNotes }) => {
  const [noteContent, setNoteContent] = useState("");

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      subject: selectedSubject,
      content: noteContent,
    };

    // ✅ Get existing notes from localStorage
    const storedNotes = localStorage.getItem("notes");
    const notes = storedNotes ? JSON.parse(storedNotes) : [];

    // ✅ Add new note & save back to localStorage
    const updatedNotes = [...notes, newNote];
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    // ✅ Update UI instantly
    setNotes(updatedNotes);

    setNoteContent(""); // Clear textarea
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Add Note for {selectedSubject}</h3>
      <textarea
        className="w-full p-2 mt-2 bg-gray-900 text-white rounded-lg"
        rows={10}
        placeholder="Write your note here..."
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      />
      <button
        onClick={handleAddNote}
        className="mt-3 bg-blue-500 px-4 py-2 rounded-lg text-white hover:bg-blue-600"
      >
        Add Note
      </button>
    </div>
  );
};

export default NoteForm;
