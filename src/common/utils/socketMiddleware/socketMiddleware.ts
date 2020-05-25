import { TypeSocket } from 'typesocket';
import { MiddlewareAPI } from 'redux';
import { SocketActionTypes } from './SocketActionTypes';


export const socketMiddleware = (url: string) => {
    return (store: MiddlewareAPI<any, any>) => {
        let socket = new WebSocket(url);

        socket.onopen = () => console.log('connected');
        socket.onclose = () => socket = new WebSocket(url);
        socket.onmessage = (message) => store.dispatch({ type: SocketActionTypes.WS_MESSAGE, value: message.data });

        return (next: (action: any) => void) => (action: any) => {
            if (action.type && action.type === SocketActionTypes.WS_SEND_MESSAGE && socket.readyState === 1) {
                socket.send(action.payload);
            }

            return next(action);
        };
    };
};