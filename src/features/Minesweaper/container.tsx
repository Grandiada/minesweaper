import * as React from 'react';

export interface IMinesweaperProps {
}

export interface IMinesweaperState {
}

export default class Minesweaper extends React.Component<IMinesweaperProps, IMinesweaperState> {
    constructor(props: IMinesweaperProps) {
        super(props);

        this.state = {
        };
    }

    public render() {
        return (
            <div>
                Hello
            </div>
        );
    }
}
