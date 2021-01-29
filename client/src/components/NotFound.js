import React from 'react';
import { Link } from 'react-router-dom';
import { containerStyle } from '../common.js';

const NotFound = () => (
  <div className="container" style={containerStyle}>
    <h1>404 - Not Found!</h1>
    <Link to="/">
      <div className="ui fluid large teal submit button">Go Home</div>
    </Link>
  </div>
);

export default NotFound;