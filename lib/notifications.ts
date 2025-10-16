/**
 * Centralized notification system for consistent error handling
 */

export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

class NotificationManager {
    private notifications: Notification[] = [];
    private listeners: ((notifications: Notification[]) => void)[] = [];

    addNotification(notification: Omit<Notification, 'id'>): string {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
            id,
            duration: 5000, // 5 seconds default
            ...notification
        };

        this.notifications.push(newNotification);
        this.notifyListeners();

        // Auto-remove after duration
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }

    removeNotification(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    }

    clearAll(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    subscribe(listener: (notifications: Notification[]) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    // Convenience methods
    success(title: string, message: string, duration?: number): string {
        return this.addNotification({ type: 'success', title, message, duration });
    }

    error(title: string, message: string, duration?: number): string {
        return this.addNotification({ type: 'error', title, message, duration });
    }

    warning(title: string, message: string, duration?: number): string {
        return this.addNotification({ type: 'warning', title, message, duration });
    }

    info(title: string, message: string, duration?: number): string {
        return this.addNotification({ type: 'info', title, message, duration });
    }
}

export const notificationManager = new NotificationManager();

// React hook for using notifications
export function useNotifications() {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);

    React.useEffect(() => {
        const unsubscribe = notificationManager.subscribe(setNotifications);
        return unsubscribe;
    }, []);

    return {
        notifications,
        addNotification: notificationManager.addNotification.bind(notificationManager),
        removeNotification: notificationManager.removeNotification.bind(notificationManager),
        clearAll: notificationManager.clearAll.bind(notificationManager),
        success: notificationManager.success.bind(notificationManager),
        error: notificationManager.error.bind(notificationManager),
        warning: notificationManager.warning.bind(notificationManager),
        info: notificationManager.info.bind(notificationManager),
    };
}

// Import React for the hook
import React from 'react';
