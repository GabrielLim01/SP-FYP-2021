import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="ui middle aligned center aligned grid">
    <div className="column" style={{ maxWidth: '450px' }}>
      <h1>404 - Not Found!</h1>
      <Link to="/">
        <div className="ui fluid large teal submit button">Go Home</div>
      </Link>
    </div>
  </div>
);

export default NotFound;