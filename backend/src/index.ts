import cors from 'cors';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

// Set up express app
const app = express();
const port = process.env.PORT || 3000;
const execPromise = promisify(exec);

// Ensure the 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer storage for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save to 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Dynamic filename
  }
});

const upload = multer({ storage });
let videoFileName = ''; // Variable to store uploaded video filename

// Use CORS and JSON middleware
app.use(cors());
app.use(express.json());

// Function to run the Python script on the uploaded video
async function runPythonScript(videoPath: string) {
  try {
    const videoFilePath = path.join(__dirname, 'uploads', videoPath); // Absolute path to the uploaded video
    const { stdout, stderr } = await execPromise(`python ./app.py "${videoFilePath}"`); // Ensure the correct Python script is being called

    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`stdout: ${stdout}`);
    return stdout; // Return the script's output
  } catch (error) {
    console.error(`exec error: ${error}`);
    return `Exec error: ${error.message}`;
  }
}

// Endpoint for uploading the video
app.post('/upload-video', upload.single('video'), (req, res) => {
  if (req.file) {
    videoFileName = req.file.filename; // Store the dynamically uploaded video file name
    console.log(`Video uploaded successfully: ${videoFileName}`);
    res.json({
      message: 'Video uploaded successfully',
      filename: req.file.filename,
    });
  } else {
    res.status(400).json({
      message: 'No video uploaded',
    });
  }
});

// Endpoint to get result after processing the uploaded video
app.get('/result', async (req, res) => {
  if (!videoFileName) {
    return res.status(400).json({ message: 'No video has been uploaded yet' });
  }

  try {
    const result = await runPythonScript(videoFileName);
    res.json({
      status: 'completed',
      originalResult: result,
      message: 'Let us know if anything is wrong',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing the video',
      error: error.message,
    });
  }
});

// Test endpoint to check if the server is running
app.get('/test', (req, res) => {
  res.status(200).json({
    message: 'Test endpoint works',
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
