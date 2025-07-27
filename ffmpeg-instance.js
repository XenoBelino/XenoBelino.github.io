// ffmpeg-instance.js
import { createFFmpeg, fetchFile } from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/+esm';
const ffmpeg = createFFmpeg({ log: true });
export { ffmpeg, fetchFile };
