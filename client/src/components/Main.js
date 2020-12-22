import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './Login.js';
import Registration from './Registration.js';
import Dashboard from './Dashboard.js';
import NotFound from './NotFound.js';
import QuizCategorySelection from './quiz/QuizCategorySelection.js';
import QuizSelection from './quiz/QuizSelection.js';
import QuizCreation from './quiz/QuizCreation.js';
// import Account from './Account.js'
import QuestCategorySelection from './quest/QuestCategorySelection.js';
import QuestSelection from './quest/QuestSelection';
import StartQuest from './quest/StartQuest';
 import Account from './Account.js'

// TO-DO - Establish a more dynamic component/page routing structure

const Main = () => {
  return (
    <Switch> 
      <Route exact path='/' component={Login}></Route>
      <Route exact path='/register' component={Registration}></Route>
      <Route exact path='/dashboard' component={Dashboard}></Route>
      <Route exact path='/quests' component={QuestCategorySelection}></Route>
      <Route exact path='/quizzes' component={QuizCategorySelection}></Route>
      <Route exact path='/quizzes/technology' component={QuizSelection}></Route>
      <Route exact path='/quizzes/creation' component={QuizCreation}></Route>
      <Route exact path='/quests/technology' component={QuestSelection}></Route>
      <Route exact path='/quests/technology/1' component={StartQuest}></Route>

      <Route exact Path='/account' component={Account}></Route> 
      <Route component={NotFound} /> 
      
    </Switch>
  );
  // If redirecting the user to homepage immediately without displaying an error page is preferable, use the following under <Switch> instead
  // <Route render={() => <Redirect to={{pathname: "/"}} />} />
  // and remember to import Redirect from react-router-dom
}

export default Main;