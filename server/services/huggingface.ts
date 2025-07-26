import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateImageDescription(userPrompt: string): Promise<string> {
  try {
    // Create a magical fairycore-inspired description
    const fairycoreDescription = await generateFairycoreDescription(userPrompt);
    return fairycoreDescription;
    
  } catch (error) {
    console.error("Error generating fairycore description:", error);
    // Fallback to local description generation
    return generateFairycoreDescription(userPrompt);
  }
}

function generateFairycoreDescription(userPrompt: string): string {
  // Create a magical fairycore-inspired description
  const prompt = userPrompt.toLowerCase().trim();
  
  // Fairycore aesthetic elements
  const fairyLightingOptions = [
    "soft ethereal moonbeam lighting filtering through ancient trees",
    "magical golden hour light with dancing fairy dust particles",
    "gentle bioluminescent glow from enchanted flowers",
    "dreamy pastel lighting with sparkles and starlight",
    "warm candlelit atmosphere with floating orbs of light",
    "mystical aurora-like colors painting the sky",
    "delicate morning mist illuminated by forest spirits"
  ];
  
  const fairyStyleOptions = [
    "whimsical fairytale illustration style",
    "ethereal watercolor with magical elements",
    "dreamy cottagecore aesthetic with natural magic",
    "enchanted forest fantasy art",
    "soft botanical illustration with fairy elements",
    "romantic pre-raphaelite painting style",
    "delicate storybook illustration"
  ];
  
  const fairyColors = [
    "soft lavender, dusty rose, and mint green tones",
    "pastel pink, buttercream, and sage green palette",
    "ethereal blues, lilacs, and pearl white hues",
    "warm peach, cream, and forest green colors",
    "gentle mauve, dusty blue, and champagne tints",
    "magical rainbow pastels with silver accents",
    "earth tones mixed with fairy dust shimmer"
  ];
  
  const fairyElements = [
    "delicate butterflies, flower petals, and dewdrops",
    "mushrooms, moss, and tiny magical creatures",
    "floating sparkles, stardust, and glowing orbs",
    "wild flowers, ivy vines, and crystal formations",
    "fairy rings, toadstools, and enchanted flora",
    "gossamer wings, moonbeams, and celestial magic",
    "forest spirits, woodland creatures, and nature's wisdom bubbles"
  ];
  
  // Randomly select magical elements
  const lighting = fairyLightingOptions[Math.floor(Math.random() * fairyLightingOptions.length)];
  const style = fairyStyleOptions[Math.floor(Math.random() * fairyStyleOptions.length)];
  const colors = fairyColors[Math.floor(Math.random() * fairyColors.length)];
  const elements = fairyElements[Math.floor(Math.random() * fairyElements.length)];
  
  // Build magical description
  let description = `An enchanted fairycore scene featuring ${userPrompt}, rendered with ${style}. `;
  
  // Add magical context based on prompt content
  if (prompt.includes('cat') || prompt.includes('kitten') || prompt.includes('feline')) {
    description += `A mystical feline creature with soft, luminous fur that seems touched by starlight, surrounded by magical woodland elements. `;
  }
  
  if (prompt.includes('fairy') || prompt.includes('sprite') || prompt.includes('pixie')) {
    description += `A delicate fairy being with gossamer wings that shimmer like morning dew, floating gracefully among enchanted flowers. `;
  }
  
  if (prompt.includes('forest') || prompt.includes('woods') || prompt.includes('nature')) {
    description += `An enchanted forest glade where ancient trees whisper secrets and magical creatures dwell in harmony with nature. `;
  }
  
  if (prompt.includes('flower') || prompt.includes('rose') || prompt.includes('garden')) {
    description += `A magical garden where flowers glow with inner light and petals dance on invisible breezes filled with fairy magic. `;
  }
  
  if (prompt.includes('cottage') || prompt.includes('house') || prompt.includes('home')) {
    description += `A whimsical cottage nestled in an enchanted setting, covered in climbing roses and surrounded by fairy lights. `;
  }
  
  // Add aesthetic details
  description += `The scene is illuminated by ${lighting}, creating a dreamy atmosphere. `;
  description += `The color palette features ${colors} that blend harmoniously together. `;
  description += `Delicate magical details include ${elements} scattered throughout the composition. `;
  
  // Add fairycore finishing touches
  description += `The overall mood is ethereal and whimsical, evoking a sense of wonder and connection to nature's magic. `;
  description += `Soft textures, gentle movements, and an abundance of natural beauty create a scene that feels both dreamy and alive with fairy enchantment.`;
  
  return description;
}

export async function refineImageDescription(originalDescription: string, userFeedback: string): Promise<string> {
  try {
    // Enhanced refinement logic that properly incorporates specific user requirements
    let refinedDescription = originalDescription;
    const feedback = userFeedback.toLowerCase();
    
    // Handle specific physical attributes and features
    if (feedback.includes('wings')) {
      refinedDescription = refinedDescription.replace(/The animal is captured with incredible detail/, 'The winged animal is captured with incredible detail, featuring majestic feathered wings spread gracefully');
    }
    
    if (feedback.includes('white fur') || feedback.includes('white')) {
      refinedDescription = refinedDescription.replace(/showing individual fur textures/, 'showing pristine white fur with individual texture details and soft, fluffy appearance');
    }
    
    if (feedback.includes('black fur') || feedback.includes('black')) {
      refinedDescription = refinedDescription.replace(/showing individual fur textures/, 'showing sleek black fur with individual texture details and glossy appearance');
    }
    
    if (feedback.includes('long hair') || feedback.includes('flowing')) {
      refinedDescription = refinedDescription.replace(/fur textures/, 'long, flowing fur that cascades naturally');
    }
    
    // Handle colors and color changes
    if (feedback.includes('blue eyes')) {
      refinedDescription = refinedDescription.replace(/expressive eyes/, 'striking blue eyes that gleam with intelligence');
    }
    
    if (feedback.includes('green eyes')) {
      refinedDescription = refinedDescription.replace(/expressive eyes/, 'mesmerizing green eyes that sparkle');
    }
    
    // Handle general color requests
    if (feedback.includes('more color') || feedback.includes('colorful')) {
      refinedDescription = refinedDescription.replace('Rich color palette', 'Vibrant, saturated color palette with bold hues and striking contrasts');
    }
    
    // Handle lighting and mood
    if (feedback.includes('darker') || feedback.includes('moody')) {
      refinedDescription = refinedDescription.replace(/bright|vibrant|golden/gi, 'dark, moody');
    }
    
    if (feedback.includes('brighter') || feedback.includes('lighter')) {
      refinedDescription = refinedDescription.replace(/dark|moody|dramatic/gi, 'bright, luminous');
    }
    
    // Handle detail level
    if (feedback.includes('more detail') || feedback.includes('detailed')) {
      refinedDescription += ' Additional intricate details include fine textures, subtle gradations, and carefully rendered surface materials.';
    }
    
    if (feedback.includes('simple') || feedback.includes('minimal')) {
      refinedDescription = refinedDescription.replace(/detailed|intricate|complex/gi, 'clean, minimalist');
    }
    
    // Handle specific scene elements
    if (feedback.includes('background')) {
      refinedDescription += ` The background is specifically modified: ${userFeedback}.`;
    }
    
    if (feedback.includes('flower') || feedback.includes('garden')) {
      refinedDescription = refinedDescription.replace(/The natural environment/, 'The lush garden environment filled with blooming flowers');
    }
    
    // For any specific requirements not covered by patterns, add them directly
    const specificRequirements = [];
    
    // Extract specific requirements from feedback
    if (feedback.includes('must have') || feedback.includes('should have')) {
      const requirements = userFeedback.split(/must have|should have/i)[1];
      if (requirements) {
        specificRequirements.push(requirements.trim());
      }
    }
    
    // Add specific requirements to the description
    if (specificRequirements.length > 0) {
      refinedDescription = refinedDescription.replace(/The overall mood/, `Importantly, incorporating the specific requirements: ${specificRequirements.join(', ')}. The overall mood`);
    }
    
    return refinedDescription;
    
  } catch (error) {
    console.error("Error refining description:", error);
    // Fallback to simple concatenation
    return `${originalDescription}\n\nRefined based on feedback: ${userFeedback}`;
  }
}

// Generate image using Hugging Face Stable Diffusion
export async function generateImage(description: string): Promise<{ url: string }> {
  console.log("Starting image generation for:", description);

  // Try Stable Diffusion 3.5 Large via direct API call
  const models = [
    'stabilityai/stable-diffusion-3.5-large'
  ];

  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: description,
            parameters: {
              negative_prompt: "blurry, bad quality, distorted, deformed, ugly, text, watermark, logo, words, letters, writing, eco generated, eco-generated, watermarks, signatures, labels, badges, stamps, overlay text, corner text, harsh lighting, dark themes, horror, scary, violent",
              num_inference_steps: 50,
              guidance_scale: 7.5
            }
          }),
        }
      );

      console.log(`Response status for ${model}:`, response.status);

      if (response.ok) {
        const imageBlob = await response.blob();
        console.log(`Successfully generated image with ${model}, blob size:`, imageBlob.size);
        
        if (imageBlob.size > 0) {
          const arrayBuffer = await imageBlob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString('base64');
          const dataUrl = `data:image/png;base64,${base64}`;
          
          console.log("Image data URL created successfully");
          return { url: dataUrl };
        }
      } else {
        const errorText = await response.text();
        console.log(`Error from ${model}:`, errorText);
        
        // If model is loading, wait and retry
        if (errorText.includes('loading')) {
          console.log(`Model ${model} is loading, waiting 20 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 20000));
          
          // Retry once after waiting
          const retryResponse = await fetch(
            `https://api-inference.huggingface.co/models/${model}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify({
                inputs: description,
                parameters: {
                  negative_prompt: "blurry, bad quality, distorted, deformed, ugly, text, watermark, logo, words, letters, writing, eco generated, eco-generated, watermarks, signatures, labels, badges, stamps, overlay text, corner text, harsh lighting, dark themes, horror, scary, violent",
                  num_inference_steps: 30
                }
              }),
            }
          );

          if (retryResponse.ok) {
            const imageBlob = await retryResponse.blob();
            if (imageBlob.size > 0) {
              const arrayBuffer = await imageBlob.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString('base64');
              return { url: `data:image/png;base64,${base64}` };
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error with model ${model}:`, error);
      continue;
    }
  }

  console.log("All models failed - Hugging Face account needs PRO subscription");
  // Generate informative SVG about upgrade requirement
  const svgImage = generateUpgradeRequiredImage(description);
  return { url: svgImage };
}

// Generate an informative SVG about upgrade requirement
function generateUpgradeRequiredImage(description: string): string {
  const svg = `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff1493;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e91e63;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d946ef;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="text" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffcce5;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#bg)"/>
      <circle cx="512" cy="300" r="80" fill="rgba(255,255,255,0.2)"/>
      <circle cx="300" cy="500" r="40" fill="rgba(255,255,255,0.15)"/>
      <circle cx="700" cy="600" r="60" fill="rgba(255,255,255,0.1)"/>
      <text x="512" y="400" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="url(#text)" text-anchor="middle">Upgrade Needed</text>
      <text x="512" y="460" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.9)" text-anchor="middle">Hugging Face PRO Required</text>
      <text x="512" y="520" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.8)" text-anchor="middle">for Stable Diffusion 3.5 Large</text>
      <text x="512" y="650" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">💖 Upgrade at huggingface.co/pricing 💖</text>
    </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Generate a descriptive SVG when AI services are unavailable (backup function)
function generateDescriptiveImage(description: string): string {
  const colors = ['#ff69b4', '#00ffff', '#ff00ff', '#32cd32', '#ffd700'];
  const bgColor = colors[Math.floor(Math.random() * colors.length)];
  const textColor = '#ffffff';
  
  // Extract key words from description for visual elements
  const words = description.toLowerCase().split(' ').slice(0, 3);
  const displayText = words.join(' ');
  
  const svg = `
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000080;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="1024" height="1024" fill="url(#bg)"/>
      
      <!-- Decorative elements -->
      <circle cx="200" cy="200" r="50" fill="${colors[1]}" opacity="0.6"/>
      <circle cx="800" cy="300" r="30" fill="${colors[2]}" opacity="0.8"/>
      <circle cx="600" cy="700" r="40" fill="${colors[3]}" opacity="0.7"/>
      
      <!-- Main text -->
      <text x="512" y="400" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
            fill="${textColor}" text-anchor="middle" filter="url(#glow)">AI Generated</text>
      <text x="512" y="500" font-family="Arial, sans-serif" font-size="32" 
            fill="${textColor}" text-anchor="middle" opacity="0.9">${displayText}</text>
      <text x="512" y="600" font-family="Arial, sans-serif" font-size="24" 
            fill="${colors[0]}" text-anchor="middle">✨ Sustainable Creation ✨</text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}