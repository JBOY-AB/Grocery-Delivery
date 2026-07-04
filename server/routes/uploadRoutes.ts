import express from "express"
import auth from "../middleware/auth.js";
import multer from 'multer'
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router()

const storage = multer.memoryStorage();
const upload = multer({storage})

uploadRouter.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).json({message: "No image file provided"})
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64")
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: "grocery-del",
            resource_type: "auto",
        })

        res.json({url: result.secure_url})

    } catch (error: any) {
        console.error("Upload error:", error);
        res.status(500).json({message: error.message || "Upload failed"})
    }
})

uploadRouter.get('/test', async (req, res) => {
  try {
    const result = await cloudinary.api.resources({ max_results: 1 });
    res.json({ ok: true, resources: result.resources?.length ?? 0 });
  } catch (err: any) {
    console.error('Cloudinary test error:', err);
    res.status(500).json({
      ok: false,
      message: err.message || 'Cloudinary test failed',
      details: Object.getOwnPropertyNames(err).reduce((o: any, k) => {
        o[k] = err[k];
        return o;
      }, {}),
    });
  }
})

uploadRouter.get('/test-upload', async (req, res) => {
  try {
    const tinyPngDataURI =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

    const result = await cloudinary.uploader.upload(tinyPngDataURI, {
      folder: 'grocery-del/tests',
      resource_type: 'image',
    });

    res.json({ ok: true, url: result.secure_url });
  } catch (err: any) {
    console.error('Test upload error:', err);
    res.status(500).json({
      ok: false,
      message: err.message,
      details: Object.getOwnPropertyNames(err).reduce((o: any, k) => {
        o[k] = err[k];
        return o;
      }, {}),
    });
  }
})

export default uploadRouter