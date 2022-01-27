import { rest } from 'msw';
import { v4 as uuidv4 } from 'uuid';

import { userKey, users } from 'mocks/fixtures/auth';

const URL_PATH = '*/api/authentication/';

const login = rest.post(`${URL_PATH}login/`, (req, res, ctx) => {
  const userAttemptingLogin = req.body;

  const existingUser = users.find(
    user => user.email === userAttemptingLogin.email,
  );

  if (!existingUser || userAttemptingLogin.password !== existingUser.password) {
    return res(
      ctx.status(400),
      ctx.json({
        errors: {
          non_field_errors: ['Unable to log in with provided credentials.'],
        },
      }),
    );
  }

  sessionStorage.setItem('current-user', JSON.stringify(existingUser));

  return res(ctx.status(200), ctx.json(existingUser));
});

const logout = rest.post(`${URL_PATH}logout/`, (req, res, ctx) => {
  sessionStorage.removeItem('current-user');
  return res(ctx.status(200), ctx.json(userKey));
});

const registerUser = rest.post(`${URL_PATH}registration/`, (req, res, ctx) => {
  const details = req.body;

  const existingUser = users.find(user => user.email === details.email);

  if (existingUser) {
    return res(
      ctx.status(400),
      ctx.json({
        errors: {
          email: ['A user is already registered with this e-mail address.'],
        },
      }),
    );
  }
  const user = {
    id: uuidv4(),
    name: null,
    description: '',
    is_verified: false,
    is_approved: false,
    profiles: {},
    roles: [],
    ...details,
  };

  users.push(user);

  return res(ctx.status(200), ctx.json(userKey));
});

const verifyEmail = rest.post(
  `${URL_PATH}registration/verify-email/`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ email: 'test@test.com', name: 'Test User' }),
    );
  },
);

const sendVerificationEmail = rest.post(
  `${URL_PATH}send-email-verification/`,
  (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ email: 'test@other.com' }));
  },
);

const changePassword = rest.post(
  `${URL_PATH}password/change`,
  (req, res, ctx) => {
    const oldPassword = req.body.old_password;
    const newPassword = req.body.new_password1;
    console.log(`Changing User Password from ${oldPassword} to ${newPassword}`);

    const user = users.find(user => user.password === oldPassword);
    // const user = users.find(user => user.username === currentUser.username);
    const currentUser = JSON.parse(sessionStorage.getItem('current-user'));

    if (currentUser.password === oldPassword) {
      if (req.body.new_password1 === 'razorpelicanturf') {
        return res(ctx.status(400), ctx.json({ message: 'Some Error' }));
      } else {
        user.password = newPassword;
        currentUser.password = newPassword;

        return res(ctx.status(200), ctx.json(user));
      }
    }
  },
);

const resetPasswordRequest = rest.post(
  `${URL_PATH}password/reset/`,
  (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ email: 'test@test.com' }));
  },
);

const resetPasswordVerify = rest.post(
  `${URL_PATH}password/verify-reset/`,
  (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        email: 'test@test.com',
      }),
    );
  },
);

const handlers = [
  login,
  logout,
  registerUser,
  verifyEmail,
  sendVerificationEmail,
  changePassword,
  resetPasswordRequest,
  resetPasswordVerify,
];

export default handlers;
