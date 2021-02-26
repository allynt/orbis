import { createSelector } from '@reduxjs/toolkit';

const baseSelector = state => state?.accounts;

export const errorSelector = createSelector(
  baseSelector,
  accounts => accounts?.error,
);

export const passwordResetStatusSelector = createSelector(
  baseSelector,
  accounts => accounts?.resetStatus,
);

export const passwordChangeStatusSelector = createSelector(
  baseSelector,
  accounts => accounts?.changeStatus,
);

export const userSelector = createSelector(
  baseSelector,
  accounts => accounts?.user,
);

export const userKeySelector = createSelector(
  baseSelector,
  accounts => accounts?.userKey,
);

export const isLoggedInSelector = createSelector(
  [userSelector, userKeySelector],
  (user, userKey) => !!user && !!userKey,
);

export const isLoadingSelector = createSelector(
  baseSelector,
  accounts => accounts?.isLoading,
);
