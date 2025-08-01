# Redux_Exam

src/
├── components/
│ └── store.js <-- cấu hình Redux store
│ └── BreedCard.tsx
│ └── PaginationControls.txs
├── features/
│ ├── breeds/
│ │ ├── breedsSlice.ts <-- Lấy danh sách breeds
│ │ ├── breedDetailsSlice.ts <-- Lấy chi tiết breed theo ID
│ │ └── BreedsList.tsx <-- UI hiển thị danh sách
│
│ ├── facts/
│ │ ├── factsSlice.ts <-- Lấy danh sách facts (có giới hạn limit)
│ │ └── FactsList.tsx <-- UI hiển thị facts
│
│ └── groups/
│ ├── groupsSlice.ts <-- Lấy danh sách group
│ ├── groupDetailsSlice.ts <-- Lấy chi tiết group theo ID
│ └── GroupsList.tsx <-- UI hiển thị groups
├── App.jsx
