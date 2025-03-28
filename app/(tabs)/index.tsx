import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { GiftedChat } from 'react-native-gifted-chat';

const HF_API_TOKEN = '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'; 
// const MODEL = 'microsoft/DialoGPT-medium'; 
const MODEL = 'google/flan-t5-large'; 

const index = () => {

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<any>(null);
  
  useEffect(()=>{
    // for scolling to the bottom of the page when a message comes
    containerRef?.current?.scrollToEnd({ animated: true });
  }, [messages])

  const sendMessage = async (newMessages:any = []) => {
    const userMessage = {
      _id: Date.now().toString(),
      text: newMessages[0]?.text || input, // Use input if called directly
      createdAt: new Date(),
      user: { _id: 1 },
    };
  
    if (!userMessage.text.trim()) return;
  
    setMessages((prev) => GiftedChat.append(prev, [userMessage])); // Use GiftedChat.append
    setInput(''); // If you keep input state
    setLoading(true);
  
    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${MODEL}`,
        { inputs: userMessage.text },
        {
          headers: {
            Authorization: `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const botText = response.data[0]?.generated_text || 'No response';
      const botMessage = {
        _id: (Date.now() + 1).toString(),
        text: botText,
        createdAt: new Date(),
        user: { _id: 2, name: 'bot' },
      };
  
      setMessages((prev) => GiftedChat.append(prev, [botMessage]));
    } catch (error) {
      console.error('API Error:', error);
      const botMessage = {
        _id: (Date.now() + 2).toString(),
        text: 'Failed to get response from Hugging Face',
        createdAt: new Date(),
        user: { _id: 2, name: 'bot' },
      };
      setMessages((prev) => GiftedChat.append(prev, [botMessage]));
    } finally {
      setLoading(false);
    }
  };

  // for initially greeting the user
  useEffect(() => {
    const botText = `Thankyou for providing your information, How can i assist you today? `;
    const botMessage = {
      _id: (Date.now() + 1).toString(),
      text: botText,
      createdAt: new Date(), // Required by GiftedChat
      user: { _id: 2, name: 'bot' }, // Required by GiftedChat
    };
    setMessages([botMessage]);
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={sendMessage}
        user={{ _id: 1 }}
        listViewProps={{
          ref: containerRef,
          contentContainerStyle: styles.chatContainer,
        }}
        placeholder="Type your message..."
        isTyping={loading}
        textInputProps={{
          editable: !loading,
          style: styles.input,
        }}
        renderSend={(props:any) => (
          <TouchableOpacity
            onPress={() => {
              if (!loading) props.onSend({ text: props.text.trim() }, true);
            }}
            style={styles.sendButton}
            disabled={loading}
          >
            <Text style={{ color: '#fff' }}>{loading ? '...' : 'Send'}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  chatContainer: {
    padding: 10,
    flexGrow: 1,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    maxWidth: '75%',
    borderRadius: 10,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 20,
    justifyContent: 'center',
  },
});

export default index;