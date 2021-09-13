import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux';
import Socket from 'socket.io-client';

const serverAddr = 'http://f1shp1.lan:5000';
export const socketClient = Socket(serverAddr, {
    transports: [ 'websocket' ]
});
socketClient.on('connect', () => {
    console.log(`connected to ${serverAddr}`);
});
socketClient.on('error', error => console.error(error));

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
