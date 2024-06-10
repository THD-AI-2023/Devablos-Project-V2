const { OpenAI } = require('openai');
const dotenv = require("dotenv");
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Primitive weather function 
async function get_weather(location_object) {
    return "No data found at the moment. Try again later."
}


// Create Assistant
async function createAssistant() {
  try {
    console.log("Creating assistant...");
    const myAssistant = await openai.beta.assistants.create({
      instructions: "You are the weather boy. You tell the weather conditions in specified locations.",
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
                },
              },
              required: ["location"]
            }
          }
        }
      ]
    });
    console.log("Assistant created.");
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
  try {
    let run = await openai.beta.threads.runs.createAndPoll(threadID, {
      assistant_id: assistantID,
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
          return {
            tool_call_id: tool.id,
            output: weatherInfo,
          };
        }
      })
    );

    console.log("Tool outputs:", toolOutputs);

    if (toolOutputs.length > 0) {
      run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: toolOutputs },
      );
      console.log("Tool outputs submitted successfully.");
    } else {
      console.log("No tool outputs to submit.");
    }

    return handleRunStatus(run, thread);
  }
}

// Handle run status
const handleRunStatus = async (run, thread) => {
  // Check if the run is completed
  if (run.status === "completed") {
    let messages = await openai.beta.threads.messages.list(thread.id);
    console.log(messages.data);
    return messages.data;
  } else if (run.status === "requires_action") {
    console.log(run.status);
    return await handleRequiredAction(run, thread);
  } else {
    console.error("Run did not complete:", run);
  }
};

// Retrieve and display messages
async function displayMessages(thread) {
  try {
    const threadMessages = await openai.beta.threads.messages.list(thread.id);

    threadMessages.data.forEach(message => {
      if (message.role === 'user') {
        console.log(`User: ${message.content[0].text.value}`);
      } else if (message.role === 'assistant') {
        console.log(`Assistant: ${message.content[0].text.value}`);
      } else if (message.role === 'function') {
        console.log(`Function: ${message.content[0].text.value}`);
      }
    });

  } catch (error) {
    console.error("Error displaying messages:", error);
    throw error;
  }
}

// Send Message
async function sendMessage(message) {
  try {
    const assistant = await createAssistant();
    const thread = await createThread();

    await addToThread(thread.id, message);

    let run = await createRun(thread.id, assistant.id);

    await handleRunStatus(run, thread);

    await displayMessages(thread);

  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

module.exports = {
  sendMessage,
}