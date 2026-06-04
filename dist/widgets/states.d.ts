export declare function Skeleton({ component }: {
    component?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function Empty({ children, padded }: {
    children: React.ReactNode;
    padded?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function ErrorState({ message, onRetry }: {
    message: string;
    onRetry?: () => void;
}): import("react/jsx-runtime").JSX.Element;
