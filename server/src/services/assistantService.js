const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI(process.env.OPENAI_API_KEY);

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

// Send Message
async function sendMessage(message) {
  try {
    const assistant = await createAssistant();
    const thread = await createThread();


  // Add message to the thread
  await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

  // Create a run
  const run = await openai.beta.threads.runs.create(
    thread.id,
    { assistant_id: assistant.id }
  );

  // Wait for the run to complete
  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  while (runStatus.status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  const messages = await openai.beta.threads.messages.list(thread.id);
    messages.data.forEach(msg => {
      if (msg.role === 'assistant') {
      console.log("Assistant:", msg.content[0].text.value);
    } else if (msg.role === 'function') {
      console.log("Function result:", msg.content[0].text.value);
    }
  });

} catch (error) {
  console.error("Error sending message:", error);
  throw error;
}
}

sendMessage("What's the weather like in Berlin?");

module.exports = {
  sendMessage
}

