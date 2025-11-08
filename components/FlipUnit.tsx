import React, { useState, useEffect } from 'react';

interface FlipUnitProps {
  value: number;
}

const FlipUnit: React.FC<FlipUnitProps> = ({ value }) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value !== currentValue) {
      setPreviousValue(currentValue);
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setCurrentValue(value);
        setIsFlipping(false);
      }, 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [value, currentValue]);

  const flippingClass = isFlipping ? '[transform:rotateX(-180deg)]' : '';

  const cardSize = 'w-28 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40';
  const textSize = 'text-6xl sm:text-8xl lg:text-9xl';
  const textColor = 'text-gray-100';

  const formattedCurrentValue = currentValue.toString().padStart(2, '0');
  const formattedPreviousValue = previousValue.toString().padStart(2, '0');

  return (
    <div className={`relative ${cardSize} [perspective:400px] font-sans`}>
      {/* Background with shadow */}
      <div className="absolute inset-0 bg-neutral-900 shadow-lg rounded-md"></div>

      {/* Static bottom half */}
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-neutral-800 rounded-b-md overflow-hidden flex items-center justify-center">
        <span
          className={`${textSize} ${textColor} font-black transform -translate-y-1/2`}
        >
          {formattedCurrentValue}
        </span>
      </div>

      {/* Static top half */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-neutral-700 rounded-t-md overflow-hidden flex items-center justify-center">
        <span
          className={`${textSize} ${textColor} font-black transform translate-y-1/2`}
        >
          {formattedPreviousValue}
        </span>
      </div>

      {/* Flipping element */}
      <div
        className={`absolute top-0 left-0 w-full h-1/2 [transform-origin:bottom] [transform-style:preserve-3d] transition-transform duration-500 ease-in-out ${flippingClass} z-10`}
      >
        {/* Front side of the flip */}
        <div className="absolute w-full h-full bg-neutral-700 rounded-t-md [backface-visibility:hidden] overflow-hidden flex items-center justify-center">
          <span
            className={`${textSize} ${textColor} font-black transform translate-y-1/2`}
          >
            {formattedPreviousValue}
          </span>
        </div>

        {/* Back side of the flip */}
        <div className="absolute w-full h-full bg-neutral-800 rounded-b-md [backface-visibility:hidden] [transform:rotateX(180deg)] overflow-hidden flex items-center justify-center">
          <span
            className={`${textSize} ${textColor} font-black transform -translate-y-1/2`}
          >
            {formattedCurrentValue}
          </span>
        </div>
      </div>

      {/* Divider line */}
      <div className="absolute top-1/2 -mt-px left-0 w-full h-px bg-black z-20"></div>
    </div>
  );
};

export default FlipUnit;
