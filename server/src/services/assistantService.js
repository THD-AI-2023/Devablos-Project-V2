const { OpenAI } = require('openai');
const dotenv = require("dotenv");
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})


// Create Assistant
async function createAssistant() {
try {
    const myAssistant = await openai.beta.assistants.create({
    instructions: "You are the weather boy.",
    model: "gpt-4-turbo",
  });
  return myAssistant;
  
} catch (error) {
  console.error("Error creating assistant:", error);
  throw error; 
  }
}

// Create thread
async function createThread() {
try {
  const thread = await openai.beta.threads.create();
  return thread;

} catch (error) {
  console.error("Error creating thread:", error);
  throw error;
  }
}

// Add message to thread
async function addToThread(threadID, message) {
  try {
    await openai.beta.threads.messages.create(threadID, {
      role: "user",
      content: message,
    });

  } catch (error) {
    console.error("Error adding to thread:", error);
    throw error;
  }
}

// Create a run
async function createRun(threadID, assistantID) {
  try{
  const run = await openai.beta.threads.runs.create(
    threadID,
    { assistant_id: assistantID }
  );
  return run

} catch(error) {
    console.error("Error creating run: ", error)
    throw error
  }
}


// Wait for run completion
async function waitForRunCompletion(threadId, runId) {
  try{
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  while (runStatus.status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
  }
  return runStatus;

} catch(error) {
  console.error("Error waiting for run completion: ", error);
  throw error; 
  }
}


// Retrieve and display message
async function displayMessages(threadId) {
  try{
  const messages = await openai.beta.threads.messages.list(threadId);
  messages.data.forEach(msg => {
    if (msg.role === 'assistant') {
      console.log("Assistant:", msg.content[0].text.value);
    } else if (msg.role === 'function') {
      console.log("Function result:", msg.content[0].text.value);
    }
  });

} catch(error) {
  console.error("Error displaying message: ", error);
  throw error;
  }
}


// Send Message
async function sendMessage(message) {
  try {
    const assistant = await createAssistant();
    const thread = await createThread();


  await addToThread(thread.id, message);

  run = await createRun(thread.id, assistant.id);

  await waitForRunCompletion(thread.id, run.id);

  await displayMessages(thread.id);

} catch (error) {
  console.error("Error sending message:", error);
  throw error;
  }
}

module.exports = {
  sendMessage
}

