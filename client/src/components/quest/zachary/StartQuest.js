import React from "react";
import { Button } from "semantic-ui-react";
import DashboardMenu from "../../DashboardMenu.js";
import verifyLogin from "../../verifyLogin.js";
import Popup from "./Popup.js";

class StartQuest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
  }

  //   componentDidUpdate(){

  //   }

  togglePopup = (event) => {
    this.setState({
      [event.target.id]: !this.state.showPopup,
    });

    this.setState({
      showPopup: !this.state.showPopup,
    });
  };

  render() {
    if (!verifyLogin()) {
      return <h1>403 Forbidden</h1>;
    } else {
      return (
        <div className="container">
          <DashboardMenu page="StartQuest"></DashboardMenu>

          <div
            className="segment box"
            style={{ paddingLeft: "380px", paddingTop: "30px" }}
          >
            <div
              className="ui segment "
              style={{ width: "60%", height: "24em", backgroundColor: "teal" }}
            >
              <i
                class="lightbulb icon"
                style={{ paddingTop: "25px", color: "white", fontSize: "35px" }}
              ></i>

              <h1 style={{ textAlign: "center", color: "white" }}>
                {" "}
                Quest: Technology
              </h1>
              <p1 style={{ color: "white" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                {/* Hardcoded now... */}
              </p1>

              <div
                className="ButtonIcon"
                style={{ paddingRight: "8px", paddingTop: "20px" }}
              >
                <Button
                  id="lol"
                  class="ui secondary button"
                  onClick={(event) => this.togglePopup(event)}
                >
                  Read More!
                </Button>

                {this.state["lol"] ? (
                  <Popup
                    id="lol"
                    text="Quest:Technology"
                    paragraph=" Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit anim id est laborumdwdwdwhii"
                    closePopup={(event) => this.togglePopup(event)}
                  />
                ) : null}
              </div>
            </div>
          </div>

          <div
            className="SolutionPanel"
            style={{
              paddingTop: "30px",
              paddingBottom: "30px",
              justifyContent: "space-evenly",
              display: "flex",
            }}
          >
            <Button
              id="1"
              className="Solution#1"
              style={{
                width: "180px",
                height: "250px",
                backgroundColor: "teal",
              }}
              onClick={(event) => this.togglePopup(event)}
            >
              <h1>Solution 1</h1>
            </Button>
            {this.state["1"] ? (
              <Popup
                id="1"
                text="Quest:Technology"
                paragraph=" wdwhii"
                closePopup={(event) => this.togglePopup(event)}
              />
            ) : null}

            <Button
              id="2"
              className="Solution#2"
              style={{
                width: "180px",
                height: "250px",
                backgroundColor: "teal",
                textAlign: "center",
              }}
              onClick={(event) => this.togglePopup(event)}
            >
              {this.state["2"] ? (
                <Popup
                  id="2"
                  text="Quest:Technology"
                  paragraph="test"
                  closePopup={(event) => this.togglePopup(event)}
                />
              ) : null}
              <h1>Solution 2</h1>
            </Button>

            <Button
              id="3"
              className="Solution#3"
              style={{
                width: "180px",
                height: "250px",
                backgroundColor: "teal",
              }}
              onClick={(event) => this.togglePopup(event)}
            >
              {this.state["3"] ? (
                <Popup
                  id="3"
                  text="Quest:Technology"
                  paragraph="Hi Zach"
                  closePopup={(event) => this.togglePopup(event)}
                />
              ) : null}
              <h1>Solution 3</h1>
            </Button>
          </div>

          {/* <div className="float child"
                    style={{width:'50%',float:'left',padding:'20px',border:'2px, solid,teal'}}>

                    </div>

                    <div className="float child"
                    style={{width:'50%',float:'left',padding:'20px',border:'2px, solid,teal'}}>

                    </div>      

                      <div className="float child"
                    style={{width:'50%',float:'left',padding:'20px',border:'2px, solid,teal'}}>

                    </div>     */}
        </div>
      );
    }
  }
}

export default StartQuest;
