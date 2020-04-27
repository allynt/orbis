import useMap from './use-map.hook';

const useMapControl = (map, cond, control, position, ...args) => {
  useMap(
    map,
    map => {
      if (cond) {
        const ctrl = new control(...args);
        position ? map.addControl(ctrl, position) : map.addControl(ctrl);
        return () => map.removeControl(ctrl);
      }
    },
    [cond],
  );
};

export default useMapControl;
