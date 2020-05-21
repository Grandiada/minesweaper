import { all } from "@redux-saga/core/effects";

function SETUP() {
  console.log("App started");
}

export default function* rootSaga() {
  yield all([
    SETUP(),
  ]);
}
