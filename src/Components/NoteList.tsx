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
              className="p-6 bg-gray-800 text-white rounded-lg shadow-md border border-gray-700 min-h-[200px] w-full"
            >
              <p className="text-lg text-zinc-100 whitespace-pre-wrap break-words">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoteList;
