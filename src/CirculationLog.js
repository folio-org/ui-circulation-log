import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import { CirculationLogList } from './CirculationLogList';

const CirculationLog = () => {
  return (
    <Switch>
      <Route
        component={CirculationLogList}
        path="/circulation-log"
      />
    </Switch>
  );
};

export default CirculationLog;
