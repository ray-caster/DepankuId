'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications, Notification } from '@/lib/notifications';
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';

interface NotificationToastProps {
    notification: Notification;
    onRemove: (id: string) => void;
}

function NotificationToast({ notification, onRemove }: NotificationToastProps) {
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
            case 'info':
                return <InformationCircleIcon className="w-5 h-5 text-blue-600" />;
            default:
                return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
        }
    };

    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-red-50 border-red-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`max-w-sm w-full ${getBackgroundColor()} border-2 rounded-gentle p-4 shadow-lg`}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground">
                        {notification.title}
                    </h4>
                    <p className="text-sm text-foreground-light mt-1">
                        {notification.message}
                    </p>
                </div>
                <button
                    onClick={() => onRemove(notification.id)}
                    className="flex-shrink-0 text-foreground-lighter hover:text-foreground transition-colors"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}

export default function NotificationContainer() {
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <NotificationToast
                        key={notification.id}
                        notification={notification}
                        onRemove={removeNotification}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
