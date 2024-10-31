import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

function Navbar({ parentSections }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className="bg-black text-gray-300 border-b border-gray-700 md:border-b-0 md:border-r w-full md:w-64 md:h-screen md:fixed overflow-y-auto"
      style={{
        scrollbarWidth: 'none', // Firefox hides scrollbar
        msOverflowStyle: 'none', // IE 10+ hides scrollbar
        overscrollBehavior: 'contain', // Prevent scrolling the main screen while hovering
      }}
    >
      <div className="p-4 flex items-center justify-between md:block">
        <a href="#top">
          <h2 className="text-2xl md:text-3xl font-bold text-indigo-500 text-center md:text-left cursor-pointer mb-2 md:mb-4">
            Image Stitching
          </h2>
        </a>
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={toggleMenu}
        >
          <FaBars />
        </button>
      </div>

      <div className={`md:block ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-6 p-4 pt-2 md:pt-0 md:p-6">
          {parentSections.map((parent) => (
            <li key={parent.id} className="group">
              <a
                href={`#${parent.id}`}
                className="relative block text-lg md:text-xl py-2 transition-all duration-300 group-hover:text-indigo-500"
              >
                {parent.title}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <ul className="pl-4 mt-2 space-y-3">
                {parent.sections.map((section) => (
                  <li key={section.id} className="group">
                    <a
                      href={`#${section.id}`}
                      className="relative block text-base md:text-lg text-gray-400 transition-all duration-300 hover:text-indigo-400 hover:scale-105 hover:shadow-lg"
                    >
                      {section.title}
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-indigo-400 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional styling to hide the scrollbar on WebKit browsers */}
      <style jsx>{`
        nav::-webkit-scrollbar {
          display: none; /* Hide scrollbar on Chrome, Safari, Opera */
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
