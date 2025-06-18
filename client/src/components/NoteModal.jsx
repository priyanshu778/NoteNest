 

import React, { useState, useEffect } from 'react';
 

const NoteModal = ({ closeModal, addNote, editNote, currentNote, setCurrentNote }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setDescription(currentNote.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [currentNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    currentNote ? editNote(title, description) : addNote(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <div  className=" inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 p-4">
      <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-100 w-full max-w-lg rounded-lg shadow-2xl p-6 relative animate-fade-in">

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentNote ? 'Edit Note' : 'Add New Note'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-red-500 text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition font-semibold"
            >
              {currentNote ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
