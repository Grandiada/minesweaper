import { all, put, select, takeLatest } from "@redux-saga/core/effects";
import { NEW_GAME, INewGameActionType, OPEN_CELL, IOpenCellActionType, SOLVE_GAME } from "./types";
import { SocketActionTypes } from "../../../common/utils/socketMiddleware/SocketActionTypes";
import { SendMessageToSocketAction } from "../../../common/utils/socketMiddleware/actions";
import { arrayParser } from "./utils/arrayParser";
import { SetMapAction, NewGameAction, OpenCellAction } from "./actions";
import { IApplicationState } from "../../../app/store";
import { constructGroupds } from "./utils/groupConstuctor";

let isGameOver = false;
function* OnSocketMessage(action: { type: SocketActionTypes.WS_MESSAGE, value: string }) {
    try {
        const parsedResponse = action.value.split(':')
        const command = parsedResponse[0];
        const value = parsedResponse[1];
        switch (command) {
            case 'map': {
                const map = arrayParser(value);
                yield put(SetMapAction(map))
                // const state = (yield select()) as IApplicationState;
                if (!isGameOver) {
                    const groups = constructGroupds(map)
                    console.log(groups);
                    if (groups.safePoints.length > 0) {
                        console.log(`safe move ${groups.safePoints[0].x} ${groups.safePoints[0].y}`)
                        yield put(OpenCellAction(groups.safePoints[0].x, groups.safePoints[0].y));
                    }
                    else if (groups.safePoints.length === 0 && groups.riskyPoints.length > 0) {
                        const minChanceToLose = groups.riskyPoints.reduce((p, v) => {
                            return (p.chance < v.chance ? p : v);
                        });
                        
                        console.log(`risky move ${minChanceToLose.x} ${minChanceToLose.y}`)
                        yield put(OpenCellAction(minChanceToLose.x, minChanceToLose.y));
                    } else if (groups.minedPoints.length === 0 && groups.riskyPoints.length === 0 && groups.safePoints.length === 0) {
                        yield put(OpenCellAction(10, 10));
                    }
                    else {
                        console.log('no movies')
                    }
                }
                break;
            }
            case 'open': {
                if (value.indexOf('lose') !== -1) {
                    isGameOver = true;
                    // debugger;
                    yield put(NewGameAction(2));
                } else if (value.indexOf('OK') === -1)
                    console.log(value);

                if (value.indexOf('win') !== -1) {
                    isGameOver = true;
                    alert('WIN');
                }
                console.log(action.value);
                break;
            }
            default:
                console.log(action.value);

                break;
        }

    } catch (e) {
        console.log(e);
    }
}


function* OnNewGame(action: INewGameActionType) {
    try {
        isGameOver = false;
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

function* OnSolveGame() {
    try {
        const state = (yield select()) as IApplicationState;
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
        takeLatest(SOLVE_GAME, OnSolveGame),
        OnInitGame()
    ]);
}
