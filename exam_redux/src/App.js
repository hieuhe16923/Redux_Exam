import React from 'react';
import { Provider } from 'react-redux';
import { store } from './components/store.ts'; // 

import GroupsList from './features/groups/GroupsList.tsx';


function App() {

  return (
    <Provider store={store}>
      <div className="App">
        <GroupsList />
      </div>
    </Provider>
  );
}

export default App;
