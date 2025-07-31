import React from 'react';

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  loading = false,
}) => {
  // Tạo danh sách trang
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
      }
    }

    return pages;
  };

  // Sự kiện click số trang
  const handlePageClick = (page: number | string) => {
    if (!loading && typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Style cho con trỏ chuột
  const getCursorStyle = (disabled: boolean): React.CSSProperties => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  return (
    <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
      {/* Prev button */}
      <button
        className="btn btn-outline-primary disabled-not-allowed"
        disabled={loading || currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={getCursorStyle(loading || currentPage === 1)}
      >
        ← Previous
      </button>

      {/* Page numbers */}
      {generatePageNumbers().map((page, idx) => (
        <button
          key={idx}
          className={`btn ${
            page === currentPage ? 'btn-primary' : 'btn-outline-secondary'
          } disabled-not-allowed`}
          disabled={loading || typeof page !== 'number'}
          onClick={() => handlePageClick(page)}
          style={getCursorStyle(loading || typeof page !== 'number')}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        className="btn btn-outline-primary disabled-not-allowed"
        disabled={loading || currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        style={getCursorStyle(loading || currentPage === lastPage)}
      >
        Next →
      </button>
    </div>
  );
};

export default PaginationControls;
