import React from 'react';
import { Provider } from 'react-redux';
import { store } from './components/store.ts'; // 
import BreedsList from './features/breeds/BreedsList.tsx';


function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <BreedsList />
      </div>
    </Provider>
  );
}

export default App;
