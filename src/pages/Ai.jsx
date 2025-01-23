import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});


const assistantId = 'asst_FmJSWXe6z9lLsJdPVbCKtH1a';
const fileId = 'file-JfBdqCXepeQXAnT1PCXpcc';
const vectorStoreId = 'vs_eTMj7U2Oxeico30vqTG1NBIo';

const Ai = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    setLoading(true);
    setResponse('');

    try {
      const run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
          messages: [
            {
              role: 'user',
              content: message,
              attachments: [{ file_id: fileId, tools: [{ type: 'file_search' }] }],
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
            { run_id: threadMessage.data.id }
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
    <section style={styles.container}>
      <h1 style={styles.header}>Assisterad Rekrytering</h1>

      <div style={styles.form}>
        <textarea
          style={styles.textarea}
          rows="4"
          cols="50"
          placeholder="Skriv ditt meddelande här..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <br />
        <button onClick={sendMessage} disabled={loading} style={loading ? styles.loadingButton : styles.button}>
          {loading ? 'Sending...' : 'Skicka Meddelande'}
        </button>
      </div>

      {response && (
        <div style={styles.responseBox}>
          {loading ? (
            <p style={styles.loadingText}>Laddar...</p>
          ) : (
            <p><strong>AI:</strong> {response}</p>
          )}
        </div>
      )}
    </section>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    boxSizing: 'border-box',
  },
  header: {
    textAlign: 'center',
    fontSize: '32px',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'none',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#047364',
    color: 'white',
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loadingButton: {
    backgroundColor: '#ddd',
    cursor: 'not-allowed',
  },
  responseBox: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    marginBottom: '30px'
  },
  loadingText: {
    fontSize: '18px',
    color: '#666',
  },
};

export default Ai;
