const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer for handling large file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1000 // 1000 MB limit
  }
});

// Extract subtitles using FFmpeg
function extractSubtitles(inputFile) {
  return new Promise((resolve, reject) => {
    // First get subtitle tracks info
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_streams',
      '-select_streams', 's',
      inputFile
    ]);

    let outputData = '';

    ffprobe.stdout.on('data', (data) => {
      outputData += data;
    });

    ffprobe.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Failed to get subtitle info'));
        return;
      }

      try {
        const subtitleInfo = JSON.parse(outputData);
        if (!subtitleInfo.streams || subtitleInfo.streams.length === 0) {
          resolve({ message: 'No subtitles found in file' });
          return;
        }

        // Extract first subtitle track to SRT
        const outputFile = path.join(
          path.dirname(inputFile),
          path.basename(inputFile, path.extname(inputFile)) + '.srt'
        );

        const ffmpeg = spawn('ffmpeg', [
          '-i', inputFile,
          '-map', '0:s:0',
          outputFile
        ]);

        ffmpeg.on('close', (code) => {
          if (code !== 0) {
            reject(new Error('Failed to extract subtitles'));
            return;
          }

          // Read extracted subtitles
          fs.readFile(outputFile, 'utf8', (err, data) => {
            if (err) {
              reject(err);
              return;
            }
            resolve({
              message: 'Subtitles extracted successfully',
              subtitles: data
            });
          });
        });

      } catch (err) {
        reject(err);
      }
    });
  });
}

// Handle file upload
app.post('/api/extract-subtitles', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await extractSubtitles(req.file.path);
    res.json(result);

  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Error handling for file size exceeded
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File size is too large. Max limit is 1000MB'
      });
    }
  }
  next(error);
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
}); 