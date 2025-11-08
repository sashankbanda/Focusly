
import React from 'react';

interface DateDisplayProps {
  date: Date;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  return (
    <div className="text-center">
      <p className="text-xl sm:text-2xl lg:text-3xl text-zinc-500 dark:text-zinc-400 tracking-wide">
        {formattedDate}
      </p>
    </div>
  );
};

export default DateDisplay;