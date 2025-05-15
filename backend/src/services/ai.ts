import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeArtwork(imageUrl: string, userNotes: string = ''): Promise<any> {
  try {
    const prompt = `You are an expert art instructor analyzing a student's artwork. Please provide constructive feedback covering:

1. **Composition**: Rule of thirds, balance, focal points
2. **Technique**: Line work, shading, proportions
3. **Color**: Color theory, harmony, contrast (if applicable)
4. **Areas for Improvement**: Specific, actionable suggestions
5. **Strengths**: What the artist did well
6. **Next Steps**: 1-2 specific exercises to improve

Additional context from artist: "${userNotes}"

Please be encouraging but honest, and provide specific rather than general feedback.`;

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
      temperature: 0.7
    });

    return {
      feedback: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
      model: 'gpt-4-vision-preview'
    };
  } catch (error) {
    console.error('Error analyzing artwork:', error);
    throw new Error('Failed to analyze artwork with AI');
  }
}
