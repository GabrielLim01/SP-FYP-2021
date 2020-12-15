import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './Login.js';
import Registration from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';
import Selection from './quiz/Selection.js';
import QuizCreation from './quiz/QuizCreation.js';

// TO-DO - Establish a more dynamic component/page routing structure

const Main = () => {
  return (
    <Switch> 
      <Route exact path='/' component={Login}></Route>
      <Route path='/register' component={Registration}></Route>
      <Route path='/dashboard' component={Dashboard}></Route>
      
      <Route exact path='/quizzes' component={Selection}></Route>
      <Route exact path='/quizzes/technology' component={Selection}></Route>
      <Route exact path='/quizzes/quizcreation' component={QuizCreation}></Route>

      <Route component={NotFound} /> 
    </Switch>
  );
  // If redirecting the user to homepage immediately without displaying an error page is preferable, use the following under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from react-router-dom
}

export default Main;