// components/chat/ChatInput.tsx
import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  placeholder?: string;
}

const ChatInput: React.FC<Props> = ({
  value,
  onChangeText,
  onSend,
  placeholder = 'Type your message...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={onSend}
          disabled={!value.trim()}
          activeOpacity={0.7}>
          <Ionicons
            name="send"
            size={20}
            color={value.trim() ? '#4A90E2' : '#CCC'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F8F8',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    maxHeight: 100,
    paddingVertical: 6,
  },
  sendButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default ChatInput;
