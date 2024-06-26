const { OpenAI } = require('openai');
const dotenv = require("dotenv");
const { v4: uuidv4 } = require('uuid');
const clients = require('../utils/connection');
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY

// Weather function
async function get_weather(locationString) {
  if (!locationString) {
    console.log("No location provided.");
    return;
  }

  try {
    location = JSON.parse(locationString).location;
  } catch (error) {
    console.log("Invalid location format:", error);
    return;
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
  } catch (error) {
    console.log("Error obtaining data:", error);
    throw error;
  }
}

// Create Assistant
async function createAssistant() {
  try {
    const myAssistant = await openai.beta.assistants.create({
      instructions: "You tell the requested weather conditions at a specified location.",
      model: "gpt-4o",
      tools: [
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "Get weather for the specified location.",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city and state, e.g., San Francisco, CA"
                }
              },
              required: ["location"]
            }
          }
        }
      ]
    });
    return myAssistant;
  } catch (error) {
    console.error("Error creating assistant:", error.response ? error.response.data : error);
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
async function addToThread(thread, message) {
  try {
    const newThread = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    return newThread;
  } catch (error) {
    console.error("Error adding to thread:", error);
    throw error;
  }
}

// Create a run
async function createRun(thread, assistant) {
  try {
    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id
    });
    return run;
  } catch (error) {
    console.error("Error creating run: ", error);
    throw error;
  }
}

// Handles required_action run status
async function handleRequiredAction(run, thread) {
  if (
    run.required_action &&
    run.required_action.submit_tool_outputs &&
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    const toolOutputs = await Promise.all(
      run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
        if (tool.function.name === "get_weather") {
          const location = tool.function.arguments;
          console.log("Location requested:", location);
          const weatherInfo = await get_weather(location);
          console.log("Weather info:", weatherInfo);

          // Convert weatherInfo to a string before returning
          return {
            tool_call_id: tool.id,
            output: JSON.stringify(weatherInfo)
          };
        }
      })
    );

    console.log("Tool outputs:", toolOutputs);

    if (toolOutputs.length > 0) {
      run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: toolOutputs }
      );
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
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

// Retrieve and return the first assistant message
async function getAssistantMessage(thread) {
  try {
    const threadMessages = await openai.beta.threads.messages.list(thread.id);

    for (const message of threadMessages.data) {
      if (message.role === 'assistant') {
        return message.content[0].text.value;
      }
    }
  } catch (error) {
    console.error("Error retrieving assistant message:", error);
    throw error;
  }
}

// Creates an assistant and thread if user doesn't have one. Saves in clients map. 
async function create_user() {
  const sessionId = uuidv4();

  const user = {
    assistant: await createAssistant(),
    thread: await createThread()
  };

  // Save user to clients map with sessionID as the key
  clients.set(sessionId, user);
  return sessionId;
}

// Previous thread deleted, new thread added. 
async function removeThread(sessionId) {
  try {
    const user = await clients.get(sessionId);
    const { assistant, thread } = user;

    clients.beta.threads.delete(thread.id);
    const newThread = await createThread();

    user = {
      assistant: assistant,
      thread: newThread
    }

    clients.set(sessionId, user);
  } catch (error) {
    console.error("Error removing thread: ", error);
    throw error;
  }
}

// Send message, user is JSON object.
async function sendMessage(sessionId, message) {
  try {

    const user = clients.get(sessionId);

    const { assistant, thread } = user;

    // Add message to the thread
    await addToThread(thread, message);

    // Create a run
    const run = await createRun(thread, assistant);

    // Handle run status
    await handleRunStatus(run, thread);

    // Get assistant message.
    const assistant_message = await getAssistantMessage(thread);

    const data = [assistant_message, thread];
    // Return the updated user object with the new assistant and thread
    return data;

  await displayMessages(thread.id);

} catch (error) {
  console.error("Error sending message:", error);
  throw error;
  }
}

module.exports = {
  sendMessage,
  create_user,
};
