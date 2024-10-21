import React from 'react';

function ImageGrid({ children, columns }) {
  const columnsClassMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const columnsClass = columnsClassMap[columns] || 'grid-cols-1';

  // Check if there's only one image
  const isSingleImage = React.Children.count(children) === 1;

  return (
    <div className={`grid ${isSingleImage ? 'place-items-center' : columnsClass} gap-4 w-full`}>
      {React.Children.map(children, (child) => {
        // Pass the isSingleImage prop to ImageCard
        return React.cloneElement(child, { isSingleImage });
      })}
    </div>
  );
}

export default ImageGrid;
