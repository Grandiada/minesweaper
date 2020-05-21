import * as React from 'react';

import styles from './FieldCell.module.scss';

export interface IFieldCellProps {
}

export default class FieldCell extends React.PureComponent<IFieldCellProps> {
    public render() {

        return (
            <div className={styles.field_cell}>
                Cell
            </div>
        );
    }
}
