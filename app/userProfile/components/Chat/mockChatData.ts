// data/mockChatData.ts

import {Message} from '../components/chat/ChatMessage';

export const mockChatMessages: Message[] = [
  {
    id: '1',
    text: 'Hello! Welcome to TrendRush support. How can I assist you today?',
    sender: 'support',
    timestamp: new Date(Date.now() - 300000),
  },
];

export const quickReplies = [
  'Track my order',
  'Cancel my order',
  'Payment issue',
  'Update address',
];

export const sampleConversation: Message[] = [
  {
    id: '1',
    text: 'Hello! Welcome to TrendRush support. How can I assist you today?',
    sender: 'support',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: '2',
    text: 'Track my order',
    sender: 'user',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    text: 'Please share your Order ID',
    sender: 'support',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '4',
    text: '123456789990',
    sender: 'user',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '5',
    text: 'Thank you! Your order is currently out for delivery and will reach you by 6 PM today.',
    sender: 'support',
    timestamp: new Date(Date.now() - 60000),
  },
];
