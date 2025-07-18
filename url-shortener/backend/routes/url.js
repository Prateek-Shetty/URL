// routes/url.js
import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

const router = express.Router();

// POST /shorten
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const shortId = nanoid(6);

  try {
    const url = await Url.create({ longUrl, shortId });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// GET /:shortId
router.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId });
    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.longUrl);
    } else {
      res.status(404).json({ error: 'URL not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
