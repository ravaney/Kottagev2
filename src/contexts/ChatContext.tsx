import React, { createContext, useContext, useState, useEffect } from 'react';
import { database, auth } from '../firebase';
import { ref, push, set, onValue, update, get, query, orderByChild } from 'firebase/database';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  read: boolean;
}

interface Chat {
  id: string;
  participants: string[];
  participantNames: Record<string, string>;
  lastMessage?: string;
  lastMessageTimestamp?: number;
  propertyId?: string;
  propertyName?: string;
  unreadCount: Record<string, number>;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
  sendMessage: (text: string) => Promise<void>;
  setCurrentChat: (chat: Chat | null) => void;
  startNewChat: (userId: string, userName: string, propertyId?: string, propertyName?: string) => Promise<string>;
  markChatAsRead: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's chats
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const userChatsRef = ref(database, `userChats/${currentUser.uid}`);
    
    const unsubscribe = onValue(userChatsRef, (snapshot) => {
      const data = snapshot.val();
      const chatList: Chat[] = [];
      
      if (data) {
        Object.keys(data).forEach((chatId) => {
          const chatData = data[chatId];
          chatList.push({
            id: chatId,
            participants: chatData.participants || [],
            participantNames: chatData.participantNames || {},
            lastMessage: chatData.lastMessage,
            lastMessageTimestamp: chatData.lastMessageTimestamp,
            propertyId: chatData.propertyId,
            propertyName: chatData.propertyName,
            unreadCount: chatData.unreadCount || {}
          });
        });
      }
      
      // Sort by timestamp
      chatList.sort((a, b) => {
        if (!a.lastMessageTimestamp) return 1;
        if (!b.lastMessageTimestamp) return -1;
        return b.lastMessageTimestamp - a.lastMessageTimestamp;
      });
      
      setChats(chatList);
      setLoading(false);
    }, (error) => {
      console.error('Error loading chats:', error);
      setError('Failed to load chats');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load messages for current chat
  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    const messagesRef = ref(database, `messages/${currentChat.id}`);
    const messagesQuery = query(messagesRef, orderByChild('timestamp'));
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val();
      const messageList: Message[] = [];
      
      if (data) {
        Object.keys(data).forEach((messageId) => {
          const messageData = data[messageId];
          messageList.push({
            id: messageId,
            text: messageData.text,
            senderId: messageData.senderId,
            senderName: messageData.senderName,
            timestamp: messageData.timestamp,
            read: messageData.read || false
          });
        });
        
        // Sort messages by timestamp
        messageList.sort((a, b) => a.timestamp - b.timestamp);
      }
      
      setMessages(messageList);
      
      // Mark messages as read
      if (currentChat && auth.currentUser) {
        markChatAsRead(currentChat.id);
      }
    }, (error) => {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    });

    return () => unsubscribe();
  }, [currentChat]);

  const sendMessage = async (text: string) => {
    if (!currentChat || !auth.currentUser) return;

    try {
      const timestamp = Date.now();
      const messageData = {
        text,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'User',
        timestamp,
        read: false
      };

      // Add message to messages collection
      const messagesRef = ref(database, `messages/${currentChat.id}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, messageData);

      // Update chat metadata for all participants
      for (const participantId of currentChat.participants) {
        const userChatRef = ref(database, `userChats/${participantId}/${currentChat.id}`);
        
        // Create proper unread count object
        const newUnreadCount = { ...currentChat.unreadCount };
        
        if (participantId !== auth.currentUser?.uid) {
          newUnreadCount[participantId] = (currentChat.unreadCount?.[participantId] || 0) + 1;
        } else {
          newUnreadCount[auth.currentUser.uid] = 0;
        }
        
        const updates = {
          lastMessage: text,
          lastMessageTimestamp: timestamp,
          unreadCount: newUnreadCount
        };
        
        await update(userChatRef, updates);
        console.log(`Updated chat metadata for participant: ${participantId}`);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  const startNewChat = async (
    userId: string, 
    userName: string, 
    propertyId?: string, 
    propertyName?: string
  ): Promise<string> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    try {
      // Check if chat already exists between these users
      const userChatsRef = ref(database, `userChats/${auth.currentUser.uid}`);
      const snapshot = await get(userChatsRef);
      const data = snapshot.val() || {};
      
      // Find existing chat with this user
      let existingChatId = null;
      Object.keys(data).forEach((chatId) => {
        const chatData = data[chatId];
        if (chatData.participants && chatData.participants.includes(userId)) {
          existingChatId = chatId;
        }
      });

      if (existingChatId) {
        const existingChat = {
          id: existingChatId,
          ...data[existingChatId]
        };
        setCurrentChat(existingChat as Chat);
        return existingChatId;
      }

      // Create new chat
      const timestamp = Date.now();
      const chatId = push(ref(database, 'chats')).key;
      
      if (!chatId) throw new Error('Failed to generate chat ID');
      
      const participants = [auth.currentUser.uid, userId];
      const participantNames: Record<string, string> = {};
      participantNames[auth.currentUser.uid] = auth.currentUser.displayName || 'User';
      participantNames[userId] = userName;

      const chatData = {
        participants,
        participantNames,
        createdAt: timestamp,
        lastMessageTimestamp: timestamp,
        unreadCount: { [auth.currentUser.uid]: 0, [userId]: 0 }
      };

      if (propertyId && propertyName) {
        Object.assign(chatData, { propertyId, propertyName });
      }

      // Add chat reference to each participant
      for (const participantId of participants) {
        await set(ref(database, `userChats/${participantId}/${chatId}`), chatData);
      }
      
      const newChat = {
        id: chatId,
        participants,
        participantNames,
        propertyId,
        propertyName,
        unreadCount: { [auth.currentUser.uid]: 0, [userId]: 0 }
      };
      
      setCurrentChat(newChat);
      return chatId;
    } catch (err) {
      console.error('Error starting new chat:', err);
      setError('Failed to start new chat');
      throw err;
    }
  };

  const markChatAsRead = async (chatId: string) => {
    if (!auth.currentUser) return;

    try {
      // Get current chat data
      const userChatRef = ref(database, `userChats/${auth.currentUser.uid}/${chatId}`);
      const snapshot = await get(userChatRef);
      const chatData = snapshot.val();
      
      if (chatData && chatData.unreadCount?.[auth.currentUser.uid] > 0) {
        const newUnreadCount = { ...chatData.unreadCount };
        newUnreadCount[auth.currentUser.uid] = 0;
        
        // Update all participants' chat documents
        for (const participantId of chatData.participants || []) {
          const participantChatRef = ref(database, `userChats/${participantId}/${chatId}`);
          await update(participantChatRef, {
            unreadCount: newUnreadCount
          });
        }
        console.log('Marked chat as read:', chatId);
      }
    } catch (err) {
      console.error('Error marking chat as read:', err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        loading,
        error,
        sendMessage,
        setCurrentChat,
        startNewChat,
        markChatAsRead
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};