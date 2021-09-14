import { io, Socket } from 'socket.io-client';
import { store } from '../store/store';

store.getState();
export class SocketClient {
	private static _socket: Socket;

	private constructor() {}

	public static init() {
		const serverAddr = 'http://f1shp1.lan:5000';
		this._socket = io(serverAddr, {
			transports: [ 'websocket' ]
		});

		this._socket.on('connect', () => {
			console.log(`connected to ${serverAddr}`);
		});
		this._socket.on('error', error => console.error(error));
	}

	public static socket(): Socket {
		return this._socket;
	}
}
