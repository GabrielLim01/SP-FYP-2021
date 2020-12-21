import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './Login.js';
import Registration from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';
import QuizCreation from './quiz/QuizCreation.js';
import QuizPlay from './quiz/QuizPlay.js';
import CategorySelection from './quiz/CategorySelection.js';
import QuizSelection from './quiz/QuizSelection.js';

// Routes are more dynamic, but the component routing for 
// '/quizzes/:categoryName' conflicts with '/quizzes/creation'
// Should think of a workaround for that

const Routes = () => {
  return (
    <Switch> 
      <Route exact path='/' component={Login}></Route>
      <Route exact path='/register' component={Registration}></Route>
      <Route exact path='/dashboard' component={Dashboard}></Route>
      
      <Route exact path='/quizzes' component={CategorySelection}></Route>
      <Route exact path="/quizzes/:categoryName" component={QuizSelection}></Route>
      <Route exact path="/quizzes/:categoryName/:id" component={QuizPlay}></Route>
      <Route exact path='/quizzes/creation' component={QuizCreation}></Route>

      <Route component={NotFound} /> 
    </Switch>
  );
  // If redirecting the user to homepage immediately without displaying an error page is preferable, use the following under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from react-router-dom
}

export default Routes;