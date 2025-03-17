"use client"; // Next.js ke liye "use client" zaroori hai
import React from "react";

interface Note {
  id: string;
  subject: string;
  content: string;
}

interface NoteListProps {
  selectedSubject: string;
  notes: Note[];
}

const NoteList: React.FC<NoteListProps> = ({ selectedSubject, notes }) => {
  // ✅ Filter notes based on selectedSubject
  const filteredNotes = notes.filter((note) => note.subject === selectedSubject);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4 text-white text-center">
        Notes for <span className="text-blue-400">{selectedSubject}</span>
      </h2>

      {/* ✅ Notes ko scrollable banane ke liye max height aur overflow-y-auto */}
      <div className="max-h-96 overflow-y-auto space-y-4 p-2 bg-gray-900 rounded-lg">
        {filteredNotes.length === 0 ? (
          <p className="text-gray-400 text-center">
            No notes available for this subject. Add a new note!
          </p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-4 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700"
            >
              <p className="text-lg text-zinc-100 break-words">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;
