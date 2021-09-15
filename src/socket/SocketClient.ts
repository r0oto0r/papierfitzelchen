import { io, Socket } from 'socket.io-client';
import { setConnected } from '../slices/serverSlice';
import store, { RootState } from '../store/store';

export class SocketClient {
	private static _socket: Socket;
	private static _connected: boolean;
	private static _serverAddress: string;

	private constructor() {}

	public static init() {
		const { address, connected } = (store.getState() as RootState).server;
		this._serverAddress = address;
		this._connected = connected;

		store.subscribe(() => {
			const { address, connected } = (store.getState() as RootState).server;
			this._serverAddress = address;
			this._connected = connected;
		});

		this.connectToServer();
	}

	public static connectToServer() {
		if(!this._connected) {
			this.initSocket();
		}
	}

	public static disconnectFromServer() {
		if(this._socket) {
			this._socket.offAny();
			this._socket.disconnect();
			this._socket.close();
		}
	}

	private static initSocket() {
		if(this._socket) {
			this._socket.offAny();
			this._socket.disconnect();
			this._socket.close();
		}

		console.log(`connecting to ${this._serverAddress}`);

		this._socket = io(this._serverAddress, {
			transports: [ 'websocket' ]
		});

		this._socket.on('connect', () => {
			console.log(`connected to ${this._serverAddress}`);
			store.dispatch(setConnected(true));
		});

		this._socket.on('disconnect', () => {
			console.log(`disconnected from ${this._serverAddress}`);
			store.dispatch(setConnected(false));
		});

		this._socket.on('error', error => {
			console.error(error);
		});
	}

	public static emit(messageType: string, data?: any) {
		if(this._connected) {
			this._socket.emit(messageType, data);
		}
	}

	public static get connected(): boolean {
		return this._connected
	}
}
