import React from 'react';

const Header = () => {
    return (
        <div className="flex justify-center items-center py-16 px-4">
            <div className="w-full max-w-5xl bg-green-100 rounded-xl px-10 py-16 text-center shadow-md">
                {/* Main Heading */}
                <p className="text-4xl md:text-5xl font-bold text-black mb-6">
                    Discover Customized Needs
                </p>

                {/* Small Text */}
                <p className="text-2xl font-semibold text-black mb-4">
                    Find custom clothing services tailored just for you
                </p>

                {/* Button */}
                <a
                    href="#"
                    className="inline-block bg-white px-8 py-3 rounded-full text-gray-600 text-sm font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                    Order Services
                </a>
            </div>
        </div>
    );
};

export default Header;
