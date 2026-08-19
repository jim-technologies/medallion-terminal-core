import { ErrorState as WorkbenchErrorState } from '../workbench/States';
export declare function Skeleton({ component }: {
    component?: string;
}): import("react").JSX.Element;
export declare function Empty({ children, padded }: {
    children: React.ReactNode;
    padded?: boolean;
}): import("react").JSX.Element;
export { WorkbenchErrorState as ErrorState };
