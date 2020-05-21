import * as React from 'react';

export interface IErrorBoundaryState {
    hasError: boolean;
    errorMessage: string;
}

export default class ErrorBoundary extends React.Component<{}, IErrorBoundaryState> {

    public static getDerivedStateFromError(error: Error): IErrorBoundaryState {
        return { hasError: true, errorMessage: error.toString() };
    }

    constructor(props: any) {
        super(props);
        this.state = {
            hasError: false,
            errorMessage: '',
        };
    }

    public componentDidCatch(error: any, errorInfo: any) {
        console.log(error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ position: 'absolute', top: '50%', left: '50%' }}>
                    <h1>Something went wrong.</h1>
                    <h3>{this.state.errorMessage}</h3>);
                </div>
            );
        }

        return this.props.children;
    }
}
