import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/store.ts";
import { fetchBreeds } from "./breedsSlice.ts";
import BreedCard from "../../components/BreedCard.tsx";
import PaginationControls from "../../components/PaginationControls.tsx";

const BreedsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, pagination } = useSelector(
    (state: RootState) => state.breeds
  );
  const groups = useSelector((state: RootState) => state.groups.list);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchBreeds(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-primary">All Breeds</h3>

      {loading && <div className="alert alert-info">Loading...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-2 g-3 align-items-stretch">
        {!loading &&
          list.map((breed) => {
            const groupId = breed.relationships?.group?.id;
            const groupName =
              groups.find((g) => g.id === groupId)?.attributes?.name || "Unknown";

            return (
              <div className="col" key={breed.id}>
                <BreedCard
                  id={breed.id}
                  attributes={breed.attributes}
                  groupName={groupName}
                />
              </div>
            );
          })}
      </div>

      {pagination && (
        <div className="mt-4">
          <PaginationControls
            currentPage={pagination?.current || 1}
            lastPage={Math.ceil((pagination?.records || 10) / 10)}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default BreedsList;
