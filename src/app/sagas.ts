import { all } from "@redux-saga/core/effects";
import { minesweaperSagas } from "../features/Minesweaper/duck";

function SETUP() {
  console.log("App started");
}

export default function* rootSaga() {
  yield all([
    minesweaperSagas.default(),
    SETUP(),
  ]);
}
