import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBreeds } from "./breedsSlice.ts";
import { RootState, AppDispatch } from "../../components/store";
import BreedCard from "../../components/BreedCard.tsx";
import PaginationControls from "../../components/PaginationControls.tsx";
import "bootstrap/dist/css/bootstrap.min.css";

function BreedsList() {
  const dispatch = useDispatch<AppDispatch>();
  const breeds = useSelector((state: RootState) => state.breeds.list);
  const loading = useSelector((state: RootState) => state.breeds.loading);
  const error = useSelector((state: RootState) => state.breeds.error);
  const pagination = useSelector((state: RootState) => state.breeds.pagination);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBreeds(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🐶 Dog Breed List</h2>

      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          Error: {error}
        </div>
      )}

      {!loading && !error && breeds.length === 0 && (
        <div className="alert alert-warning text-center" role="alert">
          No breeds found.
        </div>
      )}

      <div className="my-4">
        {breeds.map((breed) => (
          <div className="row my-3" key={breed.id}>
            <BreedCard id={breed.id} attributes={breed.attributes} />
          </div>
        ))}
      </div>

      {/* Tái sử dụng PaginationControls */}
      <PaginationControls
        currentPage={pagination?.current || 1}
        lastPage={Math.ceil((pagination?.records || 10) / 10)}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}

export default BreedsList;
