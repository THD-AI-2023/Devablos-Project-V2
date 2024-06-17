const { sendMessage } = require('../services/assistantService');

async function sendMessageHandler(req, res, next) {
  /*
    #swagger.tags = ['GPT Assistants']
    #swagger.summary = 'Sends message to GPT Assistant.'
    #swagger.description = 'This endpoint sends a message.'

    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              prompt: { type: 'string', example: 'Tell me the chances of raining in Deggendorf, Germany.' }
            }
          }
        }
      }
    }

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
    const message = req.body.prompt; // Extract message from request body
    console.log(message);
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const response = await sendMessage(message); // Pass message to sendMessage
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendMessageHandler
};
