import React from "react";
import { Dropdown } from 'semantic-ui-react';
import DashboardMenu from "./DashboardMenu"




const username = "Gabriel Lim";
//Hardcoded for now


class Account extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            ageOptions: ['18-25', '26-35', '36-45', '46-55'],
            hobbiesOption:['None','Football','Basketball','Floorball']
        }
    }
        handleClick = (event, { name }) => {
            event.preventDefault();
            window.location.href = `/${name}`;
        }
    render() {

        function SaveValue() {
         //add code to communicate with backend
        }
        const ageOptions = [];
        const hobbiesOption=[];

        for (let i = 0; i < this.state.ageOptions.length; i++) {
            let value = this.state.ageOptions[i];
            ageOptions.push({ key: value, text: value, value: value });
        };

        for (let i = 0; i < this.state.hobbiesOption.length; i++) {
            let value = this.state.hobbiesOption[i];
            hobbiesOption.push({ key: value, text: value, value: value });
        };


        return (
            <div className="container">
                <DashboardMenu page='quizzes'></DashboardMenu>
                <div>
                    <div>
                        <div className="ProfileIcon" style={{ paddingTop: "60px" }}>

                            <i className="user circle icon" style={{ fontSize: "80px", paddingTop: "20px", color:'teal' }}></i>
                        </div>
                        <div>
                            <h1 style={{color:'teal'}}>
                                Profile Page
                        </h1>
                        </div>

                        <div className="OptionsPanel">
                            <h2 style={{ paddingTop: "40px",color:'teal' }}>
                                Username
                          <div className="ui form"
                                    style={{ paddingLeft: "500px", width: "55em", paddingTop: "20px" }}>

                                    <input readOnly value={username}
                                        style={{ textAlign: "center" }} />
                                </div>
                            </h2> 
                            <h2 style={{color:'teal'}}>
                                Age Group
                            </h2>
                            <p style={{paddingLeft:"500px"}}>
                            <Dropdown
                                name='ageGroup'
                                placeholder=''
                                fluid
                                selection
                                style={{width:"20em",paddingLeft:"110px"}}
                                options={ageOptions}
                                onChange={this.handleDropdownChange}
                            />
                            </p>


                            <h2 style={{color:'teal'}}>
                                Hobbies
                            </h2>
                            <p 
                            style={{paddingLeft:"500px"}}>
                            <Dropdown
                                name='hobbiesOption'
                                placeholder=''
                                fluid
                                selection
                                style={{width:"20em",paddingLeft:"110px"}}
                                options={hobbiesOption}
                                onChange={this.handleDropdownChange}
                            />
                            </p>
                        </div>
                        <div className='SaveButton' style={{ paddingTop: "20px", color:'teal' }}>
                            <button className="ui secondary button" onClick={SaveValue}  >
                                Save!  
                    </button>

                        </div>
                    </div>
                </div>
            </div>

        )
    }
}


export default Account;
