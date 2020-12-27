import React, { Component } from "react";
import axios from "axios";
import emailjs from "emailjs-com";
import './FormsStyle.css';

export class CreateIssue extends Component {

    initialState = {
        description: "",
        raisedBy: "",
        criticality: "",
        isCreated: false,
        error: false,
        descriptionError: "",
        raisedByError: "",
        criticalityError:""
    };

    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    changeHandler = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    validate = () => {
        let descriptionError = "";
        let raisedByError = "";
        let criticalityError = "";

        if (this.state.description.length < 8) {
            descriptionError = "Description too short";
        }

        if (descriptionError) {
            this.setState({ descriptionError });
            return false;
        }

        if (!this.state.raisedBy) {
            raisedByError = "Raised By is blank";
        }

        if (raisedByError) {
            this.setState({ raisedByError });
            return false;
        }

        if (!this.state.criticality) {
            criticalityError = "Criticality isn't selected";
        }

        if (criticalityError) {
            this.setState({ criticalityError });
            return false;
        }

        return true;
    };

    sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('Service ID', 'template ID', e.target, 'user ID')
            .then((result) => {
                console.log(result);
            }, (error) => {
                console.log(error);
            });
    };

    submitHandler = (e) => {
        e.preventDefault()
        console.log(this.state);
        const isValid = this.validate();
        if (isValid) {
            axios.post("http://localhost:8080/api/v1/issue/create", this.state)
                .then(response => {
                    console.log(response)
                    this.setState({ isCreated: true })
                })
                .catch(error => {
                    console.log(error)
                    this.setState({ error: true })
                })
            this.sendEmail(e);
            this.setState( this.initialState );
        }
    };

    render() {
        const { description, raisedBy, criticality, isCreated, error } = this.state;
        return (
            <form onSubmit={this.submitHandler}>
                <label htmlFor="description">Description</label>
                <input type="text" name="description" placeholder="Description of the problem" value={description} onChange={this.changeHandler} />
                <div style={{color:"red"}}>
                    {this.state.descriptionError}
                </div>
                <label htmlFor="raisedBy">Raised By</label>
                <input type="text" name="raisedBy" placeholder="Raised By" value={raisedBy} onChange={this.changeHandler} />
                <div style={{ color: "red" }}>
                    {this.state.raisedByError}
                </div>
                <label htmlFor="criticality">Criticality</label>
                <select id="status" name="criticality" onChange={this.changeHandler}>
                    <option value =""> Select </option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Very High">Very high</option>
                </select>
                <div style={{ color: "red" }}>
                    {this.state.criticalityError}
                </div>
                <input type="submit" />
                { isCreated && <p>Issue Submited</p>}
                { error && <p>Something went wrong</p>}
            </form>
        );
    }
}
