import express from 'express'
import Note from '../models/note.js';
import middleware from '../middleware/middleware.js';

const router=express.Router();


router.post('/add', middleware, async (req, res) => {
  try {
      const { title, description } = req.body;

      
      if (!title || !description) {
          return res.status(400).json({ success: false, message: 'Title and description are required' });
      }

      const newNote = new Note({
          title,
          description,
          userId: req.user.id
      });

      const savedNote = await newNote.save();  
      
      console.log('Saved Note:', savedNote);   
     
      return res.status(200).json({ success: true, message: 'Note Created Successfully!',note: savedNote });
  } catch (err) {
      console.error('Error in Adding Note:', err);  
      return res.status(500).json({ success: false, message: 'Error in Adding Note!' });
  }
});



 

router.get('/', middleware, async (req, res) => {
  try {
    console.log("Fetching notes for user:", req.user);
    const notes = await Note.find({ userId: req.user.id });  
    console.log("Notes fetched:", notes);
    return res.status(200).json({ success: true, notes });
  } catch (err) {
    console.error("Error fetching notes:", err);
    return res.status(500).json({ success: false, message: "Cannot fetch notes" });
  }
});


router.put('/update/:id', middleware, async (req, res) => {
  const { title, description } = req.body;
  const updatedNote = await Note.findByIdAndUpdate(
    req.params.id,
    { title, description },
    { new: true }
  );
  return res.status(200).json({ success: true, message: 'Note updated successfully', note: updatedNote });
});


router.delete('/delete/:id', middleware, async (req, res) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);
  return res.status(200).json({ success: true, message: 'Note deleted successfully' });
});


export default router;