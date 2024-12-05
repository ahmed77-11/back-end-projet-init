import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';

const router = express.Router();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary.v2,
    params: {
        folder: 'videos',
        resource_type: 'video',
    },
});

const upload = multer({ storage: storage });

// Middleware to log upload progress
const logUploadProgress = (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'], 10); // Total size of the request
    let bytesUploaded = 0;

    req.on('data', (chunk) => {
        bytesUploaded += chunk.length;
        const percentage = ((bytesUploaded / contentLength) * 100).toFixed(2);
        console.log(`Upload progress: ${percentage}%`);
    });

    req.on('end', () => {
        console.log('Upload complete!');
    });

    next();
};

// Upload Video Route
router.post('/uploadVideos', logUploadProgress, upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).json({ filePath: req.file.path });
});

// Update Video Route with Progress Logging
router.post('/updateVideo', logUploadProgress, upload.single('video'), async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ message: 'No video URL provided.' });
    }

    try {
        const baseUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/`;

        if (!videoUrl.startsWith(baseUrl)) {
            return res.status(400).json('Invalid video URL.');
        }

        const publicIdWithExtension = videoUrl.replace(baseUrl, '');
        let publicId = publicIdWithExtension.split('.')[0]; // Remove the file extension
        publicId=publicId.split('/')[1]+"/"+publicId.split("/")[2];
        console.log(publicId)// Remove the folder name

        // Delete old video using the correct publicId
        await cloudinary.v2.uploader.destroy(publicId, { resource_type: 'video' });

        if (!req.file) {
            return res.status(400).json('No new file uploaded.');
        }

        const newVideoUrl = req.file.path;

        res.status(200).json({
            message: 'Video updated successfully.',
            filePath:newVideoUrl,
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: e.message });
    }
});

export default router;
