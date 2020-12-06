import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginForm from './Login.js';
import RegistrationForm from './Registration.js';

const Main = () => {
  return (
    <Switch> 
      <Route exact path='/' component={LoginForm}></Route>
      <Route exact path='/register' component={RegistrationForm}></Route>
    </Switch>
  );
}

export default Main;