import React from 'react';
import { Switch, Route } from 'react-router-dom';

// General
import Login from './Login.js';
import Registration from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';
<<<<<<< HEAD:client/src/components/Routes.js

// Quizzes
import CategorySelection from './quiz/CategorySelection.js';
import QuizSelection from './quiz/QuizSelection.js';
import QuizCreation from './quiz/QuizCreation.js';
=======
>>>>>>> dc7724fdd136d56a2e18b60b5f9fa4c504aa7360:client/src/components/Main.js

const Routes = () => {
  return (
    <Switch> 
      <Route exact path='/' component={Login}></Route>
      <Route exact path='/register' component={Registration}></Route>
      <Route exact path='/dashboard' component={Dashboard}></Route>

<<<<<<< HEAD:client/src/components/Routes.js
      <Route exact path='/quizzes' component={CategorySelection}></Route>
      <Route exact path='/quizzes/creation' component={QuizCreation}></Route>
      <Route exact path="/quizzes/:categoryName" component={QuizSelection}></Route>

=======
>>>>>>> dc7724fdd136d56a2e18b60b5f9fa4c504aa7360:client/src/components/Main.js
      <Route component={NotFound} /> 
    </Switch>
  );
  // If you prefer to redirect the user to homepage immediately (without displaying an error page), 
  // put the following code under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from 'react-router-dom'
}

export default Routes;