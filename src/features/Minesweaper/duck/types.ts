import { Action } from "redux";

export const NEW_GAME = "@@minesweaper/NEW_GAME";

export const SOLVE_GAME = "@@minesweaper/SOLVE_GAME";

export const GET_HELP = "@@minesweaper/GET_HELP";
export const SET_LEVELS = "@@minesweaper/SET_LEVELS";

export const OPEN_CELL = "@@minesweaper/OPEN_CELL";

export const GET_MAP = "@@minesweaper/GET_MAP";
export const SET_MAP = "@@minesweaper/SET_MAP";

export interface IMinesweaperState {
    playerField?: (number | null)[][];
    levels: number[];

    gameEnded: boolean;
    isAutoSolveMode: boolean;
}

export interface ISolveGameActionType extends Action<typeof SOLVE_GAME> {
}

export interface ISetLevelsActionType extends Action<typeof SET_LEVELS> {
    payload: {
        levels: number[]
    }
}

export interface IGetHelpActionType extends Action<typeof GET_HELP> {
}


export interface IGetMapActionType extends Action<typeof GET_MAP> {
}

export interface ISetMapActionType extends Action<typeof SET_MAP> {
    payload: (number | null)[][];
}


export interface INewGameActionType extends Action<typeof NEW_GAME> {
    payload: {
        level: number;
    }
}

export interface IOpenCellActionType extends Action<typeof OPEN_CELL> {
    payload: {
        x: number;
        y: number;
    }
}


export type MinesweaperActionTypes = ISetLevelsActionType | IGetHelpActionType | INewGameActionType |
    IGetMapActionType | ISetMapActionType | IOpenCellActionType | ISolveGameActionType;