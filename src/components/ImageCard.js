import React, { useState } from 'react';
import { FaSearchPlus } from 'react-icons/fa'; // Import the magnifying glass icon

function ImageCard({ title, imageUrl, isSingleImage }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // State for hover effect

  // Handle image click to expand or close (only if there are multiple images)
  const toggleExpand = () => {
    if (!isSingleImage) {
      setIsExpanded(!isExpanded);
    }
  };

  // Handle modal background click (close when clicking outside the image)
  const handleBackgroundClick = (e) => {
    if (e.target.tagName !== 'IMG') {
      setIsExpanded(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${isSingleImage ? 'mb-0' : 'mb-8'}`}>
      {/* Image Card without manually added margin-bottom for single image */}
      <div
        className={`text-gray-300 p-6 rounded-lg cursor-pointer relative w-full max-w-3xl`} // Apply flexbox with full width and limit max width
        onClick={toggleExpand}
        onMouseEnter={() => !isSingleImage && setIsHovered(true)} // Disable hover effect for single image
        onMouseLeave={() => !isSingleImage && setIsHovered(false)}
        style={isSingleImage ? { cursor: 'default' } : {}}
      >
        {/* Conditional aspect ratio container for multiple images */}
        <div className={`relative w-full ${!isSingleImage ? 'pb-[80%]' : ''}`}>
          {/* Insert the img element here */}
          <img
            src={imageUrl}
            alt={title}
            className={`${
              isSingleImage
                ? 'w-full max-w-full h-auto object-cover rounded-lg border-2 border-white'
                : 'absolute top-0 left-0 w-full h-full object-cover rounded-lg border-2 border-white'
            } transition-transform duration-300 ${isHovered ? 'scale-105 brightness-75' : ''}`}
          />

          {/* Magnifying glass icon, shown on hover */}
          {!isSingleImage && isHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSearchPlus className="text-white text-4xl" />
            </div>
          )}
        </div>

        {/* Increase margin below the image by adding mb-4 */}
        <h3 className="text-2xl font-bold mt-4 mb-4 text-center">{title}</h3> {/* Centered caption with increased gap */}
      </div>

      {/* Expanded Image Modal (disabled for a single image) */}
      {isExpanded && !isSingleImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={handleBackgroundClick}
        >
          <div className="relative p-4 max-w-4xl w-full">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto rounded-lg shadow-lg border-2 border-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCard;
