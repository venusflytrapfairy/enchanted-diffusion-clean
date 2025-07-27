import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-api-key-here"
});

export async function generateImageDescription(userPrompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at creating detailed, vivid image descriptions for AI image generation. Take the user's prompt and expand it into a rich, detailed description that would help create the perfect image. Focus on visual details, lighting, composition, style, and atmosphere. Keep it under 200 words but make it comprehensive."
        },
        {
          role: "user",
          content: `Create a detailed image description for: ${userPrompt}`
        }
      ],
    });

    return response.choices[0].message.content || "Failed to generate description";
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate AI description");
  }
}

export async function refineImageDescription(originalDescription: string, userFeedback: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are helping refine an image description based on user feedback. Take the original description and the user's feedback to create an improved version that incorporates their suggestions while maintaining the quality and detail of the description."
        },
        {
          role: "user",
          content: `Original description: ${originalDescription}\n\nUser feedback: ${userFeedback}\n\nPlease provide a refined description that incorporates the feedback:`
        }
      ],
    });

    return response.choices[0].message.content || "Failed to refine description";
  } catch (error) {
    console.error("Error refining description:", error);
    throw new Error("Failed to refine description");
  }
}

export async function generateImage(description: string): Promise<{ url: string }> {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: description,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return { url: response.data[0].url! };
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image");
  }
}
 
