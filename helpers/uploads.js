import multer from 'multer'
import path from "path"
import fs from "fs"
import express from "express";

const router=express.Router();

const storage= multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // File naming
    },
});

export const upload=multer({storage})

router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

export default router;
