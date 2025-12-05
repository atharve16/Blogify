import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i);

  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 2) {
      return [...pages.slice(0, 3), "...", totalPages - 1];
    }

    if (currentPage >= totalPages - 3) {
      return [0, "...", ...pages.slice(totalPages - 3)];
    }

    return [0, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages - 1];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[2.5rem] px-3 py-2 rounded-lg font-medium transition-all ${
                currentPage === page
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow"
              }`}
            >
              {page + 1}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className={`flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === totalPages - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Page Info */}
      <p className="text-center mt-4 text-sm text-gray-600">
        Page <span className="font-semibold text-indigo-600">{currentPage + 1}</span> of{" "}
        <span className="font-semibold text-indigo-600">{totalPages}</span>
      </p>
    </div>
  );
};

export default Pagination;
