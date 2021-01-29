import React, { Component } from 'react';
import { Button, Icon, Input } from 'semantic-ui-react';

class Inputs extends Component {
    constructor(props) {
        super(props);
        this.state = { value: '' };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const value = e.target.value;
        if (value.length >= 256) {
            alert('You have reached 256 character limit!');
        }
        this.setState({ value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.onSubmit(this.state.value);
        this.setState({ value: '' });
    }

    componentDidMount() {
        this._text.focus();
    }

    render() {
        return (
            <form className="text-form" onSubmit={this.handleSubmit}>
                <Input
                    fluid
                    className="text-input"
                    placeholder="Enter your message"
                    value={this.state.value}
                    ref={(input) => (this._text = input)}
                    onChange={this.handleChange}
                    autoComplete={'false'}
                    required
                />
                <Button animated="fade" value="Send" style={{ marginRight: '0px' }}>
                    <Button.Content visible style={{ paddingRight: '10px' }}>
                        Send
                    </Button.Content>
                    <Button.Content hidden>
                        <Icon name="right arrow" />
                    </Button.Content>
                </Button>
            </form>
        );
    }
}
export default Inputs;
