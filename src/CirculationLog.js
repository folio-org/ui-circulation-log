import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { CirculationLogListContainer } from './CirculationLogList';

const CirculationLog = () => {
  return (
    <Switch>
      <Route
        component={CirculationLogListContainer}
        path="/circulation-log"
      />
    </Switch>
  );
};

export default CirculationLog;
