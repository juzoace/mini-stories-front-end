

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AddStoryButton = () => {
  const [isPulsating, setIsPulsating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsating((prev) => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-10 right-10">
      <Link
        to="/stories/add"
        className={`flex justify-center items-center bg-[#8bc34a] hover:bg-lightGreen-500 text-white text-3xl font-bold h-16 w-16 rounded-full shadow-lg ${
            isPulsating ? "animate-pulse" : ""
        }`}
    >
        +1
    </Link>

    </div>
  );
};

export default AddStoryButton;
