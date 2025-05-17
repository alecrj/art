// backend/src/assessment/skillDetector.ts
import OpenAI from 'openai';
import { SkillLevel, SkillMarker, ArtStyle } from '../models/assessment/Assessment';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SkillAnalysis {
  skillLevel: SkillLevel;
  skillMarkers: SkillMarker[];
  detectedStyles: ArtStyle[];
  positives: string[];
  rawAnalysis: string;
}

export async function detectSkillLevel(imageUrl: string, drawingTime: number): Promise<SkillAnalysis> {
  const prompt = `You are an expert art instructor analyzing a student's quick drawing for SKILL ASSESSMENT and ENCOURAGEMENT.

CRITICAL INSTRUCTIONS:
1. ALWAYS find 2-3 genuine positive things, no matter the skill level
2. Focus on potential and improvement markers, not perfection
3. Be encouraging while being accurate about skill level

ANALYSIS FRAMEWORK:

**SKILL LEVEL DETECTION:**
- absolute_beginner: Basic shapes, learning fundamentals, early mark-making
- some_experience: Shows understanding of basic forms, some control
- intermediate: Good line confidence, understands proportions, shows technique
- advanced: Strong technique, sophisticated understanding, artistic expression

**SKILL MARKERS TO LOOK FOR:**
- Line Quality: Confidence, control, variation, intentionality
- Shapes: Understanding of basic forms, geometric accuracy
- Proportions: Ability to show relationships, sizing
- Creativity: Original ideas, problem-solving, expression
- Detail: Level of elaboration, attention to specifics
- Confidence: Bold strokes vs. tentative marks

**ART STYLES TO DETECT:**
- realistic, cartoon, abstract, anime, sketch, experimental

**POSITIVE INDICATORS (find these!):**
- Line confidence (even if shaky)
- Creative problem-solving
- Good instincts (proportion, placement)
- Expressive marks
- Improvement potential
- Unique approach

Drawing time: ${drawingTime} seconds

Please analyze this artwork and return a JSON response with:
{
  "skillLevel": "absolute_beginner|some_experience|intermediate|advanced",
  "skillMarkers": [
    {
      "category": "line_quality|shapes|proportions|creativity|detail|confidence",
      "strength": "emerging|developing|solid",
      "description": "What you observed",
      "evidence": "Specific visual evidence"
    }
  ],
  "detectedStyles": [
    {
      "style": "realistic|cartoon|abstract|anime|sketch|experimental",
      "confidence": 0.8,
      "elements": ["specific elements you see"]
    }
  ],
  "positives": [
    "I love how confident your line work is here...",
    "Your sense of proportion shows real artistic instinct...",
    "The creativity in your approach is wonderful..."
  ],
  "analysis": "A warm, encouraging summary of what you see, leading with positives"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.3, // Lower temperature for more consistent analysis
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from GPT-4 Vision');
    }

    // Parse the JSON response
    const analysisData = JSON.parse(content);
    
    return {
      skillLevel: analysisData.skillLevel,
      skillMarkers: analysisData.skillMarkers,
      detectedStyles: analysisData.detectedStyles,
      positives: analysisData.positives,
      rawAnalysis: analysisData.analysis
    };

  } catch (error) {
    console.error('Error in skill detection:', error);
    
    // Fallback analysis if AI fails
    return {
      skillLevel: 'some_experience',
      skillMarkers: [
        {
          category: 'confidence',
          strength: 'developing',
          description: 'Shows willingness to create and explore',
          evidence: 'Took the initiative to draw'
        }
      ],
      detectedStyles: [
        {
          style: 'sketch',
          confidence: 0.7,
          elements: ['Quick drawing style']
        }
      ],
      positives: [
        'I love that you jumped right in and started creating!',
        'Your willingness to draw shows real artistic spirit',
        'Every artist started exactly where you are now'
      ],
      rawAnalysis: 'You have the most important thing - the courage to create. Let\'s build on that foundation!'
    };
  }
}