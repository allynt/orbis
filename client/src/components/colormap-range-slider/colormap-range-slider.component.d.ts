export type StyleProps = {
  brushStyle: React.CSSProperties;
  handleStyle: React.CSSProperties;
  tickLabelStyle: React.CSSProperties;
};

type SharedProps = {
  color?: ColorMap;
  height: number;
  padding: import('victory').VictoryChartProps['padding'];
  onChange?: (domain: [number, number]) => void;
} & StyleProps;

export type ContinuousColorMapRangeSliderProps = {
  units?: string;
  domain?: [number, number];
  precision?: number;
} & SharedProps;

export type DecileColorMapRangeSliderProps = {
  snap?: boolean;
} & SharedProps;

export type ColorMapRangeSliderProps = {
  type: PropertyType;
} & (ContinuousColorMapRangeSliderProps | DecileColorMapRangeSliderProps);

declare const ColorMapRangeSlider: React.FunctionComponent<ColorMapRangeSliderProps>;

export default ColorMapRangeSlider;
