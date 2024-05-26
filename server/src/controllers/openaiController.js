const { generateSingleResponse, generateChatResponses, generateBatchResponses, streamResponse } = require('../services/openaiService');
const defaultModel = 'gpt-4o';

async function singleResponseHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI']
    #swagger.summary = 'Generate a single response from a specified model'
    #swagger.description = 'This endpoint generates a single response from the specified OpenAI model.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              model: { type: 'string', example: 'gpt-3.5-turbo' },
              prompt: { type: 'string', example: 'Your prompt here' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'A single generated response',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              object: { type: 'string' },
              created: { type: 'integer' },
              model: { type: 'string' },
              choices: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    index: { type: 'integer' },
                    logprobs: { type: 'object' },
                    finish_reason: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { model = defaultModel, prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const response = await generateSingleResponse(model, prompt);
    res.json(response);
  } catch (error) {
    return next(error);
  }
}

async function chatResponseHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI']
    #swagger.summary = 'Generate chat responses from a specified model'
    #swagger.description = 'This endpoint generates chat responses from the specified OpenAI model.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              model: { type: 'string', example: 'gpt-3.5-turbo' },
              messages: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    role: { type: 'string', example: 'system' },
                    content: { type: 'string', example: 'I am a helpful assistant.' },
                    role: { type: 'string', example: 'user' },
                    content: { type: 'string', example: 'Your user message here' }
                  }
                },
                example: [
                  { role: 'system', content: 'You are Devabot ✨, a funny helpful assistant.' },
                  { role: 'user', content: 'Hello there!' },
                  { role: 'assistant', content: 'General Kenobi! How can I assist you today?'}
                ]
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Chat generated responses',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              object: { type: 'string' },
              created: { type: 'integer' },
              model: { type: 'string' },
              choices: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    text: { type: 'string' },
                    index: { type: 'integer' },
                    logprobs: { type: 'object' },
                    finish_reason: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { model = defaultModel, messages } = req.body;
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'Messages array is required' });
    }
    const response = await generateChatResponses(model, messages);
    res.json(response);
  }
  catch (error) {
    return next(error);
  }
}

async function batchResponseHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI']
    #swagger.summary = 'Generate batch responses from a specified model'
    #swagger.description = 'This endpoint generates batch responses from the specified OpenAI model.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              model: { type: 'string', example: 'gpt-3.5-turbo' },
              prompts: {
                type: 'array',
                items: { type: 'string' },
                example: ["Prompt 1", "Prompt 2"]
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Batch generated responses',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                object: { type: 'string' },
                created: { type: 'integer' },
                model: { type: 'string' },
                choices: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      text: { type: 'string' },
                      index: { type: 'integer' },
                      logprobs: { type: 'object' },
                      finish_reason: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { model = defaultModel, prompts } = req.body;
    if (!Array.isArray(prompts) || !prompts.length) {
      return res.status(400).json({ error: 'Prompts array is required' });
    }
    const responses = await generateBatchResponses(model, prompts);
    res.json(responses);
  } catch (error) {
    return next(error);
  }
}

async function streamResponseHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI']
    #swagger.summary = 'Generate a streaming response from a specified model'
    #swagger.description = 'This endpoint generates a streaming response from the specified OpenAI model.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              model: { type: 'string', example: 'gpt-3.5-turbo' },
              prompt: { type: 'string', example: 'Your prompt here' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'A streaming response',
      content: { 'application/json': {} }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { model = defaultModel, prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    await streamResponse(model, prompt, res);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  singleResponseHandler,
  chatResponseHandler,
  batchResponseHandler,
  streamResponseHandler,
};
