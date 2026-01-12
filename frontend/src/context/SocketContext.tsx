import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });
const backendUrl = 'http://localhost:8080';

export const useSocket = () => {
    return useContext(SocketContext);
};

interface SocketProviderProps {
    userId: string | null;
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ userId, children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;

        const newSocket = io(backendUrl, {
            query: { userId },
        });

        setSocket(newSocket);

        newSocket.on('hired_notification', (data: { message: string }) => {
            console.log('Notification received:', data);
            setNotification(data.message);
            // Hide notification after 5 seconds
            setTimeout(() => setNotification(null), 5000);
        });

        newSocket.on('new_bid', (data: any) => {
             console.log('New bid received:', data);
             setNotification(`New bid on "${data.gigTitle}": ₹${data.bidPrice}`);
             setTimeout(() => setNotification(null), 5000);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
            {/* Tailwind Toast Notification */}
            {notification && (
                <div className="fixed top-5 right-5 z-50 animate-bounce">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-xl flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{notification}</span>
                    </div>
                </div>
            )}
        </SocketContext.Provider>
    );
};
