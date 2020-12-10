import React from 'react';
import { Switch, Route } from 'react-router-dom';

import LoginForm from './Login.js';
import RegistrationForm from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';
import Quizzes from './Quizzes.js';

const Main = () => {
  return (
    <Switch> 
      <Route exact path='/' component={LoginForm}></Route>
      <Route exact path='/register' component={RegistrationForm}></Route>
      <Route exact path='/dashboard' component={Dashboard}></Route>
      <Route exact path='/quizzes' component={Quizzes}></Route>
      <Route component={NotFound} /> 
    </Switch>
  );
  // If redirecting the user to homepage immediately without displaying an error page is preferable, use the following under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from react-router-dom
}

export default Main;