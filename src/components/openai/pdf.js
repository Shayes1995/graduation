/* import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';  // For resolving relative file paths

const openai = new OpenAI({
  apiKey: '', // Replace with your actual API key
});

// Main function to create assistant and upload files
async function main() {
  try {
    // Step 1: Create the assistant
    const assistant = await openai.beta.assistants.create({
      name: "Financial Analyst Assistant",
      instructions: "You are an expert financial analyst. Use your knowledge base to answer questions about audited financial statements.",
      model: "gpt-4o-mini", // Use a valid model like "gpt-3.5-turbo"
      tools: [{ type: "file_search" }],
    });

    console.log("Assistant created successfully:", assistant.id);

    // File paths - Ensure these are correct paths to your files
    const filePaths = ["src/components/openai/kevin.pdf", "src/components/openai/kevin.pdf"]; // Duplicate the file path
    
    // Resolving file paths
    const fileStreams = filePaths.map((filePath) => {
      const absolutePath = path.resolve(filePath); // Resolving the relative path
      console.log("Resolved file path:", absolutePath); // Log the resolved path for debugging

      // Check if the file exists before creating a stream
      if (!fs.existsSync(absolutePath)) {
        console.error("File does not exist:", absolutePath); // If file doesn't exist, log an error
        return null; // Return null to indicate the file wasn't found
      }

      return fs.createReadStream(absolutePath);
    }).filter(stream => stream !== null); // Filter out any null values in case a file doesn't exist

    if (fileStreams.length === 0) {
      console.error("No valid files to upload. Exiting process.");
      return;
    }

    // Step 2: Upload files to OpenAI API
    const uploadedFiles = [];
    for (const fileStream of fileStreams) {
      const file = await openai.files.create({
        file: fileStream,
        purpose: 'assistants', // Purpose for the assistant
      });
      uploadedFiles.push(file.id); // Collect file ids for later use
      console.log(`Uploaded file ID: ${file.id}`);
    }

    // Step 3: Create a vector store for the files
    const vectorStore = await openai.beta.vectorStores.create({
      name: "Financial Statement",
      file_ids: uploadedFiles, // Pass the file IDs here
    });

    console.log("Vector store created successfully:", vectorStore.id);

    // Step 4: Update the assistant with the vector store
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: {
        file_search: { vector_store_ids: [vectorStore.id] },
      },
    });

    console.log("Assistant setup complete!");

    // Step 5: Create a thread and run it with a message
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistant.id, // Using the assistant's ID
      tools: [{ type: "file_search" }],
      thread: {
        messages: [
          {
            role: "user",
            content: "What is Kevin's financial status according to the latest report?", // The user query
          },
        ],
        tool_resources: {
          "file_search": {
            "vector_store_ids": [vectorStore.id]
          }
        }
      },
    });

    console.log("Thread created and run:", run);

    // Verify the thread_id is correct and it's a string
    let threadId = run.thread_id;
    console.log(`Thread ID: ${threadId}`); // Log the thread_id to ensure it's a string
    threadId = String(threadId); // Ensure the thread_id is a string

    // The response retrieval code has been removed

  } catch (error) {
    console.error("Error during assistant setup or thread run:", error);
  }
}

main();
 */