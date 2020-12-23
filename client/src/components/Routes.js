import React from "react";
import { Switch, Route } from "react-router-dom";

// General
import Login from "./Login.js";
import Registration from "./Registration.js";
import Dashboard from "./Dashboard.js";
import NotFound from "./NotFound.js";

// Quizzes
import CategorySelection from "./quiz/CategorySelection.js";
import QuizSelection from "./quiz/QuizSelection.js";
import QuizCreation from "./quiz/QuizCreation.js";

// Category
import CategoryDashboard from "./category/categoryDashboard";

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login}></Route>
      <Route exact path="/register" component={Registration}></Route>
      <Route exact path="/dashboard" component={Dashboard}></Route>

      <Route exact path="/quizzes" component={CategorySelection}></Route>
      <Route exact path="/quizzes/creation" component={QuizCreation}></Route>
      <Route
        exact
        path="/quizzes/:categoryName"
        component={QuizSelection}
      ></Route>

      <Route
        exact
        path="/category/available"
        component={CategoryDashboard}
      ></Route>

      <Route component={NotFound} />
    </Switch>
  );
  // If you prefer to redirect the user to homepage immediately (without displaying an error page),
  // put the following code under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from 'react-router-dom'
};

export default Routes;
