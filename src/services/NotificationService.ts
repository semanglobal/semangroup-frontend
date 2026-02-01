/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Notification, NotificationFormData } from '../types/notificationType';
import type { Message } from "../types/chatType";
import api from "./api";

export const NotificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get(`/api/notifications/getNotifications?page=1&limit=10`);
      return response.data.notifications;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  getAllUsers: async (): Promise<any[]> => {
    try {
      const response = await api.get(`/api/Auth/users`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  sendNotification: async (data: NotificationFormData) => {
    try {
      await api.post(`/api/notifications/send`, data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};