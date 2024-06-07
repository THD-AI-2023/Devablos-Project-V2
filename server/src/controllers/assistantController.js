const {
  sendMessage
} = require('../services/assistantService');

async function sendMessageHandler(req, res, next) {
  /*
    #swagger.tags = ['GPT Assistance']
    #swagger.summary = 'Sends message to GPT Assistant.'
    #swagger.description = 'This endpoint sends a message.'
    #swagger.responses[500] = { description: 'Server error' }
  */
  try {
    const response = await sendMessage();
    res.json(response);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendMessageHandler
}
