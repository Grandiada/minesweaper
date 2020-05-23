import { SocketActionTypes } from "./SocketActionTypes";

export const SendMessageToSocketAction =
    (payload: string): { type: string, payload: string } =>
        ({
            type: SocketActionTypes.WS_SEND_MESSAGE,
            payload
        });

