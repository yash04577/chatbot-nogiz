import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

const HF_API_TOKEN = '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'; 
// const MODEL = 'microsoft/DialoGPT-medium'; 
const MODEL = 'google/flan-t5-large'; 

const ChatbotScreen = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<any>(null);
  
  useEffect(()=>{
    // for scolling to the bottom of the page when a message comes
    containerRef?.current?.scrollToEnd({ animated: true });
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), text: input, from: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${MODEL}`,
        { inputs: input },
        {
          headers: {
            Authorization: `Bearer ${HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const botText = response.data[0]?.generated_text || '🤖 No response';
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        from: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('API Error:', error);
      const botMessage = {
        id: (Date.now() + 2).toString(),
        text: 'Failed to get response from Hugging Face',
        from: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  // for initially greeting the user
  useEffect(()=>{
    const botText = `Thankyou for providing your information, How can i assist you today? `;
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botText,
        from: 'bot',
      };
      setMessages([botMessage])
  },[])

  const renderItem = ({ item }: { item: { id: string; text: string; from: 'user' | 'bot' } }) => (
    <View
      style={[
        styles.messageBubble,
        item.from === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={containerRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
          editable={!loading}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={loading}>
          <Text style={{ color: '#fff' }}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;

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
