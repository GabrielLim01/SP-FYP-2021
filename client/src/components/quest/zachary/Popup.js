import React from 'react';
import './styles.css';
import { Button } from 'semantic-ui-react'


class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <i className="lightbulb icon" style={{ fontSize: '40px', paddingTop: '30px', color: 'white' }}></i>
          <h1 style={{ color: "white" }}>{this.props.text}</h1>
          <div className='textbox' style={{ width: '85%', paddingLeft: '100px' }}>
            <p1 style={{ color: "white" }}>{this.props.paragraph}</p1>
          </div>
          <div className="donebutton"
            style={{ paddingTop: '20px' }}>
            <Button id={this.props.id} onClick={this.props.closePopup}

            >Done!</Button>
          </div>


        </div>
      </div>
    );
  }
}

export default Popup;