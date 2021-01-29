import React, { Component } from "react";
import Headers from "./Header";
import Dialog from "./Dialog";
import Inputs from "./Input";
import Tabs from "./Tabs";
import StarRating from "./StarRating";
import "./demo.css";

import axios from 'axios';
import { host } from '../../common.js';

//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

const BOT_DELAY = 4000;
const BOT_SPEED = 0.03;
const BOT_MAX_CHARS = 150;


function getBotDelay(msg, isQuick = false) {
  let delay = isQuick ? BOT_DELAY / 2 : BOT_DELAY;
  let speed = isQuick ? BOT_SPEED * 2 : BOT_SPEED;
  return msg.length > BOT_MAX_CHARS ? delay : Math.floor(msg.length / speed);
}

export default class ReactBotUI extends Component {
  constructor(props) {
    super(props);
    // if (props.dialogflow) {
    //   this.dialogflow = new ApiAiClient(props.dialogflow);
    // }
    this.botQueue = [];
    this.isProcessingQueue = false;
    this.state = {
      title: props.title || "Chatbot",
      messages: [],
      isBotTyping: false,
      isOpen: props.isOpen !== undefined ? props.isOpen : false,
      isVisible: props.isVisible !== undefined ? props.isVisible : true,
    };

    this.appendMessage = this.appendMessage.bind(this);
    this.processBotQueue = this.processBotQueue.bind(this);
    this.processResponse = this.processResponse.bind(this);
    this.getResponse = this.getResponse.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleSubmitText = this.handleSubmitText.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  appendMessage(text, isUser = false, next = () => { }) {
    let messages = this.state.messages.slice();
    messages.push({ isUser, text });
    this.setState({ messages, isBotTyping: this.botQueue.length > 0 }, next);
  }

  processBotQueue(isQuick = false) {
    if (!this.isProcessingQueue && this.botQueue.length) {
      this.isProcessingQueue = true;
      const nextMsg = this.botQueue.shift();
      setTimeout(() => {
        this.isProcessingQueue = false;
        this.appendMessage(nextMsg, false, this.processBotQueue);
      }, getBotDelay(nextMsg, isQuick));
    }
  }

  processResponse(botanswer) {
    const messages = botanswer.match(/[^.!?]+[.!?]*/g).map((str) => str.trim());
    this.botQueue = this.botQueue.concat(messages);

    // start processing bot queue
    const isQuick = !this.state.isBotTyping;
    this.setState({ isBotTyping: true }, () => this.processBotQueue(isQuick));
  }

  getResponse(userInput) {
    // return this.dialogflow
    // .textRequest(userinput)
    //  $.get("http://localhost:5000/get",{msg:userinput}).done(function(botanswer) {
    //  });
    // .then((data) => data.result.fulfillment.speech);
    // $.get("http://localhost:5000/get", { msg: userinput }).done(function(botanswer) {
    //  return botanswer;
    // });

    axios.post(host + '/botReply', { userinput: userInput })
      .then((response) => {
        console.log("this is response", response.data);
        this.processResponse(response.data)
      }

      )
      .catch((error) => {
        alert(error);
      });

  }

  handleSubmitText(userinput) {
    // append user text
    this.appendMessage(userinput, true);

    // fetch bot text, process as queue
    // if (this.dialogflow) {
    //   this.getResponse(userinput).then(this.processResponse);
    // } else if (this.props.getResponse) {
    //   this.props.getResponse(userinput).then(this.processResponse);
    // } else {
    //   this.processResponse("Sorry, I'm not configured to respond. :'(");
    // }
    this.getResponse(userinput);
  }

  handleResize(e) {
    const window = e.target || e;
    const y = window.innerHeight;
    // const header = document.querySelector(".chatcontainer header");
    // const input = document.querySelector(".chatcontainer .text-form");
    // let dialogHeight = y - header.offsetHeight - input.offsetHeight;
    let dialogHeight = y;
    if (dialogHeight < 0 || !dialogHeight) {
      dialogHeight = 0;
    } else if (
      this.props.dialogHeightMax &&
      dialogHeight > this.props.dialogHeightMax
    ) {
      dialogHeight = this.props.dialogHeightMax;
    }
    this.setState({ dialogHeight });
  }

  handleToggle() {
    if (this.state.isVisible) {
      this.setState({ isOpen: !this.state.isOpen });
    } else {
      this.setState({ isVisible: true });
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize(window);
  }

  componentWillUnmount() {
    window.removeEventListener("resize");
  }

  render() {
    return (
      <div
        className="chatcontainer"
        style={
          this.state.isVisible ? { display: "block" } : { display: "none" }
        }
      >
        <Headers title={this.state.title} onClick={this.handleToggle} />

        <div
          style={
            this.state.isOpen
              ? { minHeight: `${this.state.dialogHeight}px` }
              : { maxHeight: 0, overflow: "hidden" }
          }
        >
          <Tabs>
            <div label="Chatbot">
              <Dialog
                messages={this.state.messages}
                isBotTyping={this.state.isBotTyping}
                isUserHidden={this.props.isUserHidden}
                dialogHeight={this.state.dialogHeight}
              />
              <Inputs onSubmit={this.handleSubmitText} />
            </div>
            <div label="Review" style={{ overflow: "hidden" }}>
              <StarRating />
            </div>

          </Tabs>
          {/* <Tab panes={panes} /> */}
          {/* <Tab panes={getPanes(sections)} /> */}

          {/* <Dialog
            messages={this.state.messages}
            isBotTyping={this.state.isBotTyping}
            isUserHidden={this.props.isUserHidden}
            dialogHeight={this.state.dialogHeight}
          />
          <Inputs onSubmit={this.handleSubmitText} /> */}
          {/* <Button onSubmit={this.handleSubmitText}>Toggle</Button> */}
        </div>
      </div>
    );
  }
}

