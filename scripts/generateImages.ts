import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { characters } from '../src/services/aiService';

// Load environment variables
dotenv.config();

const STABILITY_API_KEY = process.env.REACT_APP_IMAGE_GEN_API_KEY;
const STABILITY_API_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

async function generateCharacterImage(character: { name: string; personality: string; background: string }): Promise<Buffer> {
  let characterSpecificPrompt = '';
  
  // 为每个角色定制独特的提示词
  switch (character.name) {
    case '林小美':
      characterSpecificPrompt = `A gentle and elegant high school girl with long, straight black hair reaching her waist, wearing a traditional Japanese school uniform. 
      She has a soft, warm smile and gentle brown eyes. Her appearance is delicate and feminine, with fair skin and a slender figure.
      She's standing in a traditional Japanese garden with cherry blossoms, creating a peaceful and romantic atmosphere.
      The composition should be wide and horizontal, showing the full figure of the character with the garden in the background.`;
      break;
    case '苏雨晴':
      characterSpecificPrompt = `A cheerful and energetic high school girl with shoulder-length wavy brown hair, wearing a modern Japanese school uniform with a red ribbon.
      She has bright, sparkling eyes and a radiant smile. Her appearance is fresh and lively, with a healthy complexion and an athletic build.
      She's in a bright, sunny school courtyard with blooming flowers, creating a vibrant and energetic atmosphere.
      The composition should be wide and horizontal, showing the character in a dynamic pose with the school courtyard in the background.`;
      break;
    case '陈晓晓':
      characterSpecificPrompt = `A sophisticated and intelligent high school girl with long, wavy black hair with subtle purple highlights, wearing a stylish school uniform.
      She has sharp, intelligent eyes behind elegant glasses and a confident smile. Her appearance is mature and refined, with a graceful posture.
      She's in a modern library with floor-to-ceiling windows, creating an intellectual and elegant atmosphere.
      The composition should be wide and horizontal, showing the character standing by the library windows with bookshelves in the background.`;
      break;
    case '小美':
      characterSpecificPrompt = `A cute and innocent high school girl with short, bob-cut black hair with bangs, wearing a cute school uniform with a pink ribbon.
      She has large, round eyes and a sweet, shy smile. Her appearance is adorable and youthful, with a petite figure.
      She's in a cozy classroom with warm sunlight streaming through windows, creating a sweet and innocent atmosphere.
      The composition should be wide and horizontal, showing the character sitting at a desk with the classroom in the background.`;
      break;
    case '小静':
      characterSpecificPrompt = `A quiet and artistic high school girl with long, straight silver hair, wearing a simple school uniform.
      She has dreamy, distant eyes and a gentle, contemplative expression. Her appearance is ethereal and mysterious, with a slender figure.
      She's in an art room with paintings and sculptures, creating a peaceful and artistic atmosphere.
      The composition should be wide and horizontal, showing the character standing in front of an easel with artwork in the background.`;
      break;
    case '小莉':
      characterSpecificPrompt = `A sporty and outgoing high school girl with short, spiky brown hair, wearing a sporty school uniform.
      She has bright, energetic eyes and a wide, friendly smile. Her appearance is athletic and healthy, with a toned figure.
      She's in a school sports field with a clear blue sky, creating an energetic and dynamic atmosphere.
      The composition should be wide and horizontal, showing the character in an athletic pose with the sports field in the background.`;
      break;
    case '美咲':
      characterSpecificPrompt = `A glamorous and fashionable high school girl with long, blonde hair with pink highlights, wearing a trendy school uniform.
      She has sparkling blue eyes and a confident, charming smile. Her appearance is stylish and modern, with a perfect figure.
      She's in a trendy shopping district with neon lights, creating a fashionable and glamorous atmosphere.
      The composition should be wide and horizontal, showing the character walking in the shopping district with neon signs in the background.`;
      break;
    case '小萌':
      characterSpecificPrompt = `A sweet and gentle high school girl with long, curly pink hair, wearing a cute school uniform with frills.
      She has soft, kind eyes and a warm, caring smile. Her appearance is soft and feminine, with a gentle figure.
      She's in a flower garden with butterflies, creating a sweet and romantic atmosphere.
      The composition should be wide and horizontal, showing the character standing among flowers with butterflies in the background.`;
      break;
    case '小月':
      characterSpecificPrompt = `A mysterious and elegant high school girl with long, straight white hair, wearing a traditional school uniform.
      She has deep, mysterious purple eyes and a subtle, enigmatic smile. Her appearance is ethereal and otherworldly, with a graceful figure.
      She's in a moonlit garden with glowing flowers, creating a mysterious and magical atmosphere.
      The composition should be wide and horizontal, showing the character standing in the moonlit garden with glowing flowers in the background.`;
      break;
    default:
      characterSpecificPrompt = `A beautiful and charming high school girl with long, flowing hair, wearing a Japanese school uniform.
      The composition should be wide and horizontal, showing the full figure of the character with a suitable background.`;
  }

  const imagePrompt = `${characterSpecificPrompt}
  The character is ${character.background}.
  The character's personality is: ${character.personality}
  The image should be in a soft, romantic style with warm lighting, suitable for a visual novel.
  The character should look like a dream girl that high school boys would fall in love with.
  The image should emphasize the character's unique charm and feminine beauty.
  The overall style should be similar to popular visual novels, with high-quality anime art style.`;

  try {
    const response = await fetch(STABILITY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STABILITY_API_KEY}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: imagePrompt,
            weight: 1
          },
          {
            text: "blurry, low quality, distorted, ugly, deformed, realistic, photograph, 3d render, western style, comic style, manga style, dark, gloomy, scary, violent, adult content, nsfw, muscular, masculine, boy, man, male, unattractive, plain, boring, old, mature, professional, business, formal, casual, sporty, tomboy, short hair, masculine features, rough, tough, aggressive, intimidating, generic, common, average, typical, standard, normal, ordinary, regular, usual, basic, simple, plain, boring, dull, uninteresting, unremarkable, undistinguished, unexceptional, unimpressive, uninspired, unoriginal, unremarkable, unspectacular, unexceptional, unimpressive, uninspired, unoriginal, unremarkable, unspectacular, portrait, close-up, headshot, vertical composition, tall, narrow",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 768,
        width: 1024,
        samples: 1,
        steps: 30,
      }),
    });

    if (!response.ok) {
      throw new Error('API请求失败');
    }

    const data = await response.json();
    if (data.artifacts && data.artifacts[0]) {
      return Buffer.from(data.artifacts[0].base64, 'base64');
    }
    throw new Error('No image generated');
  } catch (error) {
    console.error(`Error generating image for ${character.name}:`, error);
    throw error;
  }
}

async function main() {
  // 确保输出目录存在
  const outputDir = path.join(__dirname, '../public/characters');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 生成每个角色的图片
  for (const character of characters) {
    try {
      console.log(`Generating image for ${character.name}...`);
      const imageBuffer = await generateCharacterImage(character);
      
      // 保存图片
      const fileName = character.name.toLowerCase().replace(/\s+/g, '') + '.png';
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, imageBuffer);
      
      console.log(`Image generated for ${character.name}: ${filePath}`);
    } catch (error) {
      console.error(`Failed to generate image for ${character.name}:`, error);
    }
  }

  // 生成默认图片
  try {
    console.log('Generating default character image...');
    const defaultCharacter = {
      name: "Default",
      personality: "温柔善良，充满活力",
      background: "高中学生"
    };
    const imageBuffer = await generateCharacterImage(defaultCharacter);
    fs.writeFileSync(path.join(outputDir, 'default-character.png'), imageBuffer);
    console.log('Default character image generated');
  } catch (error) {
    console.error('Failed to generate default character image:', error);
  }
}

main().catch(console.error); 