export interface OrderLevelData {
    price: number;
    size: number;
}
export interface OrderBookData {
    bids: OrderLevelData[];
    asks: OrderLevelData[];
    mid?: number;
    spread?: number;
    venue?: string;
}
export interface DepthPoint {
    price: number;
    side: 'bid' | 'ask';
    cumulative: number;
}
export declare function normalizeOrderBook(data: unknown): OrderBookData | null;
export declare function cumulativeDepth(book: OrderBookData, maxLevels?: number, mode?: 'size' | 'notional'): DepthPoint[];
