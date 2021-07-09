import React, { createContext, useContext, useState } from 'react';

import { ViewMode } from '@nebula.gl/edit-modes';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { featureCollection } from '@turf/turf';

const DEFAULT_FEATURE = {
  type: 'Feature',
  properties: {
    shape: 'Circle',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [-4.381320800781468, 56.97020266984809],
        [-4.592365430087219, 56.96437401909388],
        [-4.801184061789574, 56.946949637319165],
        [-5.0055804399609185, 56.91811340552289],
        [-5.203417102886703, 56.878169043734424],
        [-5.392643088156261, 56.827536057312464],
        [-5.571319691408655, 56.76674419593301],
        [-5.737643763558343, 56.696426551919906],
        [-5.889968133527918, 56.61731145066716],
        [-6.02681885737635, 56.530213305487074],
        [-6.146909113072742, 56.436022621873796],
        [-6.249149676159192, 56.33569534192298],
        [-6.332656019130685, 56.23024171892002],
        [-6.396752171716454, 56.12071490564522],
        [-6.440971557006829, 56.00819942872644],
        [-6.465055077671774, 55.893799706505405],
        [-6.468946766921658, 55.77862875052428],
        [-6.452787341145979, 55.66379717198518],
        [-6.416905997059021, 55.55040259538621],
        [-6.3618107880591195, 55.439519562832466],
        [-6.288177895103731, 55.33218999493162],
        [-6.196840079547844, 55.22941425819498],
        [-6.0887745718111335, 55.13214287479224],
        [-5.965090612892312, 55.04126889851379],
        [-5.827016827745494, 54.9576209709103],
        [-5.67588857208365, 54.881957063739456],
        [-5.5131353585875225, 54.81495890791374],
        [-5.340268435711334, 54.75722710492417],
        [-5.1588685628997775, 54.70927691399855],
        [-4.970574000408801, 54.671534706817155],
        [-4.777068710195686, 54.64433508123522],
        [-4.580070746509567, 54.62791862594263],
        [-4.381320800781468, 54.6224303291389],
        [-4.18257085505337, 54.62791862594263],
        [-3.9855728913672506, 54.64433508123522],
        [-3.792067601154137, 54.671534706817155],
        [-3.603773038663161, 54.70927691399855],
        [-3.4223731658516034, 54.75722710492417],
        [-3.249506242975414, 54.81495890791374],
        [-3.0867530294792873, 54.881957063739456],
        [-2.9356247738174432, 54.9576209709103],
        [-2.797550988670625, 55.04126889851379],
        [-2.6738670297518046, 55.13214287479224],
        [-2.565801522015094, 55.22941425819498],
        [-2.474463706459206, 55.33218999493162],
        [-2.4008308135038177, 55.439519562832466],
        [-2.345735604503916, 55.55040259538621],
        [-2.3098542604169574, 55.66379717198518],
        [-2.293694834641279, 55.77862875052428],
        [-2.2975865238911637, 55.893799706505405],
        [-2.3216700445561074, 56.00819942872644],
        [-2.365889429846483, 56.12071490564522],
        [-2.429985582432253, 56.23024171892002],
        [-2.5134919254037444, 56.33569534192298],
        [-2.6157324884901945, 56.436022621873796],
        [-2.735822744186587, 56.530213305487074],
        [-2.872673468035017, 56.61731145066716],
        [-3.024997838004593, 56.696426551919906],
        [-3.191321910154283, 56.76674419593301],
        [-3.3699985134066752, 56.827536057312464],
        [-3.559224498676234, 56.878169043734424],
        [-3.7570611616020164, 56.91811340552289],
        [-3.9614575397733627, 56.946949637319165],
        [-4.1702761714757175, 56.96437401909388],
        [-4.381320800781468, 56.97020266984809],
      ],
    ],
  },
};

/**
 * @typedef {{
 *  isDrawingAoi: boolean
 *  setIsDrawingAoi: React.Dispatch<React.SetStateAction<boolean>>
 *  drawAoiLayer?: EditableGeoJsonLayer
 * }} SatellitesContextType
 */

/** @type {React.Context<SatellitesContextType>} */
const SatellitesContext = createContext(undefined);
SatellitesContext.displayName = 'SatellitesContext';

/**
 * @typedef {{
 *  defaultIsDrawingAoi?: boolean
 *  children: React.ReactNode
 * }} SatellitesProviderProps
 */

/**
 * @param {SatellitesProviderProps} props
 */
export const SatellitesProvider = ({
  defaultIsDrawingAoi = false,
  children,
}) => {
  const [isDrawingAoi, setIsDrawingAoi] = useState(defaultIsDrawingAoi);

  // This needs to be visible when drawing AOI but also after its been drawn but not when there's results
  // and not when satellites isn't visible. BUT! if it's triggered again it does need to show, even if there is results
  const drawAoiLayer = new EditableGeoJsonLayer({
    id: 'draw-aoi-layer',
    data: featureCollection([DEFAULT_FEATURE]),
    mode: ViewMode,
    selectedFeatureIndexes: [],
  });

  return (
    <SatellitesContext.Provider
      value={{
        isDrawingAoi,
        setIsDrawingAoi,
        drawAoiLayer: isDrawingAoi ? drawAoiLayer : undefined,
      }}
    >
      {children}
    </SatellitesContext.Provider>
  );
};

export const useSatellites = () => useContext(SatellitesContext);
