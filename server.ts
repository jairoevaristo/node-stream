import express from 'express'
import fs from 'fs';
import path from 'path';

const app = express();

app.get('/video', (req, res) => {
  const { range } = req.headers;
  const videoPath = path.resolve(__dirname, './video', 'video.mp4');
  const videoSize = fs.statSync(videoPath).size;

  const chuckSize = 1 * 1e+6;
  const start = Number(range?.replace(/\D/g, ''));
  const end = Math.min(start + chuckSize, videoSize - 1);

  const contentLength = end - start + 1;

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Range': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4'
  }
  
  res.writeHead(206, headers);

  const stream = fs.createReadStream(videoPath, { start, end });
  stream.pipe(res);
})

app.listen(3333, () => console.log('Start server...'));