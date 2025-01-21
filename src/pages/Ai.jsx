import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '', 
  dangerouslyAllowBrowser: true
});

const assistantId = 'asst_x2BJxIK5XMXDTWnzMTxc9yYa';
const fileId = 'file-589EiK1EkuQUg2EqKzbopg';
const vectorStoreId = 'vs_FIxs3Eaih22sO1PTGdc94dTd';

const Ai = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    setLoading(true);
    setResponse('');

    try {
      // Send message to assistant
      const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            {
              role: 'user',
              content: message,
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

      for await (const threadMessage of run) {
        if (threadMessage.event === 'thread.run.failed') {
          console.error('Thread failed to run:', threadMessage);
          setResponse('Error: Unable to process the message.');
          setLoading(false);
          return;
        }

        if (threadMessage.event === 'thread.run.completed') {
          const messages = await openai.beta.threads.messages.list(
            threadMessage.data.thread_id,
            {
              run_id: threadMessage.data.id,
            }
          );

          for (const msg of messages.data) {
            const content = msg.content;
            if (Array.isArray(content) && content.length > 0) {
              const assistantMessage = content[0]?.text?.value || 'No text content found';
              setResponse(assistantMessage);
            } else {
              setResponse('No content available in the message.');
            }
          }
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setResponse('Error: Unable to process the message.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Assistant Chat</h1>
      <textarea
        rows="4"
        cols="50"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <br />
      <button onClick={sendMessage} disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          response && <p><strong>Assistant Response:</strong> {response}</p>
        )}
      </div>
    </div>
  );
};

export default Ai;
