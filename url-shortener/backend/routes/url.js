// routes/url.js
import express from 'express';
import Url from '../models/Url.js';
import { nanoid } from 'nanoid';


const router = express.Router();

// POST /api/shorten
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: 'URL is required' });
  }

  const shortId = nanoid(6);

  try {
    const newUrl = new Url({
      shortId,
      longUrl,
      clicks: 0,
      createdAt: new Date()
    });

    await newUrl.save();

    res.json({ shortUrl: `http://localhost:5000/${shortId}` });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// GET route to redirect short URL
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const urlEntry = await Url.findOne({ shortId });

    if (urlEntry) {
      urlEntry.clicks++;
      await urlEntry.save();
      return res.redirect(urlEntry.longUrl);
    } else {
      return res.status(404).json({ message: 'Short URL not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;
