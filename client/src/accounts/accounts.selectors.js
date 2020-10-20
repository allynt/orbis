import { createSelector } from '@reduxjs/toolkit';

const baseSelector = state => state?.accounts;

export const userSelector = createSelector(
  baseSelector,
  accounts => accounts?.user,
);

export const userKeySelector = createSelector(
  baseSelector,
  accounts => accounts?.userKey,
);

export const isLoadingSelector = createSelector(
  baseSelector,
  accounts => accounts?.isLoading,
);
