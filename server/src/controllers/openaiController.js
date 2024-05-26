const {
  retrieveModels,
  generateSingleResponse,
  generateChatResponses,
  createBatch,
  retrieveBatch,
  cancelBatch,
  listBatches,
  streamResponse
} = require('../services/openaiService');
const defaultModel = 'gpt-4o';

async function retrieveModelsHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI']
    #swagger.summary = 'Retrieve all models'
    #swagger.description = 'This endpoint retrieves all models.'
    #swagger.responses[200] = {
      description: 'Models retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              object: { type: 'string' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    object: { type: 'string' },
                    created: { type: 'integer' },
                    owned_by: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const response = await retrieveModels();
    res.json(response);
  } catch (error) {
    next(error);
  }
}

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

async function createBatchHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI Batch']
    #swagger.summary = 'Create a new batch'
    #swagger.description = 'This endpoint creates a new batch for processing.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              inputFileId: { type: 'string', example: 'file-abc123' },
              endpoint: { type: 'string', example: '/v1/chat/completions' }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Batch created successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              object: { type: 'string' },
              endpoint: { type: 'string' },
              status: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { inputFileId, endpoint } = req.body;
    if (!inputFileId || !endpoint) {
      return res.status(400).json({ error: 'inputFileId and endpoint are required' });
    }
    const response = await createBatch(inputFileId, endpoint);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function retrieveBatchHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI Batch']
    #swagger.summary = 'Retrieve a batch by ID'
    #swagger.description = 'This endpoint retrieves a batch by its ID.'
    #swagger.parameters['batchId'] = { description: 'Batch ID' }
    #swagger.responses[200] = {
      description: 'Batch retrieved successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              object: { type: 'string' },
              endpoint: { type: 'string' },
              status: { type: 'string' },
              request_counts: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  completed: { type: 'integer' },
                  failed: { type: 'integer' }
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
    const { batchId } = req.params;
    const response = await retrieveBatch(batchId);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function cancelBatchHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI Batch']
    #swagger.summary = 'Cancel a batch by ID'
    #swagger.description = 'This endpoint cancels a batch by its ID.'
    #swagger.parameters['batchId'] = { description: 'Batch ID' }
    #swagger.responses[200] = {
      description: 'Batch canceled successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              object: { type: 'string' },
              status: { type: 'string' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { batchId } = req.params;
    const response = await cancelBatch(batchId);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function listBatchesHandler(req, res, next) {
  /*
    #swagger.tags = ['OpenAI Batch']
    #swagger.summary = 'List all batches'
    #swagger.description = 'This endpoint lists all batches.'
    #swagger.parameters['limit'] = { description: 'Number of batches to retrieve', required: false }
    #swagger.parameters['after'] = { description: 'Cursor for pagination', required: false }
    #swagger.responses[200] = {
      description: 'Batches listed successfully',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              object: { type: 'string' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    object: { type: 'string' },
                    endpoint: { type: 'string' },
                    status: { type: 'string' },
                    request_counts: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        completed: { type: 'integer' },
                        failed: { type: 'integer' }
                      }
                    }
                  }
                }
              },
              has_more: { type: 'boolean' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = { description: 'Invalid input' }
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const { limit, after } = req.query;
    const response = await listBatches(limit, after);
    res.json(response);
  } catch (error) {
    next(error);
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
    res.setHeader('Content-Type', 'text/event-stream');
    await streamResponse(model, prompt, res);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  retrieveModelsHandler,
  singleResponseHandler,
  chatResponseHandler,
  createBatchHandler,
  retrieveBatchHandler,
  cancelBatchHandler,
  listBatchesHandler,
  streamResponseHandler,
};
