// screens/ChatSupportScreen.tsx
import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatMessage, {Message} from '../components/Chat/ChatMessage';
import QuickReplyButton from '../components/Chat/QuickReplyButton';
import ChatInput from '../components/Chat/ChatInput';
import {mockChatMessages, quickReplies} from '../components/Chat/mockChatData';
import HeaderWithNoIcons from '../components/Profile/HeaderWithNoIcons';

const ChatSupportScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [messages, setMessages] = useState<Message[]>(mockChatMessages);
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    setShowQuickReplies(false);

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message. Our support team is reviewing your request and will respond shortly.',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text: reply,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setShowQuickReplies(false);

    // Simulate support response based on quick reply
    setTimeout(() => {
      let responseText = '';
      if (reply.includes('Track')) {
        responseText = 'Please share your Order ID so I can help you track your order.';
      } else if (reply.includes('Cancel')) {
        responseText = 'I can help you cancel your order. Please provide your Order ID.';
      } else if (reply.includes('Payment')) {
        responseText = 'I understand you have a payment issue. Could you please describe the problem?';
      } else if (reply.includes('Update')) {
        responseText = 'Sure! I can help you update your address. Please share your new address details.';
      }

      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, supportResponse]);
    }, 1000);
  };

  const renderMessage = ({item}: {item: Message}) => (
    <ChatMessage message={item} />
  );

  const renderHeader = () => (
    <>
      {/* Greeting Message */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          Hi👋 How can I help you today?
        </Text>
      </View>

      {/* Quick Replies */}
      {showQuickReplies && (
        <View style={styles.quickRepliesContainer}>
          {quickReplies.map((reply, index) => (
            <QuickReplyButton
              key={index}
              title={reply}
              onPress={() => handleQuickReply(reply)}
            />
          ))}
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <HeaderWithNoIcons title="Chat Support" onBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={renderHeader}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />

        {/* Input */}
        <ChatInput
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
  },
  greetingContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },
  quickRepliesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});

export default ChatSupportScreen;
