export type RemoveProps<T, K> = Omit<T, keyof K>;
export type Override<T, K> = RemoveProps<T, K> & K;
export type FilterReactProps<T, K> = Override<RemoveProps<T, { defaultChecked?: boolean }>, K>;

export type HTMLProps<T, U> = FilterReactProps<React.HTMLAttributes<T>, U>;