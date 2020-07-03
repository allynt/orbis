import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@astrosat/astrosat-ui/dist/buttons/button';

import LoadMask from '@astrosat/astrosat-ui/dist/load-mask/load-mask';
import { LayersIcon } from '@astrosat/astrosat-ui/';

import { selectMapStyle } from './map.slice';
import { isLoaded } from '../bookmarks/bookmark.slice';

import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';

import layoutStyles from './map-layout.module.css';

const Map = ({
  style = 'mapbox://styles/mapbox/satellite-v9',
  attribution = true,
  geocoder = true,
  navigation = true,
  scale = true,
  draw = true,
  layoutInvalidation,
  position,
  setMap,
  compare,
  selectedPinnedScenes,
  comparisonScene,
}) => {
  const [isMapStyleSwitcherVisible, setIsMapStyleSwitcherVisible] = useState(
    false,
  );
  const mapStyles = useSelector(state => state.app.config.mapStyles);
  const selectedMapStyle = useSelector(state => state.map.selectedMapStyle);
  const chooseMapStyle = mapStyle => dispatch(selectMapStyle(mapStyle));

  const selectedBookmark = useSelector(
    state => state.bookmarks.selectedBookmark,
  );

  const selectedStory = useSelector(state => state.stories.selectedStory);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const isLoading = useSelector(state => state.bookmarks.isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(isLoaded());
  }, [selectedBookmark, dispatch]);

  return (
    <>
      {isLoading && (
        <div className={layoutStyles.loadMask}>
          <LoadMask />
        </div>
      )}

      <Button
        theme="secondary"
        onClick={() => setIsMapStyleSwitcherVisible(!isMapStyleSwitcherVisible)}
        classNames={[layoutStyles.mapStyleButton]}
      >
        <LayersIcon classes={layoutStyles.icon} />
      </Button>
      {isMapStyleSwitcherVisible && (
        <MapStyleSwitcher
          mapStyles={mapStyles || []}
          selectedMapStyle={selectedMapStyle}
          selectMapStyle={chooseMapStyle}
        />
      )}

      {selectedStory && (
        <div className={`${layoutStyles.story} step`}>
          {selectedStory && (
            <div>
              <h1>{selectedStory.title}</h1>
              <h3>{selectedStory.subtitle}</h3>

              {selectedChapter && (
                <div className={layoutStyles.chapter}>
                  <picture>
                    <img
                      src={selectedChapter.image}
                      alt={selectedChapter.title}
                    />
                  </picture>

                  <section>{selectedChapter.description}</section>
                </div>
              )}

              <div className={layoutStyles.buttons}>
                <Button
                  theme="tertiary"
                  onClick={() => {
                    if (selectedChapter) {
                      let index = selectedStory.chapters.indexOf(
                        selectedChapter,
                      );
                      const previousChapter = selectedStory.chapters[--index];
                      if (previousChapter) {
                        setSelectedChapter(previousChapter);
                      }
                    }
                  }}
                >
                  Previous
                </Button>
                <Button
                  theme="Primary"
                  onClick={() => {
                    if (selectedChapter) {
                      let index = selectedStory.chapters.indexOf(
                        selectedChapter,
                      );
                      const nextChapter = selectedStory.chapters[++index];
                      if (nextChapter) {
                        setSelectedChapter(nextChapter);
                      }
                    }
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(Map);
