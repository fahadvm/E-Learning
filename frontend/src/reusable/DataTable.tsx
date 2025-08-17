"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type Column<T> = {
  key: keyof any;
  label: string;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onDetailClick?: (row: T) => void;
  searchPlaceholder?: string;
  currentPage: number;
  totalPages: number;
  onSearch?: (term: string) => void;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onDetailClick,
  searchPlaceholder = "Search data...",
  currentPage,
  totalPages,
  onSearch,
  onPageChange,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl rounded-2xl p-6 max-w-7xl mx-auto border border-gray-600 transition-all duration-300">
      {/* Search Bar */}


      <div className="mb-6 flex items-center gap-3 bg-gray-700/50 rounded-full px-4 py-2 transition-all duration-200 hover:ring-2 hover:ring-blue-500/50">
        <Search className="text-gray-300 w-5 h-5" aria-hidden="true" />
        <input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-gray-100 placeholder-gray-400 text-sm font-medium focus:ring-0"
          aria-label="Search table data"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-600">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-800/80 border-b border-gray-600">
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className="px-6 py-4 font-semibold text-gray-200 uppercase tracking-wide text-xs"
                >
                  {col.label}
                </th>
              ))}
              {onDetailClick && (
                <th className="px-6 py-4 font-semibold text-gray-200 uppercase tracking-wide text-xs">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onDetailClick ? 1 : 0)}
                  className="text-center py-8 text-gray-400 text-base"
                >
                  No results found. Try adjusting your search.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-600/50 hover:bg-gray-700/50 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td key={col.key as string} className="px-6 py-4 text-gray-100">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {onDetailClick && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onDetailClick(row)}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 flex items-center gap-1"
                      >
                        View
                      </button>

                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-between items-center gap-4 flex-wrap">
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-700 transition-all duration-200 flex items-center gap-1"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange && onPageChange(page)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${currentPage === page
                    ? "bg-blue-600 text-white border border-blue-500"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-white"
                  }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:hover:bg-gray-700 transition-all duration-200 flex items-center gap-1"
              aria-label="Next page"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}