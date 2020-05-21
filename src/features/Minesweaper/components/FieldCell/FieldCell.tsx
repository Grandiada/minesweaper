import { Button } from 'antd';
import * as React from 'react';

import styles from './FieldCell.module.scss';

export interface IFieldCellProps {
}

export default class FieldCell extends React.PureComponent<IFieldCellProps> {
    public render() {

        return (
            <div className={styles["field-cell"]}>
                Cell
                <Button type="primary">Primary</Button>
            </div>
        );
    }
}
