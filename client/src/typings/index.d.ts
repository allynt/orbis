export * from './accounts';
export * from './bookmarks';
export * from './orbis';
export * from './satellites';
// eslint-disable-next-line import/named
export { RootState } from '../root.reducer';

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
