const { sendMessage } = require('../services/assistantService');

async function sendMessageHandler(req, res, next) {
  /*
    #swagger.tags = ['GPT Assistants']
    #swagger.summary = 'Sends message to GPT Assistant.'
    #swagger.description = 'This endpoint sends a message.'
    #swagger.responses[200] = { 
      description: 'Successful response', 
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
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const response = await sendMessage("What's the weather like in Berlin?");
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendMessageHandler
};