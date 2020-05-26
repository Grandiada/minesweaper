import {
    MinesweaperActionTypes,
    GET_MAP, SET_MAP, NEW_GAME, SET_LEVELS, OPEN_CELL, GET_HELP, SOLVE_GAME_START, END_GAME, SOLVE_GAME_END
} from "./types";

export const GetMapAction =
    (): MinesweaperActionTypes =>
        ({
            type: GET_MAP,
        });

export const GetHelpAction =
    (): MinesweaperActionTypes =>
        ({
            type: GET_HELP,
        });

export const SetMapAction =
    (map: (number | null)[][]): MinesweaperActionTypes =>
        ({
            payload: map,
            type: SET_MAP,
        });

export const NewGameAction =
    (level: number): MinesweaperActionTypes =>
        ({
            type: NEW_GAME,
            payload: { level }
        });

export const SetLevelsAction =
    (levels: number[]): MinesweaperActionTypes =>
        ({
            type: SET_LEVELS,
            payload: { levels }
        });

export const OpenCellAction =
    (x: number, y: number): MinesweaperActionTypes =>
        ({
            type: OPEN_CELL,
            payload: { x, y }
        });

export const SolveGameStartAction =
    (): MinesweaperActionTypes =>
        ({
            type: SOLVE_GAME_START,
        });

export const SolveGameEndAction =
    (): MinesweaperActionTypes =>
        ({
            type: SOLVE_GAME_END,
        });

export const EndGameAction =
    (): MinesweaperActionTypes =>
        ({
            type: END_GAME,
        });

