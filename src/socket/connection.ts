import { io, Socket } from 'socket.io-client';
import { SocketConnectionStatus } from './types';

/**
 * Socket Connection Manager
 * Handles socket connection, disconnection, and reconnection logic
 */
export class SocketConnection {
  private socket: Socket | null = null;
  private connectionStatus: SocketConnectionStatus = 'disconnected';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private statusCallbacks: Set<(status: SocketConnectionStatus) => void> = new Set();

  constructor(
    private socketUrl: string,
    private options?: {
      withCredentials?: boolean;
      transports?: string[];
      autoConnect?: boolean;
    }
  ) {}

  /**
   * Connect to socket server
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const defaultOptions = {
      withCredentials: true,
      transports: ['websocket'], // Only use WebSocket, disable polling
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      upgrade: false, // Disable transport upgrade
      forceNew: false, // Reuse existing connection
    };

    this.socket = io(this.socketUrl, {
      ...defaultOptions,
      ...this.options,
    });

    this.setupConnectionListeners();
    this.updateStatus('connecting');

    return this.socket;
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.updateStatus('disconnected');
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Get current socket instance
   */
  getSocket(): Socket | null {
    return this.socket;
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Get current connection status
   */
  getStatus(): SocketConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(callback: (status: SocketConnectionStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    // Immediately call with current status
    callback(this.connectionStatus);
    // Return unsubscribe function
    return () => this.statusCallbacks.delete(callback);
  }

  /**
   * Setup connection event listeners
   */
  private setupConnectionListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
      this.reconnectAttempts = 0;
      this.updateStatus('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected from server:', reason);
      this.updateStatus('disconnected');

      // Auto-reconnect for certain disconnect reasons
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
      this.reconnectAttempts++;
      this.updateStatus('error');

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[Socket] Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
      this.updateStatus('connected');
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('[Socket] Reconnection attempt', attemptNumber);
      this.updateStatus('connecting');
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnection error:', error);
      this.updateStatus('error');
    });

    this.socket.on('reconnect_failed', () => {
      console.error('[Socket] Reconnection failed');
      this.updateStatus('error');
    });
  }

  /**
   * Update connection status and notify subscribers
   */
  private updateStatus(status: SocketConnectionStatus): void {
    this.connectionStatus = status;
    this.statusCallbacks.forEach((callback) => callback(status));
  }

  /**
   * Manually trigger reconnection
   */
  reconnect(): void {
    if (this.socket) {
      this.reconnectAttempts = 0;
      this.socket.connect();
    } else {
      this.connect();
    }
  }

  /**
   * Get socket ID
   */
  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

/**
 * Create and export a singleton instance
 */
let socketConnectionInstance: SocketConnection | null = null;

export const createSocketConnection = (
  socketUrl: string,
  options?: {
    withCredentials?: boolean;
    transports?: string[];
    autoConnect?: boolean;
  }
): SocketConnection => {
  if (!socketConnectionInstance) {
    socketConnectionInstance = new SocketConnection(socketUrl, options);
  }
  return socketConnectionInstance;
};

export const getSocketConnection = (): SocketConnection | null => {
  return socketConnectionInstance;
};

export const destroySocketConnection = (): void => {
  if (socketConnectionInstance) {
    socketConnectionInstance.disconnect();
    socketConnectionInstance = null;
  }
};
