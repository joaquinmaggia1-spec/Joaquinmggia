import Anthropic from '@anthropic-ai/sdk/index.js';

const client = new Anthropic();

export async function generatePresentation({
  idea,
  context,
  numSlides,
  branding,
  theme
}) {
  const prompt = `
You are an expert presentation designer for VÉRTICE STUDIO, a creative agency with a modern, minimalist approach.

Create a structured presentation outline for the following idea:
Topic: ${idea}
${context ? `Context: ${context}` : ''}
Number of slides: ${numSlides}

The presentation should:
- Follow a clean, minimalist design approach aligned with VÉRTICE STUDIO's brand identity
- Use ${branding.colors.primary} and ${branding.colors.secondary} as primary colors
- Include a compelling title slide, content slides, and conclusion
- Have engaging titles and key points for each slide
- Be professional yet creative

Return the outline as a JSON object with this structure:
{
  "title": "presentation title",
  "description": "brief description",
  "slides": [
    {
      "slideNumber": 1,
      "title": "slide title",
      "content": "bullet points or main content",
      "notes": "speaker notes"
    }
  ],
  "theme": "${theme.name}",
  "style": "${branding.style}"
}

Only return valid JSON, no additional text.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  const presentationData = JSON.parse(content);

  return {
    id: generateId(),
    ...presentationData,
    createdAt: new Date().toISOString(),
    branding: branding.name,
    originalIdea: idea
  };
}

function generateId() {
  return `pres-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
