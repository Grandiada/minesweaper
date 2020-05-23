import { all, put, select, takeLatest } from "@redux-saga/core/effects";
import { NEW_GAME, INewGameActionType, OPEN_CELL, IOpenCellActionType } from "./types";
import { SocketActionTypes } from "../../../common/utils/socketMiddleware/SocketActionTypes";
import { SendMessageToSocketAction } from "../../../common/utils/socketMiddleware/actions";
import { arrayParser } from "./utils/arrayParser";
import { SetMapAction, NewGameAction } from "./actions";

function* OnSocketMessage(action: { type: SocketActionTypes.WS_MESSAGE, value: string }) {
    try {
        console.log(action)
        // {type: "WS_MESSAGE", value: "new: OK"}
        // {type: "WS_MESSAGE", value: "map:↵□□□□□□□□□□↵□□□□□□□□□□↵□□□□□□□□□□↵□□□□□□□□□□↵□…□□□□↵□□□□□□□□□□↵□□□□□□□□□□↵□□□□□□□□□□↵□□□□□□□□□□↵"}
        const parsedResponse = action.value.split(':')
        const command = parsedResponse[0];
        const value = parsedResponse[1];

        switch (command) {
            case 'map': {
                yield put(SetMapAction(arrayParser(value)))
                break;
            }
            case 'open': {
                if (value.indexOf('lose') !== -1) {
                    yield put(NewGameAction(1));
                    alert('You lose');
                }
            }
            default:
                break;
        }

    } catch (e) {
        console.log(e);
    }
}


function* OnNewGame(action: INewGameActionType) {
    try {
        yield put(SendMessageToSocketAction(`new ${action.payload.level}`));
        yield put(SendMessageToSocketAction(`map`));
    } catch (e) {
        console.log(e);
    }
}

function* OnOpenCell(action: IOpenCellActionType) {
    try {
        yield put(SendMessageToSocketAction(`open ${action.payload.x} ${action.payload.y}`));
        yield put(SendMessageToSocketAction(`map`));
    } catch (e) {
        console.log(e);
    }
}

function* OnInitGame() {
    try {
        yield put(SendMessageToSocketAction(`help`));
    } catch (e) {
        console.log(e);
    }
}

export default function* rootMinesweaperSaga() {
    yield all([
        takeLatest(SocketActionTypes.WS_MESSAGE, OnSocketMessage),
        takeLatest(NEW_GAME, OnNewGame),
        takeLatest(OPEN_CELL, OnOpenCell),
        OnInitGame()
    ]);
}
