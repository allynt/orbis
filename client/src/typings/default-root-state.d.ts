// eslint-disable-next-line import/named
import { RootState } from '../root.reducer';

declare module 'react-redux' {
  interface DefaultRootState extends RootState {}
}
