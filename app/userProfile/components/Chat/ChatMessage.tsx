// components/chat/ChatMessage.tsx
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

interface Props {
  message: Message;
}

const ChatMessage: React.FC<Props> = ({message}) => {
  const isUser = message.sender === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.supportContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.supportBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.supportText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  supportContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#C7D9FF',
    borderBottomRightRadius: 4,
  },
  supportBubble: {
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#000',
  },
  supportText: {
    color: '#000',
  },
});

export default ChatMessage;
