import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import NoteModal from "../components/NoteModal";
import axios from "axios";
import { useAuth } from "../context/ContextProvider";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiSun, FiMoon } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { user } = useAuth();
  const [isModalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const closeModal = () => {
    setModalOpen(false);
    setCurrentNote(null);
  };

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-green-500 text-black dark:bg-green-500 dark:text-black">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const addNote = async (title, description) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/note/add`,
        { title, description },
        { headers }
      );
      if (response.data.success) {
        setNotes((prev) => [...prev, response.data.note]);
        closeModal();
        toast.success("Note added!");
      } else {
        toast.error(response.data.message || "Failed to add note.");
      }
    } catch (err) {
      toast.error("Error adding note.");
      console.error(err);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/note`, { headers });
      if (response.data.success) {
        setNotes(response.data.notes);
      } else {
        toast.error(response.data.message || "Failed to fetch notes.");
      }
    } catch (err) {
      toast.error("Error fetching notes.");
      console.error(err);
    }
  };

  const editNote = async (title, description) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/note/update/${currentNote._id}`,
        { title, description },
        { headers }
      );
      if (response.data.success) {
        setNotes((prev) =>
          prev.map((note) =>
            note._id === currentNote._id
              ? { ...note, title, description }
              : note
          )
        );
        closeModal();
        toast.success("Note updated!");
      }
    } catch (err) {
      toast.error("Error updating note.");
      console.error(err);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/note/delete/${noteId}`,
        { headers }
      );
      if (response.data.success) {
        setNotes((prev) => prev.filter((note) => note._id !== noteId));
        toast.info("Note deleted.");
      }
    } catch (err) {
      toast.error("Error deleting note.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchNotes();
  }, [user]);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <Navbar />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition"
        aria-label="Toggle Theme"
      >
        {darkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-700" />}
      </button>

      {user ? (
        <>
          <button
            onClick={() => setModalOpen(true)}
            aria-label="Add new note"
            className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white text-3xl rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-50"
          >
            +
          </button>

          {isModalOpen && (
            <NoteModal
              closeModal={closeModal}
              addNote={addNote}
              editNote={editNote}
              currentNote={currentNote}
              setCurrentNote={setCurrentNote}
            />
          )}

          <div className="max-w-3xl mx-auto px-4 mt-6">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 100 }}
                  whileDrag={{ scale: 1.05 }}
                  className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md p-5 transition hover:shadow-xl"
                >
                  <h3 className="text-lg font-bold break-words">
                    {highlightText(note.title, searchTerm)}
                  </h3>
                  <p className="mt-2 break-words">
                    {highlightText(note.description, searchTerm)}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => {
                        setCurrentNote(note);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-400 mt-10 text-lg">
                {searchTerm
                  ? "No notes match your search."
                  : "No notes found. Click the + to create one!"}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center mt-20 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-semibold">
            Please log in to view and manage your notes.
          </h2>
        </div>
      )}
    </div>
  );
};

export default Home;



