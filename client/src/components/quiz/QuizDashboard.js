import React from 'react';
//import { Link } from 'react-router-dom';
import { Form, Button, Segment, Grid, Label, Input, Select, Message, Accordion } from 'semantic-ui-react';
import { containerStyle } from '../../common.js';
import DashboardMenu from '../DashboardMenu.js';
import verifyLogin from '../verifyLogin.js';
import retrieveItems from './retrieveItems.js';
import Noty from 'noty';
import '../../../node_modules/noty/lib/noty.css';
import '../../../node_modules/noty/lib/themes/semanticui.css';

class CategorySelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            quizItems: [],
            categoryItems: [],
            category: null,
            functions: [
                { icon: 'trash', color: 'red', path: 'delete' },
                { icon: 'edit', color: 'blue', path: 'update' },
                { icon: 'play', color: 'green', path: 'play' },
            ],
            pagination: {
                currentPage: 1,
                perPage: 10,
            },
            filter: '',
            filterType: null,
            filterOptions: [
                { key: 'name', text: 'Quiz Name', value: 'name' },
                { key: 'category', text: 'Category', value: 'category' },
            ],
        };
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleDropdownChange = (event, data) => {
        this.setState({
            [data.name]: data.value,
        });
    };

    panel(value) {
        return [
            {
                key: 'details',
                title: 'Description',
                content: {
                    as: Form.Field,

                    label: value.length > 0 ? `${value}` : 'No description available.',
                },
            },
        ];
    }

    getAllCategories() {
        retrieveItems('category')
            .then((data) => {
                if (data.length <= 0) {
                    new Noty({
                        text: 'There are no categories to be retrieved from the database.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                } else this.setState({ categoryItems: data });
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
    }

    componentDidMount() {
        retrieveItems('quiz')
            .then((data) => {
                if (data.length <= 0) {
                    new Noty({
                        text: 'There are no quizzes to be retrieved from the database.',
                        type: 'error',
                        theme: 'semanticui',
                    }).show();
                } else this.setState({ quizItems: data });
            })
            .catch((err) => {
                new Noty({
                    text: `Something went wrong. ${err}`,
                    type: 'error',
                    theme: 'semanticui',
                }).show();
            });
        this.getAllCategories();
    }

    render() {
        let quizItems = this.state.quizItems.filter((item) => {
            switch (this.state.filterType) {
                case 'category':
                    return item.categoryId === parseInt(this.state.filter);
                default:
                    return item.quizName.toLowerCase().indexOf(this.state.filter) !== -1;
            }
        });

        if (!verifyLogin()) {
            return <h1>403 Forbidden</h1>;
        } else {
            return (
                <div className="container" style={{ textAlign: 'left' }}>
                    <DashboardMenu page="quizzes"></DashboardMenu>
                    <div className="subContainer" style={containerStyle}>
                        <div className="filter-input" style={{ marginBottom: '50px' }}>
                            <Message info header="This is a filter component." />
                            <Input fluid placeholder="Search..." action>
                                <input name="filter" onChange={this.handleChange} />
                                <Select
                                    name="filterType"
                                    options={this.state.filterOptions}
                                    onChange={this.handleDropdownChange}
                                    defaultValue="name"
                                />
                            </Input>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1>All Quizzes</h1>
                            <button className="ui primary button" onClick={this.redirectHandler}>
                                Create New<i className="right wrench icon"></i>
                            </button>
                        </div>
                        <div className="ui stacked segment">
                            <Form>
                                {quizItems.length > 0 ? (
                                    quizItems.map((value, index) => {
                                        return (
                                            <Segment color="green" key={index}>
                                                <Grid.Row>
                                                    <h2>{value.quizName}</h2>
                                                    <div style={{ fontStyle: 'italic' }}>
                                                        Category:
                                                        <Label style={{ margin: '0 5px' }} horizontal>
                                                            {value.categoryId}
                                                        </Label>
                                                        <Accordion panels={this.panel(value.quizDesc)} />
                                                    </div>
                                                </Grid.Row>
                                                <Grid.Row style={{ display: 'flex', flexDirection: 'row-reverse' }}>
                                                    {this.state.functions.map((value, index2) => {
                                                        return (
                                                            <Grid.Column key={index2} style={{ display: 'flex' }}>
                                                                <Button
                                                                    circular
                                                                    icon={value.icon}
                                                                    color={value.color}
                                                                />
                                                            </Grid.Column>
                                                        );
                                                    })}
                                                </Grid.Row>
                                            </Segment>
                                        );
                                    })
                                ) : (
                                    <h2>No Results..</h2>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default CategorySelection;
