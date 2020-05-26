import * as React from 'react';

import PlayerFieldCell from '../PlayerFieldCell/PlayerFieldCell';
import styles from './PlayerFieldRow.module.scss';
import { minesweaperActions } from '../../../duck';

export interface IPlayerFieldRowProps {
    rowDescription: (number | null)[];
    rowNumber: number;
    openCell: typeof minesweaperActions.OpenCellAction;
}

export interface IPlayerFieldRowState {
}

export default class PlayerFieldRow extends React.Component<IPlayerFieldRowProps, IPlayerFieldRowState> {
    constructor(props: IPlayerFieldRowProps) {
        super(props);

        this.state = {
        };
    }

    public render() {
        return (
            <div className={styles.playerFieldRow}>
                {this.props.rowDescription.map((item, index) =>
                    <div key={index}>
                        <PlayerFieldCell
                            size={this.props.rowDescription.length > 99 ? 'small' : 'medium'}
                            openCell={this.props.openCell}
                            cellNumber={index}
                            rowNumber={this.props.rowNumber}
                            cellValue={item} />
                    </div>)}
            </div>
        );
    }
}
