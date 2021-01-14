import React from 'react';
import { Switch, Route } from 'react-router-dom';

// General
import Login from './Login.js';
import Registration from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';

// Profile
import Profile from './profile/profile.js';

// Quizzes
import QuizDashboard from './quiz/QuizDashboard.js';
import QuizCreation from './quiz/QuizCreation.js';
import QuizPlay from './quiz/QuizPlay.js';
import QuizUpdate from './quiz/QuizUpdate.js';

// Category
import CategoryDashboard from './category/categoryDashboard';
import CategoryCreate from './category/categoryCreate';
import CategoryUpdate from './category/categoryUpdate';

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/register" component={Registration}></Route>
      <Route exact path="/dashboard" component={Dashboard}></Route>

      <Route exact path="/account" component={Profile}></Route>

      <Route exact path="/category" component={CategoryDashboard}></Route>
      <Route exact path="/category/create" component={CategoryCreate}></Route>
      <Route exact path="/category/update/:id" component={CategoryUpdate}></Route>

      <Route exact path="/quizzes" component={QuizDashboard}></Route>
      <Route exact path="/quizzes/creation" component={QuizCreation}></Route>
      <Route exact path="/quizzes/play/:id" component={QuizPlay}></Route>
      <Route exact path="/quizzes/update/:id" component={QuizUpdate}></Route>

      <Route component={NotFound} />
    </Switch>
  );
  // If you prefer to redirect the user to homepage immediately (without displaying an error page),
  // put the following code under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from 'react-router-dom'
};

export default Routes;
