import React, { createContext, useContext, useState } from 'react';

const DeckContext = createContext();
DeckContext.displayName = 'DeckContext';

/**
 * @typedef {Object} DeckContextType
 * @property {import('deck.gl').Deck} deck
 * @property {React.Dispatch<import('deck.gl').Deck>} setDeck
 */

/**
 *
 * @param {React.Props} props
 * @returns {React.Provider<DeckContextType>} DeckContextProvider
 */
export const DeckProvider = props => {
  const [deck, setDeck] = useState();
  return <DeckContext.Provider value={{ deck, setDeck }} {...props} />;
};

/**
 * @returns {DeckContextType} DeckContext
 */
export const useDeck = () => {
  const context = useContext(DeckContext);
  if (context === undefined) throw Error('Wrap your app with <DeckProvider />');
  return context;
};
