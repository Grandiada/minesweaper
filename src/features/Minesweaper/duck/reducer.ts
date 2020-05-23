import { Reducer } from "react";
import {
    IMinesweaperState, MinesweaperActionTypes, SET_MAP, SET_LEVELS,
} from "./types";

const initialState: IMinesweaperState = {
    levels: [],
    playerField: undefined
};

const MinesweaperReducer: Reducer<IMinesweaperState, MinesweaperActionTypes> =
    (state: IMinesweaperState = initialState, action: MinesweaperActionTypes) => {
        switch (action.type) {
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
