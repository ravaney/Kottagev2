import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { database, auth } from '../firebase';
import { ref, push, set, onValue, update, get, query, orderByChild } from 'firebase/database';
import {
  playNotificationSound,
  primeNotificationSound,
} from '../utils/notificationSound';

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
  currentUserId: string;
  totalUnreadMessages: number;
  sendMessage: (text: string) => Promise<void>;
  sendDirectMessageToUser: (
    userId: string,
    userName: string,
    text: string,
    propertyId?: string,
    propertyName?: string
  ) => Promise<string>;
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
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const previousUnreadCountRef = useRef<number | null>(null);

  // Keep chat subscriptions in sync with auth state so badges update without refresh.
  useEffect(() => {
    let unsubscribeUserChats: (() => void) | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged(currentUser => {
      if (unsubscribeUserChats) {
        unsubscribeUserChats();
        unsubscribeUserChats = null;
      }

      setError(null);
      setCurrentUserId(currentUser?.uid || '');

      if (!currentUser) {
        setChats([]);
        setCurrentChat(null);
        setMessages([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const userChatsRef = ref(database, `userChats/${currentUser.uid}`);

      unsubscribeUserChats = onValue(userChatsRef, (snapshot) => {
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

        chatList.sort((a, b) => {
          if (!a.lastMessageTimestamp) return 1;
          if (!b.lastMessageTimestamp) return -1;
          return b.lastMessageTimestamp - a.lastMessageTimestamp;
        });

        setChats(chatList);
        setLoading(false);
      }, (listenerError) => {
        console.error('Error loading chats:', listenerError);
        setError('Failed to load chats');
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeUserChats) {
        unsubscribeUserChats();
      }
      unsubscribeAuth();
    };
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
    }, (error) => {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    });

    return () => unsubscribe();
  }, [currentChat]);

  const ensureChatWithUser = async (
    userId: string,
    userName: string,
    propertyId?: string,
    propertyName?: string
  ): Promise<Chat> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    const userChatsRef = ref(database, `userChats/${auth.currentUser.uid}`);
    const snapshot = await get(userChatsRef);
    const data = snapshot.val() || {};

    let existingChatId: string | null = null;
    Object.keys(data).forEach(chatId => {
      const chatData = data[chatId];
      if (chatData.participants && chatData.participants.includes(userId)) {
        existingChatId = chatId;
      }
    });

    if (existingChatId) {
      const existingChatData = data[existingChatId];
      return {
        id: existingChatId,
        participants: existingChatData.participants || [],
        participantNames: existingChatData.participantNames || {},
        lastMessage: existingChatData.lastMessage,
        lastMessageTimestamp: existingChatData.lastMessageTimestamp,
        propertyId: existingChatData.propertyId,
        propertyName: existingChatData.propertyName,
        unreadCount: existingChatData.unreadCount || {},
      };
    }

    const timestamp = Date.now();
    const chatId = push(ref(database, 'chats')).key;

    if (!chatId) throw new Error('Failed to generate chat ID');

    const participants = [auth.currentUser.uid, userId];
    const participantNames: Record<string, string> = {
      [auth.currentUser.uid]: auth.currentUser.displayName || 'User',
      [userId]: userName,
    };

    const chatData = {
      participants,
      participantNames,
      createdAt: timestamp,
      lastMessageTimestamp: timestamp,
      unreadCount: { [auth.currentUser.uid]: 0, [userId]: 0 },
      ...(propertyId && propertyName ? { propertyId, propertyName } : {}),
    };

    for (const participantId of participants) {
      await set(ref(database, `userChats/${participantId}/${chatId}`), chatData);
    }

    return {
      id: chatId,
      participants,
      participantNames,
      propertyId,
      propertyName,
      lastMessageTimestamp: timestamp,
      unreadCount: { [auth.currentUser.uid]: 0, [userId]: 0 },
    };
  };

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

      const newUnreadCount = { ...(currentChat.unreadCount || {}) };

      currentChat.participants.forEach(participantId => {
        if (participantId !== auth.currentUser?.uid) {
          newUnreadCount[participantId] =
            (currentChat.unreadCount?.[participantId] || 0) + 1;
        } else {
          newUnreadCount[auth.currentUser!.uid] = 0;
        }
      });

      const participantIds = [
        auth.currentUser.uid,
        ...currentChat.participants.filter(id => id !== auth.currentUser?.uid),
      ];

      for (const participantId of participantIds) {
        const userChatRef = ref(
          database,
          `userChats/${participantId}/${currentChat.id}`
        );

        const updates = {
          lastMessage: text,
          lastMessageTimestamp: timestamp,
          unreadCount: newUnreadCount
        };

        try {
          await update(userChatRef, updates);
          console.log(`Updated chat metadata for participant: ${participantId}`);
        } catch (participantError) {
          console.error(
            `Error updating chat metadata for participant ${participantId}:`,
            participantError
          );
        }
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
    try {
      const chat = await ensureChatWithUser(
        userId,
        userName,
        propertyId,
        propertyName
      );

      setCurrentChat(chat);
      return chat.id;
    } catch (err) {
      console.error('Error starting new chat:', err);
      setError('Failed to start new chat');
      throw err;
    }
  };

  const sendDirectMessageToUser = async (
    userId: string,
    userName: string,
    text: string,
    propertyId?: string,
    propertyName?: string
  ): Promise<string> => {
    if (!auth.currentUser) throw new Error('User not authenticated');

    try {
      const chat = await ensureChatWithUser(
        userId,
        userName,
        propertyId,
        propertyName
      );
      const timestamp = Date.now();
      const messageData = {
        text,
        senderId: auth.currentUser.uid,
        senderName: auth.currentUser.displayName || 'User',
        timestamp,
        read: false,
      };

      const messagesRef = ref(database, `messages/${chat.id}`);
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, messageData);

      const newUnreadCount = { ...(chat.unreadCount || {}) };
      chat.participants.forEach(participantId => {
        if (participantId !== auth.currentUser?.uid) {
          newUnreadCount[participantId] = (chat.unreadCount?.[participantId] || 0) + 1;
        } else {
          newUnreadCount[participantId] = 0;
        }
      });

      const updates = {
        participants: chat.participants,
        participantNames: chat.participantNames,
        propertyId: propertyId || chat.propertyId || '',
        propertyName: propertyName || chat.propertyName || '',
        lastMessage: text,
        lastMessageTimestamp: timestamp,
        unreadCount: newUnreadCount,
      };

      for (const participantId of chat.participants) {
        await update(ref(database, `userChats/${participantId}/${chat.id}`), updates);
      }

      setCurrentChat({
        ...chat,
        propertyId: propertyId || chat.propertyId,
        propertyName: propertyName || chat.propertyName,
        lastMessage: text,
        lastMessageTimestamp: timestamp,
        unreadCount: newUnreadCount,
      });

      return chat.id;
    } catch (err) {
      console.error('Error sending direct message:', err);
      setError('Failed to send direct message');
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

        const participantIds = [
          auth.currentUser.uid,
          ...(chatData.participants || []).filter(
            (participantId: string) => participantId !== auth.currentUser?.uid
          ),
        ];

        for (const participantId of participantIds) {
          const participantChatRef = ref(
            database,
            `userChats/${participantId}/${chatId}`
          );
          try {
            await update(participantChatRef, {
              unreadCount: newUnreadCount
            });
          } catch (participantError) {
            console.error(
              `Error updating read state for participant ${participantId}:`,
              participantError
            );
          }
        }
        console.log('Marked chat as read:', chatId);
      }
    } catch (err) {
      console.error('Error marking chat as read:', err);
    }
  };

  const totalUnreadMessages = chats.reduce((total, chat) => {
    return total + (chat.unreadCount?.[currentUserId] || 0);
  }, 0);

  useEffect(() => {
    primeNotificationSound();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      previousUnreadCountRef.current = null;
      return;
    }

    if (previousUnreadCountRef.current === null) {
      previousUnreadCountRef.current = totalUnreadMessages;
      return;
    }

    if (totalUnreadMessages > previousUnreadCountRef.current) {
      void playNotificationSound();
    }

    previousUnreadCountRef.current = totalUnreadMessages;
  }, [currentUserId, totalUnreadMessages]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        loading,
        error,
        currentUserId,
        totalUnreadMessages,
        sendMessage,
        sendDirectMessageToUser,
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
