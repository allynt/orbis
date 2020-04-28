import React from 'react';
import ReactDOM from 'react-dom';

export const FiltersForm = () => {
  return ReactDOM.createPortal(
    <div>
      <form>
        <div>
          <button type="submit">Add Filters</button>
        </div>
      </form>
    </div>,
    document.body,
  );
};
