import { Component, type ReactNode, type ErrorInfo } from 'react';
interface Props {
    children: ReactNode;
    onError?: (error: Error) => void;
}
interface State {
    error: Error | null;
}
export declare class ErrorBoundary extends Component<Props, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    render(): string | number | bigint | boolean | import("react").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | Iterable<ReactNode> | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | import("react").ReactPortal | null | undefined> | null | undefined;
}
export {};
