export interface User {
  _id: string;
  fullName: string;
  role: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: {
    _id: string;
    fullName: string;
    role: string;
  };
  receiverId: {
    _id: string;
    fullName: string;
    role: string;
  };
  message: string;
  messageType: string;
  mediaUrl?: string;
  replyTo?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  tempId?: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}