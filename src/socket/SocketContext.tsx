import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createSocketConnection } from './connection';
import { SocketEventManager } from './events';
import { SocketContextState } from './types';
import { getUser } from '../utils/helpers';
import config from '../config';

interface SocketContextValue extends SocketContextState {
  eventManager: SocketEventManager | null;
  connect: () => void;
  disconnect: () => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<SocketContextState>({
    socket: null,
    isConnected: false,
    connectionStatus: 'disconnected',
    currentRoomId: null,
    onlineUsers: [],
    typingUsers: {},
  });
  const [eventManager, setEventManager] = useState<SocketEventManager | null>(null);

  const connect = useCallback(() => {
    // Prevent multiple connections
    if (state.isConnected || state.socket?.connected) {
      console.log('[Socket] Already connected, skipping...');
      return;
    }

    const user = getUser();
    if (!user?.id) {
      console.warn('[Socket] No user found, cannot connect');
      return;
    }

    console.log('[Socket] Connecting to chat server...');
    const socketUrl = config.API_BASE_URL.replace('/api', '');
    const connection = createSocketConnection(socketUrl);
    const socket = connection.connect();

    const manager = new SocketEventManager(socket);
    setEventManager(manager);

    socket.on('connect', () => {
      console.log('[Socket] Successfully connected');
      setState(prev => ({ ...prev, socket, isConnected: true, connectionStatus: 'connected' }));
      manager.emitters.userOnline(parseInt(user.id));
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setState(prev => ({ ...prev, isConnected: false, connectionStatus: 'disconnected' }));
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
      setState(prev => ({ ...prev, isConnected: false, connectionStatus: 'error' }));
    });
  }, [state.isConnected, state.socket]);

  const disconnect = useCallback(() => {
    eventManager?.cleanup();
    state.socket?.disconnect();
    setState({
      socket: null,
      isConnected: false,
      connectionStatus: 'disconnected',
      currentRoomId: null,
      onlineUsers: [],
      typingUsers: {},
    });
  }, [eventManager, state.socket]);

  return (
    <SocketContext.Provider value={{ ...state, eventManager, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
