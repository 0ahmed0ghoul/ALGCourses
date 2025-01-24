import React from "react";

const Pagination = ({ currentPage, totalPages, changePage }) => {
  return (
    <div className="pagination">
      {/* Previous Button */}
      <button
        className="btn-page"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        &laquo;
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button
          key={page}
          className={`btn-page ${currentPage === page ? "active" : ""}`}
          onClick={() => changePage(page)}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        className="btn-page"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
