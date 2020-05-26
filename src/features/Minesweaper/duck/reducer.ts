import { Reducer } from "react";
import {
    IMinesweaperState, MinesweaperActionTypes, SET_MAP, SET_LEVELS, NEW_GAME, END_GAME, SOLVE_GAME_START, SOLVE_GAME_END,
} from "./types";
import { number } from "prop-types";

const initialState: IMinesweaperState = {
    levels: [1, 2, 3, 4],
    playerField: undefined,
    gameEnded: false,
    isAutoSolveMode: false,
    currentLevel: undefined
};

const MinesweaperReducer: Reducer<IMinesweaperState, MinesweaperActionTypes> =
    (state: IMinesweaperState = initialState, action: MinesweaperActionTypes) => {
        switch (action.type) {
            case NEW_GAME: {
                return {
                    ...state,
                    currentLevel: action.payload.level,
                    gameEnded: false,
                };
            }
            case END_GAME: {
                return {
                    ...state,
                    gameEnded: true,
                };
            }
            case SOLVE_GAME_START: {
                return {
                    ...state,
                    isAutoSolveMode: true,
                };
            }
            case SOLVE_GAME_END: {
                return {
                    ...state,
                    isAutoSolveMode: false,
                };
            }
            case SET_MAP: {
                return {
                    ...state,
                    playerField: [...action.payload]
                };
            }
            case SET_LEVELS: {
                return {
                    ...state,
                    levels: [...action.payload.levels]
                };
            }
            default:
                return state;
        }
    };

export default MinesweaperReducer;
