import { all, put, select, takeLatest } from "@redux-saga/core/effects";
import { NEW_GAME, INewGameActionType, OPEN_CELL, IOpenCellActionType, SOLVE_GAME_START } from "./types";
import { SocketActionTypes } from "../../../common/utils/socketMiddleware/SocketActionTypes";
import { SendMessageToSocketAction } from "../../../common/utils/socketMiddleware/actions";
import { arrayParser } from "./utils/arrayParser";
import { SetMapAction, NewGameAction, OpenCellAction, EndGameAction, SolveGameStartAction, SolveGameEndAction } from "./actions";
import { IApplicationState } from "../../../app/store";
import { categorizeCells } from "./utils/groupConstuctor";

let isGameOver = false;
function* OnSocketMessage(action: { type: SocketActionTypes.WS_MESSAGE, value: string }) {
    try {
        const parsedResponse = action.value.split(':')
        const command = parsedResponse[0];
        const value = parsedResponse[1];
        const state = (yield select()) as IApplicationState;

        switch (command) {
            case 'map': {
                const map = arrayParser(value);
                yield put(SetMapAction(map))

                if (!state.minesweaper.gameEnded && state.minesweaper.isAutoSolveMode) {
                    yield OnSolveGame();
                }
                break;
            }
            case 'open': {
                if (value.indexOf('lose') !== -1) {
                    yield put(EndGameAction());

                    if (!state.minesweaper.isAutoSolveMode)
                        alert('Lose');
                    if (state.minesweaper.currentLevel)
                        yield put(NewGameAction(state.minesweaper.currentLevel));

                } else if (value.indexOf('OK') !== -1) {
                    yield put(SendMessageToSocketAction(`map`));
                    console.log(value);
                }
                if (value.indexOf('win') !== -1) {
                    yield put(EndGameAction());
                    yield put(SolveGameEndAction())
                    alert(`WIN pass ${action.value}`);
                }
                break;
            }
            case 'new': {
                yield put(SendMessageToSocketAction(`map`));
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
    } catch (e) {
        console.log(e);
    }
}

function* OnOpenCell(action: IOpenCellActionType) {
    try {
        const state = (yield select()) as IApplicationState;
        if (!state.minesweaper.gameEnded) {
            yield put(SendMessageToSocketAction(`open ${action.payload.x} ${action.payload.y}`));
        }
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

        if (!state.minesweaper.playerField)
            throw Error();
        const map = state.minesweaper.playerField
        const groups = categorizeCells(map)

        // console.log(groups);

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
        } else if (groups.riskyPoints.length === 0 && groups.safePoints.length === 0) {
            //Random move
            yield put(OpenCellAction(Math.ceil(Math.random() * (map[0].length - 1)), Math.ceil(Math.random() * (map.length - 1))));
        } else {
            console.log('no movies')
        }
    } catch (e) {
        console.log(e);
    }
}



export default function* rootMinesweaperSaga() {
    yield all([
        takeLatest(SocketActionTypes.WS_MESSAGE, OnSocketMessage),
        takeLatest(NEW_GAME, OnNewGame),
        takeLatest(OPEN_CELL, OnOpenCell),
        takeLatest(SOLVE_GAME_START, OnSolveGame),
        OnInitGame()
    ]);
}
