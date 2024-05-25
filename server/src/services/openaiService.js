const { OpenAI } = require('openai');
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


async function generateSingleResponse(model, prompt) {
  try {
    if (!model || !prompt) {
      throw new Error('Model and prompt are required');
    }
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'system', content: "You are Devabot ✨, a funny helpful assistant." }, 
      { role: 'user', content: prompt }],
    });
    return response;
  } catch (error) {
    console.error(`Error generating single response: ${error.message}`);
    throw error;
  }
}

async function generateBatchResponses(model, prompts) {
  try {
    if (!model || !Array.isArray(prompts) || !prompts.length) {
      throw new Error('Model and prompts array are required');
    }
    // TODO: Based on the documentation.
  } catch (error) {
    console.error(`Error generating batch responses: ${error.message}`);
    throw error;
  }
}

async function streamResponse(model, prompt, res) {
  try {
    if (!model || !prompt) {
      throw new Error('Model and prompt are required');
    }
    const response = await openai.createCompletion({
      model,
      prompt,
      max_tokens: 150,
      stream: true,
    }, { responseType: 'stream' });

    response.data.pipe(res);
  } catch (error) {
    console.error(`Error streaming response: ${error.message}`);
    throw error;
  }
}

module.exports = {
  generateSingleResponse,
  generateBatchResponses,
  streamResponse,
};
