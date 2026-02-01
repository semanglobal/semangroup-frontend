export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: "broadcast" | "direct";
    sender: {
        _id: string;
        fullName: string;
        email: string;
    };
    recipients?: Array<{
        _id: string;
        fullName: string;
        email: string;
    }>;
    readBy: string[];
    createdAt: string;
    unread?: boolean;
}

export interface NotificationFormData {
    title: string;
    message: string;
    type: string;
    recipients?: string[] | string;
}