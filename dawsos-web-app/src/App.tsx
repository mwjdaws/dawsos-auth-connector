import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomePage } from './pages';
import { Navbar } from './components';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route path="/" exact component={HomePage} />
          {/* Add more routes as needed */}
        </Switch>
      </div>
    </Router>
  );
};

export default App;