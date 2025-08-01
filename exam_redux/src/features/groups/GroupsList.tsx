import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../components/store.ts";
import { fetchGroups } from "./groupsSlice.ts";
import {
  fetchGroupDetail,
  setGroupPage,
  selectCurrentBreedsPage,
  selectTotalBreedPages,
} from "./groupDetailsSlice.ts";
import { fetchBreedById } from "../breeds/breedDetailsMapSlice.ts";
import PaginationControls from "../../components/PaginationControls.tsx";
import BreedsList from "../breeds/BreedsList.tsx";
import BreedCard from "../../components/BreedCard.tsx";
import FactsList from "../facts/FactsList.tsx";

const GroupsList: React.FC = () => {
  const dispatch = useDispatch();
  const [showAllBreeds, setShowAllBreeds] = useState(true);

  const { list, status, error, currentPage } = useSelector(
    (state: RootState) => state.groups
  );

  const groupDetail = useSelector((state: RootState) => state.groupDetails);
  const breedsInPage = useSelector(selectCurrentBreedsPage);
  const totalBreedPages = useSelector(selectTotalBreedPages);
  const breedDetailsMap = useSelector(
    (state: RootState) => state.breedDetailsMap.breeds
  );

  useEffect(() => {
    dispatch(fetchGroups(currentPage) as any);
  }, [dispatch, currentPage]);

  const handleGroupButtonClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    groupId?: string
  ) => {
    document.querySelectorAll(".group-btn").forEach((btn) => {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline-primary");
    });

    e.currentTarget.classList.remove("btn-outline-primary");
    e.currentTarget.classList.add("btn-primary");

    if (groupId) {
      dispatch(fetchGroupDetail(groupId) as any);
      setShowAllBreeds(false);
    } else {
      setShowAllBreeds(true);
    }
  };

  useEffect(() => {
    const breedsData = groupDetail.data?.relationships?.breeds?.data;
    if (breedsData) {
      breedsData.forEach((breed) => {
        dispatch(fetchBreedById(breed.id) as any);
      });
    }
  }, [dispatch, groupDetail.data]);

  if (status === "loading")
    return <div className="alert alert-info">Loading groups...</div>;
  if (status === "failed")
    return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar - Group List */}
        <div className="col-md-3">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Dog Groups</h5>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item p-2">
                <button
                  className="btn btn-sm btn-outline-primary w-100 group-btn"
                  onClick={(e) => handleGroupButtonClick(e)}
                >
                  All
                </button>
              </li>
              {list.map((group) => (
                <li key={group.id} className="list-group-item p-2">
                  <button
                    className="btn btn-sm btn-outline-primary w-100 text-start group-btn"
                    onClick={(e) => handleGroupButtonClick(e, group.id)}
                  >
                    {group.attributes.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <FactsList/>
        </div>

        {/* Main Content - Breeds */}
        <div className="col-md-9">
          {showAllBreeds ? (
            <BreedsList />
          ) : groupDetail.status === "loading" ? (
            <div className="alert alert-info">Loading group detail...</div>
          ) : groupDetail.status === "failed" ? (
            <div className="alert alert-danger">Error: {groupDetail.error}</div>
          ) : groupDetail.data ? (
            <>
              <h4 className="mb-4 ">{groupDetail.data.attributes.name}</h4>
              <div className="row row-cols-2 g-3 align-items-stretch">
                {breedsInPage.map((breed) => {
                  const detail = breedDetailsMap[breed.id];
                  return detail ? (
                    <div className="col" key={breed.id}>
                      <BreedCard
                        id={breed.id}
                        attributes={detail.attributes}
                        groupName={groupDetail.data?.attributes.name}
                      />
                    </div>
                  ) : (
                    <div key={breed.id}>Loading breed {breed.id}...</div>
                  );
                })}
              </div>
              {totalBreedPages > 1 && (
                <div className="mt-4">
                  <PaginationControls
                    currentPage={groupDetail.currentPage}
                    lastPage={totalBreedPages}
                    onPageChange={(page: number) =>
                      dispatch(setGroupPage(page))
                    }
                    loading={(groupDetail.status as string) === "loading"}
                  />
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GroupsList;
