"use client"; // Next.js ke liye "use client" zaroori hai
import React, { useState } from "react";

interface Note {
  id: string;
  subject: string;
  content: string;
}

interface NoteListProps {
  selectedSubject: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NoteList: React.FC<NoteListProps> = ({ selectedSubject, notes, setNotes }) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");

  // ✅ Filter notes based on selectedSubject
  const filteredNotes = notes.filter((note) => note.subject === selectedSubject);

  // Function to delete a specific note
  const handleDeleteNote = (noteId: string) => {
    // Filter out the note to be deleted
    const updatedNotes = notes.filter(note => note.id !== noteId);
    
    // Update state and localStorage
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  // Function to start editing a note
  const handleStartEdit = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedContent(note.content);
  };

  // Function to save edited note
  const handleSaveEdit = () => {
    if (!editingNoteId) return;

    const updatedNotes = notes.map(note => 
      note.id === editingNoteId 
        ? { ...note, content: editedContent } 
        : note
    );
    
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setEditingNoteId(null);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingNoteId(null);
  };

  return (
    <div className="w-full mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white text-center">
        Notes for <span className="text-blue-400">{selectedSubject}</span>
      </h2>

      {/* ✅ Improved note display with better width and height */}
      <div className="space-y-6">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-400 text-center p-8 bg-gray-900 rounded-lg">
            No notes available for this subject. Add a new note!
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-6 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700 min-h-[200px] w-full relative"
            >
              {editingNoteId === note.id ? (
                // Edit mode
                <>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full h-[180px] p-2 bg-gray-900 text-white rounded-lg mb-4"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                // View mode
                <>
                  {/* Action buttons */}
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="text-blue-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-700"
                      title="Edit note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-gray-700"
                      title="Delete note"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-lg text-zinc-100 whitespace-pre-wrap break-words">{note.content}</p>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;
