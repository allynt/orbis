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

export const minimalUserSelector = createSelector(
  baseSelector,
  accounts => accounts?.minimalUser,
);

export const userKeySelector = createSelector(
  baseSelector,
  accounts => accounts?.userKey,
);

export const isLoggedInSelector = createSelector(
  baseSelector,
  accounts => !!accounts.userKey && !!accounts.user,
);

export const isLoadingSelector = createSelector(
  baseSelector,
  accounts => accounts?.isLoading,
);
