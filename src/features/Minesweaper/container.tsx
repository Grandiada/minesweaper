import * as React from 'react';
import PlayerField from './components/PlayerField/PlayerField';
import { minesweaperActions } from './duck';
import { connect } from 'react-redux';
import { IApplicationState } from '../../app/store';
import { Button } from 'antd';

interface IMinesweaperData {
    playerField?: (number | null)[][];
    levels: number[];
    currentLevel?: number;
}

interface IMinesweaperActions {
    newGame: typeof minesweaperActions.NewGameAction;
    openCell: typeof minesweaperActions.OpenCellAction;
    solveGame: typeof minesweaperActions.SolveGameStartAction;
}

type IMinesweaperProps = IMinesweaperData & IMinesweaperActions;

class Minesweaper extends React.PureComponent<IMinesweaperProps, {}> {
    constructor(props: IMinesweaperProps) {
        super(props);

        this.state = {
        };
    }

    public render() {
        return (
            <div>
                <div>
                    {
                        this.props.levels.map((i) => {
                            return (
                                <Button
                                    type={"primary"}
                                    key={i}
                                    onClick={() => {
                                        this.props.newGame(i)
                                    }}>{i}</Button>
                            )
                        })
                    }
                    {
                        (this.props.currentLevel &&
                            < Button
                                type={"ghost"}
                                onClick={() => {
                                    this.props.solveGame()
                                }}>Solve Game</Button>) || 'Choice level to unlock solve mode'
                    }
                </div>
                {
                    this.props.playerField && <PlayerField
                        field={this.props.playerField}
                        openCell={this.props.openCell}
                    />
                }
            </div >
        );
    }
}

const mapStateToProps = (state: IApplicationState): IMinesweaperData => {
    return {
        levels: state.minesweaper.levels,
        playerField: state.minesweaper.playerField,
        currentLevel: state.minesweaper.currentLevel
    };
};

const mapDispatchToProps: IMinesweaperActions = {
    newGame: minesweaperActions.NewGameAction,
    openCell: minesweaperActions.OpenCellAction,
    solveGame: minesweaperActions.SolveGameStartAction,
};

export default
    connect<IMinesweaperData, IMinesweaperActions, IMinesweaperProps>(mapStateToProps, mapDispatchToProps)
        (Minesweaper);
