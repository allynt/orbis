module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    {
      name: '@storybook/addon-essentials',
      options: {
        controls: false,
      },
    },
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],
};
