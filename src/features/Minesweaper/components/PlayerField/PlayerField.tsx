import * as React from 'react';
import PlayerFieldRow from './PlayerFieldRow/PlayerFieldRow';

import styles from './PlayerField.module.scss';
import { minesweaperActions } from '../../duck';

export interface IPlayerFieldProps {
    field: (number | null)[][],
    openCell: typeof minesweaperActions.OpenCellAction;
}

export default class PlayerField extends React.PureComponent<IPlayerFieldProps> {
    public render() {
        return (
            <div className={styles.playerField}>
                {this.props.field.map((item, index) => <PlayerFieldRow
                    openCell={this.props.openCell}
                    rowNumber={index}
                    key={index}
                    rowDescription={item} />)}
            </div>
        );
    }
}
