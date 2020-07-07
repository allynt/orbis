import React, { useReducer, useRef } from 'react';
// import ReactDOM from 'react-dom';

// import { useDispatch } from 'react-redux';

import mapboxgl from 'mapbox-gl';
import useMap from '../map/use-map.hook';
import { useMapEvent } from '../map/use-map-event.hook';

// import Slider from 'rc-slider'
import { scalePow } from 'd3-scale';

import { Button, Slider } from '@astrosat/astrosat-ui';

import {
  RulerIcon,
  PolygonIcon,
  MapPinIcon,
  FreehandIcon,
  RadiusIcon,
  DrawCircleIcon,
  // RotateIcon,
  // ImageIcon,
  LineWidth1pxIcon,
  LineWidth2pxIcon,
  LineWidth3pxIcon,
  LineTypeSolidIcon,
  LineTypeDashedIcon,
  LineTypeDottedIcon,
} from '@astrosat/astrosat-ui/';

// import { ReactComponent as FontIcon } from './font.svg';
// import { ReactComponent as LabelIcon } from './label.svg';

import ColorPicker from './color-picker.component';
import DropDownButton from './drop-down-button.component';
import ReactTooltip from 'react-tooltip';
// import TextDialog from './text-dialog.component';
// import LabelForm from './label-form.component';
import ImageForm from './image-form.component';

// import { setTextLabelSelected } from './annotations.actions';

import styles from './annotations-panel.module.css';
import sideMenuStyles from '../side-menu/side-menu.module.css';

const lineWidthOptions = [
  {
    id: 'lineWidth1',
    icon: <LineWidth1pxIcon classes={styles.icon} />,
    value: 1,
    tooltip: 'Set Line Width to 1px',
  },
  {
    id: 'lineWidth2',
    icon: <LineWidth2pxIcon classes={styles.icon} />,
    value: 5,
    tooltip: 'Set Line Width to 2px',
  },
  {
    id: 'lineWidth3',
    icon: <LineWidth3pxIcon classes={styles.icon} />,
    value: 10,
    tooltip: 'Set Line Width to 3px',
  },
];

const lineTypeOptions = [
  {
    id: 'solid',
    icon: <LineTypeSolidIcon classes={styles.icon} />,
    value: false,
    tooltip: 'Set Line Type to Solid',
  },
  {
    id: 'dashed',
    icon: <LineTypeDashedIcon classes={styles.icon} />,
    value: [2, 1],
    tooltip: 'Set Line Type to Dashed',
  },
  {
    id: 'dotted',
    icon: <LineTypeDottedIcon classes={styles.icon} />,
    value: [1, 1],
    tooltip: 'Set Line Type to Dotted',
  },
];

const initialState = {
  lineColourSelected: false,
  lineColour: { hex: '#fff' },
  fillColourSelected: false,
  fillColour: { hex: '#fff' },
  mode: 'simple_select',
  lineWidthSelected: false,
  lineWidthOption: lineWidthOptions[0],
  lineTypeSelected: false,
  lineTypeOption: lineTypeOptions[0],
  fillOpacity: 0.5,
  textLabelSelected: false,
  addImageSelected: false,
  imageUrl: '',
};

const SET_FILL_COLOUR_SELECTED = 'SET_FILL_COLOUR_SELECTED';
const SET_FILL_COLOUR = 'SET_FILL_COLOUR';
const SET_FILL_OPACITY = 'SET_FILL_OPACITY';
const SET_LINE_COLOUR_SELECTED = 'SET_LINE_COLOUR_SELECTED';
const SET_LINE_COLOUR = 'SET_LINE_COLOUR';
const SET_DRAW_MODE = 'SET_DRAW_MODE';
const SET_LINE_WIDTH_SELECTED = 'SET_LINE_WIDTH_SELECTED';
const SET_LINE_WIDTH = 'SET_LINE_WIDTH';
const SET_LINE_TYPE_SELECTED = 'SET_LINE_TYPE_SELECTED';
const SET_LINE_TYPE = 'SET_LINE_TYPE';
const SET_TEXT_LABEL_SELECTED = 'SET_TEXT_LABEL_SELECTED';
const ADD_IMAGE_SELECTED = 'ADD_IMAGE_SELECTED';
const ADD_IMAGE = 'ADD_IMAGE';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LINE_COLOUR_SELECTED:
      return { ...state, lineColourSelected: !state.lineColourSelected };
    case SET_LINE_COLOUR:
      return { ...state, lineColour: action.colour };

    case SET_FILL_COLOUR_SELECTED:
      return { ...state, fillColourSelected: !state.fillColourSelected };
    case SET_FILL_COLOUR:
      return { ...state, fillColour: action.colour };

    case SET_FILL_OPACITY:
      return { ...state, fillOpacity: action.opacity };

    case SET_DRAW_MODE:
      return { ...state, mode: action.mode };

    case SET_LINE_WIDTH_SELECTED:
      return { ...state, lineWidthSelected: !state.lineWidthSelected };
    case SET_LINE_WIDTH:
      return { ...state, lineWidthOption: action.option };

    case SET_LINE_TYPE_SELECTED:
      return { ...state, lineTypeSelected: !state.lineTypeSelected };
    case SET_LINE_TYPE:
      return { ...state, lineTypeOption: action.option };

    case SET_TEXT_LABEL_SELECTED:
      return { ...state, textLabelSelected: !state.textLabelSelected };

    case ADD_IMAGE_SELECTED:
      return { ...state, addImageSelected: !state.addImageSelected };
    case ADD_IMAGE:
      console.log('SET IMAGE URL: ', action.imageUrl);
      return { ...state, imageUrl: action.imageUrl };

    default:
      throw new Error('Unknown Action Type: ', action.type);
  }
};

const AnnotationsPanel = ({ map }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    lineColourSelected,
    lineColour,
    fillColourSelected,
    fillColour,
    fillOpacity,
    mode,
    lineWidthSelected,
    lineWidthOption,
    lineTypeSelected,
    lineTypeOption,
    textLabelSelected,
    addImageSelected,
    imageUrl,
  } = state;

  const drawOptions = {
    fillColour: fillColour.hex,
    lineColour: lineColour.hex,
    lineWidth: lineWidthOption.value,
    lineTypeName: lineTypeOption.id,
    lineType: lineTypeOption.value,
    fillOpacity,
    imageUrl,
  };

  const popupRef = useRef(null);

  useMap(
    map,
    mapInstance => {
      const drawCtrl = mapInstance._controls.find(ctrl => ctrl.changeMode);
      // console.log('DRAW CTRL STYLE: ', mode, drawCtrl);
      if (drawCtrl) {
        // mapInstance.on('draw.selectionchange', event => {
        //   console.log('SELECTION CHANGE: ', event, drawCtrl.getMode());
        // });
        // mapInstance.on('draw.create', event => {
        //   console.log('CREATE EVENT: ', event, drawCtrl.getAll());
        // });
        // mapInstance.on('draw.render', event => {
        //   console.log('RENDER EVENT: ', event, drawCtrl.getAll());
        // });
        // mapInstance.on('draw.update', event => {
        //   console.log('UPDATE EVENT: ', event, drawCtrl.getAll());
        // });
        // mapInstance.on('draw.modechange', event => {
        //   console.log('MODE CHANGE: ', event);
        // });
        if (mode !== 'trash' && mode !== 'deleteAll') {
          drawCtrl.changeMode(mode, drawOptions);
        } else {
          if (mode === 'deleteAll') {
            drawCtrl.deleteAll();
          } else {
            drawCtrl.trash();
          }
        }
      }
    },
    [mode, drawOptions],
  );

  useMapEvent(
    map,
    'click',
    event => {
      event.preventDefault();
      const { lngLat } = event;
      // console.log('FEATURES');

      // When user clicks map open Label Editor.
      if (!popupRef.current) {
        popupRef.current = document.createElement('div');
      }

      // Only take the first feature, which should be the top most
      // feature and the one you meant.
      if (textLabelSelected) {
        console.log('POPUP CONTENT: ', popupRef);
        new mapboxgl.Popup()
          // .setLngLat(features[0].geometry.coordinates.slice())
          .setLngLat(lngLat)
          .setDOMContent(popupRef.current)
          .on('close', () => console.log('Closing Popup'))
          .addTo(map);
      }
    },
    [textLabelSelected],
  );

  return (
    <div className={styles.panel}>
      <div className={styles.drawingOptions}>
        <div className={styles.options}>
          <h4 className={styles.header}>Annotations Style</h4>
          <div className={styles.annotationButtonsRow}>
            <Button
              classNames={[styles.annotationButtons]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'LabelMode' })
              }
              dataFor="textLabel"
            >
              <span className={styles.text}>T</span>
              <span className={styles.buttonLabel}>Text</span>
            </Button>
            <ReactTooltip id="textLabel">
              <span>Text Label</span>
            </ReactTooltip>

            <div className={styles.colorPickerContainer}>
              <Button
                classNames={[styles.annotationButtons]}
                onClick={() => dispatch({ type: SET_FILL_COLOUR_SELECTED })}
                dataFor="fillColour"
              >
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: fillColour.hex,
                  }}
                ></span>
                <span className={styles.buttonLabel}>Fill</span>
              </Button>
              <ReactTooltip id="fillColour">
                <span>Set Fill Colour</span>
              </ReactTooltip>

              {fillColourSelected && (
                <div className={styles.colorPicker}>
                  <ColorPicker
                    colour={fillColour}
                    setColour={colour =>
                      dispatch({ type: SET_FILL_COLOUR, colour })
                    }
                  />
                </div>
              )}
            </div>

            <div className={styles.colorPickerContainer}>
              <Button
                classNames={[styles.annotationButtons]}
                onClick={() => dispatch({ type: SET_LINE_COLOUR_SELECTED })}
                dataFor="lineColour"
              >
                <span
                  style={{
                    width: '1rem',
                    height: '1rem',
                    backgroundColor: lineColour.hex,
                  }}
                ></span>
                <span className={styles.buttonLabel}>Line</span>
              </Button>
              <ReactTooltip id="lineColour">
                <span>Set Line Colour</span>
              </ReactTooltip>

              {lineColourSelected && (
                <div className={styles.colorPicker}>
                  <ColorPicker
                    colour={lineColour}
                    setColour={colour =>
                      dispatch({ type: SET_LINE_COLOUR, colour })
                    }
                  />
                </div>
              )}
            </div>

            {/* Font-select button - may be re-added later.

            <Button classNames={[styles.annotationButtons]} onClick={() => console.log('Change Font')} dataFor="font">
              <FontIcon className={styles.icon} />
            </Button>
            <ReactTooltip id="font">
              <span>Change Font</span>
            </ReactTooltip> */}
          </div>
        </div>
        <div className={styles.lineButtons}>
          <Button
            classNames={[styles.lineButton]}
            onClick={() => dispatch({ type: SET_LINE_TYPE_SELECTED })}
            dataFor="lineType"
          >
            {lineTypeOption.icon}
          </Button>
          <ReactTooltip id="lineType">
            <span>Set Line Type</span>
          </ReactTooltip>

          {lineTypeSelected && (
            <div>
              <h3>Select line type: </h3>
              <DropDownButton
                options={lineTypeOptions}
                select={option => dispatch({ type: SET_LINE_TYPE, option })}
              />
            </div>
          )}

          <Button
            classNames={[styles.lineButton]}
            onClick={() => dispatch({ type: SET_LINE_WIDTH_SELECTED })}
            dataFor="lineWidth"
          >
            {lineWidthOption.icon}
          </Button>
          <ReactTooltip id="lineWidth">
            <span>Set Line Width</span>
          </ReactTooltip>

          {lineWidthSelected && (
            <div>
              <h3>Select line width: </h3>
              <DropDownButton
                options={lineWidthOptions}
                select={option => dispatch({ type: SET_LINE_WIDTH, option })}
              />
            </div>
          )}
        </div>

        <div className={styles.slider}>
          <h4 className={styles.header}>Opacity %:</h4>
          <Slider
            scale={scalePow().domain([0, 100])}
            values={[0]}
            onChange={opacity => dispatch({ type: SET_FILL_OPACITY, opacity })}
          />
        </div>
      </div>

      <div className={styles.drawingToolsContainer}>
        <div>
          <h4 className={styles.header}>Select Drawing Tool</h4>
          <div className={styles.drawingTools}>
            <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'LineMode' })
              }
              dataFor="drawLineString"
            >
              <RulerIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="drawLineString">
              <span>Draw LineString</span>
            </ReactTooltip>

            <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'PolygonMode' })
              }
              dataFor="drawPolygon"
            >
              <PolygonIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="drawPolygon">
              <span>Draw Polygon</span>
            </ReactTooltip>

            {/*
            THIS AND THE IMAGE UPLOAD TOOL (BOTTOM ONE) WERE REMOVED
            BECAUSE THEY DON'T FEATURE IN THE DESIGNS AND MAY NOT BE INCLUDED IN THE APP.
            COMMENTED OUT BECAUSE THEY MAY BE USED LATER.
            */}
            {/* <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'RotateMode' })}
              dataFor="rotate"
            >
              <RotateIcon className={styles.icon} />
            </Button>
            <ReactTooltip id="rotate">
              <span>Rotate Shape</span>
            </ReactTooltip> */}

            <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'draw_point' })
              }
              dataFor="drawPoint"
            >
              <MapPinIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="drawPoint">
              <span>Place Point</span>
            </ReactTooltip>

            <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'CircleMode' })
              }
              dataFor="drawCircle"
            >
              <DrawCircleIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="drawCircle">
              <span>Draw Circle</span>
            </ReactTooltip>

            <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'FreehandPolygonMode' })
              }
              dataFor="drawFreehandPolygon"
            >
              <FreehandIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="drawFreehandPolygon">
              <span>Draw Freehand Polygon</span>
            </ReactTooltip>

            <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() =>
                dispatch({ type: SET_DRAW_MODE, mode: 'RadiusMode' })
              }
              dataFor="radius"
            >
              <RadiusIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="radius">
              <span>Radius Shape</span>
            </ReactTooltip>

            {/* <Button
              classNames={[styles.drawingToolsButton]}
              onClick={() => dispatch({ type: ADD_IMAGE_SELECTED })}
              dataFor="image"
            >
              <ImageIcon classes={styles.icon} />
            </Button>
            <ReactTooltip id="image">
              <span>Add Image</span>
            </ReactTooltip> */}
          </div>
        </div>

        {addImageSelected && (
          <ImageForm
            submit={imageUrl => {
              dispatch({ type: ADD_IMAGE, imageUrl });
              dispatch({ type: SET_DRAW_MODE, mode: 'ImageMode' });
            }}
          />
        )}

        <div className={sideMenuStyles.buttons}>
          <Button
            classNames={[sideMenuStyles.button]}
            onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'trash' })}
            dataFor="deleteAnnotations"
          >
            Delete
          </Button>
          <ReactTooltip id="deleteAnnotations">
            <span>Delete Annotation</span>
          </ReactTooltip>

          <Button
            classNames={[sideMenuStyles.button]}
            theme="tertiary"
            onClick={() => dispatch({ type: SET_DRAW_MODE, mode: 'deleteAll' })}
            dataFor="deleteAllAnnotations"
          >
            Delete All
          </Button>
          <ReactTooltip id="deleteAllAnnotations">
            <span>Delete All Annotations</span>
          </ReactTooltip>
        </div>
      </div>

      {/* {textLabelSelected &&
        popupRef.current &&
        ReactDOM.createPortal(
          <div className={styles.popup}>
            <LabelForm submit={addLabel} />
          </div>,
          popupRef.current
        )} */}
    </div>
  );
};

export default AnnotationsPanel;
