// src/features/facts/FactsList.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFacts } from "./factsSlice.ts";
import { RootState } from "../../components/store.ts";

const FactsList: React.FC = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state: RootState) => state.facts);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    dispatch(fetchFacts(limit) as any);
  }, [dispatch, limit]);

  return (
    <div className="card mt-5 shadow-sm border-info">
      <div className="card-body">
        <h4 className="card-title text-info mb-4">🐶 Dog Facts</h4>

        <div className="mb-3 row align-items-center">
          <label className="row-form-label fw-semibold">
            Number of facts to show:
          </label>
          <div className="col-sm-3">
            <input
              type="number"
              className="form-control"
              min={1}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
          </div>
        </div>

        {status === "loading" && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="alert alert-danger">❌ Error: {error}</div>
        )}

        {status === "succeeded" && (
          <ul className="list-group">
            {data.map((fact) => (
              <li key={fact.id} className="list-group-item">
                {fact.attributes.body}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FactsList;
