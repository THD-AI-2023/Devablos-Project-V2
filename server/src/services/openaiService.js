const { OpenAI } = require('openai');
const dotenv = require("dotenv");
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

async function retrieveModels() {
  try {
    const response = await openai.models.list();
    return response;
  } catch (error) {
    console.error(`Error retrieving models: ${error.message}`);
    throw error;
  }
}

async function generateSingleResponse(model, prompt) {
  try {
    if (!model || !prompt) {
      throw new Error('Model and prompt are required');
    }
    const response = await openai.completions.create({
      model: model,
      prompt: prompt,
    });
    return response;
  } catch (error) {
    console.error(`Error generating single response: ${error.message}`);
    throw error;
  }
}

async function generateChatResponses(model, messages) {
  try {
    if (!model || !Array.isArray(messages) || !messages.length) {
      throw new Error('Model and messages array are required');
    }
    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
    });
    return response;
  } catch (error) {
    console.error(`Error generating chat responses: ${error.message}`);
    throw error;
  }
}

async function createBatch(inputFileId, endpoint) {
  try {
    const response = await openai.batches.create({
      input_file_id: inputFileId,
      endpoint,
      completion_window: '24h'
    });
    return response;
  } catch (error) {
    console.error(`Error creating batch: ${error.message}`);
    throw error;
  }
}

async function retrieveBatch(batchId) {
  try {
    const response = await openai.batches.retrieve(batchId);
    return response;
  } catch (error) {
    console.error(`Error retrieving batch: ${error.message}`);
    throw error;
  }
}

async function cancelBatch(batchId) {
  try {
    const response = await openai.batches.cancel(batchId);
    return response;
  } catch (error) {
    console.error(`Error canceling batch: ${error.message}`);
    throw error;
  }
}

async function listBatches(limit = 20, after = null) {
  try {
    const params = { limit };
    if (after) params.after = after;
    const response = await openai.batches.list(params);
    return response;
  } catch (error) {
    console.error(`Error listing batches: ${error.message}`);
    throw error;
  }
}

async function streamResponse(model, prompt, res) {
  try {
    if (!model || !prompt) {
      throw new Error('Model and prompt are required');
    }
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    for await (const chunk of response) {
      if (chunk.choices[0].delta.content) {
        res.write(chunk.choices[0].delta.content);
      }
    }
    res.end();
  } catch (error) {
    console.error(`Error streaming response: ${error.message}`);
    res.write(`Error: ${error.message}`);
    res.end();
    throw error;
  }
}

module.exports = {
  retrieveModels,
  generateSingleResponse,
  generateChatResponses,
  createBatch,
  retrieveBatch,
  cancelBatch,
  listBatches,
  streamResponse,
};
