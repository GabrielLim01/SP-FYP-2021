import React from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "semantic-ui-react";
import { containerStyle } from "../../common.js";
import DashboardMenu from "../DashboardMenu.js";
import verifyLogin from "../verifyLogin.js";

class CategoryDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryArray: ["Technology", "Lifestyle", "Finance"],
    };
  }

  render() {
    if (!verifyLogin()) {
      return <h1>403 Forbidden</h1>;
    } else {
      return (
        <div className="container" style={{ textAlign: "left" }}>
          <DashboardMenu page="quizzes"></DashboardMenu>
          <div className="subContainer" style={containerStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h1>Available Categories</h1>
              <div className="ui grey circular huge label">
                <a>
                  <i className="wrench icon"></i>
                </a>
              </div>
            </div>
            <div className="ui stacked segment">
              {this.state.categoryArray.map((category) => (
                <div class="ui label">
                  <a class="ui huge label">
                    {category}
                    <i class="delete icon"></i>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default CategoryDashboard;
