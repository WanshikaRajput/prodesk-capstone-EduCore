const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const validate = require('../middleware/validate');

const router = express.Router();

const aiSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title is too long'),
});

const SYSTEM_PROMPT =
  'You are an API. You must respond ONLY with a valid, parsable JSON object matching this exact schema: ' +
  '{"description": string, "outcomes": [string, string, string]}. ' +
  'The description is 2 sentences about the course. The outcomes are 3 short learning outcomes. ' +
  'Do not include markdown wrappers or backticks.';

router.post('/suggest', validate(aiSchema), async (req, res) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ success: false, message: 'AI service is not configured' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: 'Course title: "' + req.body.title + '"',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
      },
    });

    const text = (response.text || '').replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      return res.status(502).json({ success: false, message: 'AI returned an invalid response' });
    }

    if (typeof parsed.description !== 'string' || !Array.isArray(parsed.outcomes)) {
      return res.status(502).json({ success: false, message: 'AI returned an unexpected format' });
    }

    res.json({
      success: true,
      data: {
        description: parsed.description,
        outcomes: parsed.outcomes.slice(0, 3),
      },
    });
  } catch (err) {
    res.status(502).json({ success: false, message: 'AI service is unavailable' });
  }
});

module.exports = router;