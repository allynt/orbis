module.exports = {
  staticDirs: ['../public'],
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    { name: '@storybook/addon-essentials', options: { backgrounds: false } },
    '@storybook/addon-links',
  ],
};
