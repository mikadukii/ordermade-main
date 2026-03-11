import React from 'react';

const PortfolioCard = ({ 
  imgURL, 
  title, 
  description, 
  onClick,
  onEdit,
  isAdmin = false,
}) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all ease-in-out relative cursor-pointer w-full sm:w-80 md:w-96">
      <img
        src={imgURL || "/default-image.jpg"}  // fallback image
        alt={title}
        className="w-full h-56 object-cover rounded-t-lg"
        onClick={onClick}
      />
      <div className="p-6">
        <h5 className="text-lg font-medium text-slate-800">{title}</h5>
        <p className="text-sm text-slate-500 mt-2">{description}</p>

        <div className="flex justify-between items-center mt-4">

          {isAdmin && onEdit && (
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering onClick parent
                onEdit();
              }}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
