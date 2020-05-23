import * as React from 'react';
import PlayerField from './components/PlayerField/PlayerField';
import { minesweaperActions } from './duck';
import { connect } from 'react-redux';
import { IApplicationState } from '../../app/store';
import { Button } from 'antd';

interface IMinesweaperData {
    playerField?: (number | null)[][];
    levels: number[];
}

interface IMinesweaperActions {
    newGame: typeof minesweaperActions.NewGameAction;
    openCell: typeof minesweaperActions.OpenCellAction;
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
                {this.props.playerField && <PlayerField
                    field={this.props.playerField}
                    openCell={this.props.openCell}
                />}
                {
                    [1, 2, 3, 4].map((i) => {
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
            </div>
        );
    }
}

const mapStateToProps = (state: IApplicationState): IMinesweaperData => {
    return {
        levels: state.minesweaper.levels,
        playerField: state.minesweaper.playerField
    };
};

const mapDispatchToProps: IMinesweaperActions = {
    newGame: minesweaperActions.NewGameAction,
    openCell: minesweaperActions.OpenCellAction
};

export default
    connect<IMinesweaperData, IMinesweaperActions, IMinesweaperProps>(mapStateToProps, mapDispatchToProps)
        (Minesweaper);
