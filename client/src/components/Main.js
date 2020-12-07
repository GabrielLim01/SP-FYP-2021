import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginForm from './Login.js';
import RegistrationForm from './Registration.js';
import Dashboard from './Dashboard.js';

const Main = () => {
  return (
    <Switch> 
      <Route exact path='/' component={LoginForm}></Route>
      <Route exact path='/register' component={RegistrationForm}></Route>
      <Route exact path='/dashboard' component={Dashboard}></Route>
    </Switch>
  );
}

export default Main;