import { LayersIcon, Button, LoadMask } from '@astrosat/astrosat-ui/';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  isLoaded,
  selectedBookmarkSelector,
  isLoadingSelector as bookmarksLoadingSelector,
} from '../bookmarks/bookmark.slice';
import MapStyleSwitcher from '../mapstyle/mapstyle-switcher.component';
import layoutStyles from './map-layout.module.css';
import {
  selectMapStyle,
  viewportSelector,
  selectedMapStyleSelector,
} from './map.slice';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';
import { mapboxTokenSelector } from 'app.slice';

const Map = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector(mapboxTokenSelector);
  const viewport = useSelector(viewportSelector);
  const selectedBookmark = useSelector(selectedBookmarkSelector);
  const bookmarksLoading = useSelector(bookmarksLoadingSelector);
  const mapStyles = useSelector(state => state.app.config.mapStyles);
  const selectedMapStyle = useSelector(selectedMapStyleSelector);
  const [isMapStyleSwitcherVisible, setIsMapStyleSwitcherVisible] = useState(
    false,
  );
  const selectedStory = useSelector(state => state.stories.selectedStory);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    dispatch(isLoaded());
  }, [selectedBookmark, dispatch]);
  return (
    <>
      {bookmarksLoading && (
        <div className={layoutStyles.loadMask}>
          <LoadMask />
        </div>
      )}
      <DeckGL controller initialViewState={viewport}>
        <StaticMap
          reuseMap
          mapboxApiAccessToken={accessToken}
          mapStyle={selectedMapStyle?.uri}
        />
      </DeckGL>
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
          selectMapStyle={mapStyle => dispatch(selectMapStyle(mapStyle))}
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
