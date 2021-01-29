// import React, { Component } from "react";

// class Header extends Component {
//   render() {
//     return (
//       <header
//         onClick={this.props.onClick}
//         style={this.props.onClick ? { cursor: "pointer" } : {}}
//       >
//         <h1>{this.props.title}</h1>
//       </header>
//     );
//   }
// }
// export default Header;

import React, { Component } from "react";
import { Header, Icon } from "semantic-ui-react";

class Headers extends Component {
  render() {
    return (
      // <header
      //   onClick={this.props.onClick}
      //   style={this.props.onClick ? { cursor: "pointer" } : {}}
      // >
      //   <h1>{this.props.title}</h1>
      // </header>
      <div className="chatheader">
        <Header
          as="h2"
          color="blue"
          block
          onClick={this.props.onClick}
          style={this.props.onClick ? { cursor: "pointer" } : {}}
        >
          <Icon name="wechat" />
          <Header.Content>Chatbot</Header.Content>
        </Header>
      </div>
    );
  }
}
export default Headers;
