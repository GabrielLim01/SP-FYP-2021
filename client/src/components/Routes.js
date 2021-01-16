import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.js';

// General
import Login from './Login.js';
import Registration from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';

// Categories
import CategoryDashboard from './category/categoryDashboard.js';
import CategoryCreate from './category/categoryCreate.js';
import CategoryUpdate from './category/categoryUpdate.js';

// Quizzes
import QuizDashboard from './quiz/QuizDashboard.js';
import QuizCreation from './quiz/QuizCreation.js';
import QuizPlay from './quiz/QuizPlay.js';
import QuizUpdate from './quiz/QuizUpdate.js';

// Profile
import Profile from './profile/Profile.js';
import About from './profile/About.js';

// Account
import AccountOverview from './Account/accountOverview.js';
import AdminRegistration from './Account/adminRegister.js';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={Login}></Route>
            <Route exact path="/register" component={Registration}></Route>
            <ProtectedRoute path="/dashboard" component={Dashboard}></ProtectedRoute>

            <ProtectedRoute exact path="/category" component={CategoryDashboard} adminOnly={true}></ProtectedRoute>
            <ProtectedRoute exact path="/category/create" component={CategoryCreate} adminOnly={true}></ProtectedRoute>
            <ProtectedRoute exact path="/category/update/:id" component={CategoryUpdate} adminOnly={true}></ProtectedRoute>

            <ProtectedRoute exact path="/quizzes" component={QuizDashboard}></ProtectedRoute>
            <ProtectedRoute exact path="/quizzes/creation" component={QuizCreation} adminOnly={true}></ProtectedRoute>
            <ProtectedRoute exact path="/quizzes/play/:id" component={QuizPlay}></ProtectedRoute>
            <ProtectedRoute exact path="/quizzes/update/:id" component={QuizUpdate} adminOnly={true}></ProtectedRoute>

            <ProtectedRoute exact path="/account" component={Profile}></ProtectedRoute>
            <ProtectedRoute exact path="/about" component={About}></ProtectedRoute>
            <ProtectedRoute exact path="/admin/accountOverview" component={AccountOverview} adminOnly={true}></ProtectedRoute>
            <ProtectedRoute exact path="/admin/registration" component={AdminRegistration} adminOnly={true}></ProtectedRoute>

            <Route component={NotFound} />
        </Switch>
    );
    // If you prefer to redirect the user to homepage immediately (without displaying an error page),
    // put the following code under <Switch> instead
    // <Route render={() => <Redirect to={{pathname: "/"}} />} />
    // and remember to import Redirect from 'react-router-dom'
};

export default Routes;
