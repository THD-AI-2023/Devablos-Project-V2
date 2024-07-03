const { sendMessage, create_user, removeThread } = require('../services/assistantService');

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
              sessionID: { type: 'string' },
              prompt: {
                type: 'string',
                example: 'Tell me the chances of raining in Deggendorf, Germany.'
              }
            },
            required: ['assistant', 'thread', 'prompt']
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
    const { sessionID, prompt } = req.body;
    console.log(sessionID, prompt);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (!sessionID) {
      return res.status(400).json({ error: "SessionID required" });
    }

    const response = await sendMessage(sessionID, prompt);
    console.log(response);
    res.json(response);
  } catch (error) {
    next(error);
  }
}

async function create_userHandler(req, res, next) {
  /*
    #swagger.tags = ['GPT Assistants']
    #swagger.summary = 'Creates assistant and thread for user if it doesn\'t exist.'
    #swagger.description = 'This endpoint creates assistant and thread for user.'

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
    const user = await create_user();
    res.json(user);
    
  } catch (error) {
    next(error);
  }
}

async function removeThreadHandler(req, res, next) {
  /*
    #swagger.tags = ['GPT Assistants']
    #swagger.summary = 'Deletes user thread.'
    #swagger.description = 'This endpoint deletes user thread (history).'
    
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              sessionID: { type: 'string' },
            },
            required: ['sessionID']
          }
        }
      }
    }

    #swagger.responses[200] = { 
      description: 'Successful deletion', 
    }

    #swagger.responses[500] = { description: 'Server error' }
  */
  
    try {
      const sessionID = req.body;

      if (!sessionID) {
        return res.status(400).json({ error: "SessionID is required" });
      }

      await removeThread(sessionID);
      
    } catch (error) {
      next(error);
    }
}


module.exports = {
  sendMessageHandler,
  create_userHandler,
  removeThreadHandler,
};
