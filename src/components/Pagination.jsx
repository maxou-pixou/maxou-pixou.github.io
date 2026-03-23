import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Pagination({ total, per_page = 10, currentPage = 1, onNext = () => { }, onPrevious = () => { } }) {
  const totalPages = Math.ceil(total / per_page);

  return (
    total > 0 && (
      <div className="flex justify-between items-center">
        <div className="rounded-lg shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-300 px-4 py-2 text-sm font-medium">
          Page {currentPage} sur {totalPages}
        </div>

        <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm bg-white" aria-label="Pagination">
          <button
            disabled={currentPage <= 1}
            onClick={onPrevious}
            className="relative inline-flex items-center rounded-l-lg px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-black focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IoIosArrowBack className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">{currentPage}</span>
          <button
            disabled={currentPage * per_page >= total}
            onClick={onNext}
            className="relative inline-flex items-center rounded-r-lg px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:text-black focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <IoIosArrowForward className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    )
  );
}
