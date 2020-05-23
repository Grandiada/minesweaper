import { Button } from 'antd';
import * as React from 'react';

import styles from './PlayerFieldCell.module.scss';
import { minesweaperActions } from '../../../duck';

export interface IPlayerFieldCellProps {
    cellValue: number | null;
    rowNumber: number;
    cellNumber: number;
    openCell: typeof minesweaperActions.OpenCellAction;
}

export default class PlayerFieldCell extends React.PureComponent<IPlayerFieldCellProps> {
    public render() {
        const className = [styles["field-cell-base"], this.props.cellValue !== 0
            ? styles["field-cell_active"] : styles["field-cell_disabled"]].join(' ');
        return (
            <div className={className} onClick={this.props.cellValue !== 0 ?
                () => this.props.openCell(this.props.cellNumber, this.props.rowNumber) :
                undefined
            }>
                <span>{this.props.cellValue}</span>
            </div>
        );
    }
}
