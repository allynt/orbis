import featureToggles from '../feature-toggles';

const key = 'feature-toggles';

// update featureToggles with what's in localStorage
try {
  Object.assign(featureToggles, JSON.parse(window.localStorage.getItem(key)));
} catch (error) {
  window.localStorage.removeItem(key);
}

const persist = () =>
  window.localStorage.setItem(key, JSON.stringify(featureToggles));

function enable(name) {
  featureToggles[name] = true;
  persist();
}

function disable(name) {
  featureToggles[name] = false;
  persist();
}

export default featureToggles;
export { enable, disable };
