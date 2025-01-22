import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
 
const openai = new OpenAI({
  apiKey: '',
});
 
async function main() {
  try {
    const assistant = await openai.beta.assistants.create({
      name: 'Financial Analyst Assistant',
      instructions: 'You are an expert recruiter. Use your knowledge base to answer questions about recruitment.',
      model: 'gpt-3.5-turbo',
      tools: [{ type: 'file_search' }],
    });
 
    console.log('Assistant created successfully:', assistant.id);
 
    // File paths
    const filePaths = ['src/components/openai/KevinDavid.pdf', 'src/components/openai/ShayanSadr.pdf', 'src/components/openai/PatrikSkantz.pdf', 'src/components/openai/MikaelLarsson.pdf', 'src/components/openai/LarsAndersson.pdf', 'src/components/openai/JohanNilsson.pdf', 'src/components/openai/JohannaSvensson.pdf', 'src/components/openai/EvelinaEnqvist.pdf', 'src/components/openai/EllenOlsson.pdf'];
 
    // Resolving file paths
    const fileStreams = filePaths.map((filePath) => {
      const absolutePath = path.resolve(filePath);
      console.log('Resolved file path:', absolutePath);
 
      if (!fs.existsSync(absolutePath)) {
        console.error('File does not exist:', absolutePath);
        return null;
      }
 
      return fs.createReadStream(absolutePath);
    }).filter((stream) => stream !== null);
 
    if (fileStreams.length === 0) {
      console.error('No valid files to upload. Exiting process.');
      return;
    }
 
    const uploadedFiles = [];
    for (const fileStream of fileStreams) {
      const file = await openai.files.create({
        file: fileStream,
        purpose: 'assistants',
      });
      uploadedFiles.push(file.id);
      console.log(`Uploaded file ID: ${file.id}`);
    }
 
    const vectorStore = await openai.beta.vectorStores.create({
      name: 'Financial Statement',
      file_ids: uploadedFiles,
    });
 
    console.log('Vector store created successfully:', vectorStore.id);
 
    await openai.beta.assistants.update(assistant.id, {
      tool_resources: {
        file_search: { vector_store_ids: [vectorStore.id] },
      },
    });
 
    console.log('Assistant setup complete!');
 
    const questions = [
      { question: 'Who is Kevin' },
      { question: 'Who is Johan' },
    ];
 
    for (let i = 0; i < questions.length; i++) {
      await fetchAnswer(
        uploadedFiles[0],
        vectorStore.id,
        questions[i].question,
        assistant
      );
    }
 
    console.log('All questions processed.');
 
  } catch (error) {
    console.error('Error during assistant setup or question processing:', error);
  }
}
 
async function fetchAnswer(fileId, vectorStoreId, question, assistant) {
  try {
    const run = await openai.beta.threads.createAndRun({
      assistant_id: assistant.id,
      thread: {
        messages: [
          {
            role: 'user',
            content: question,
            attachments: [
              { file_id: fileId, tools: [{ type: 'file_search' }] },
            ],
          },
        ],
        tool_resources: {
          file_search: {
            vector_store_ids: [vectorStoreId],
          },
        },
      },
      stream: true,
    });
 
    for await (const message of run) {
      if (message.event === 'thread.run.failed') {
        console.error('Thread failed to run:', message);
        return;
      }
 
      if (message.event === 'thread.run.completed') {
        const messages = await openai.beta.threads.messages.list(
          message.data.thread_id,
          {
            run_id: message.data.id,
          }
        );
       
        for (const msg of messages.data) {
          const content = msg.content;
 
          if (Array.isArray(content) && content.length > 0) {
            console.log('Received answer:', content[0]);
          } else {
            console.log('No content available in the message.');
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching answer for question:', question, error);
  }
}
 
main();