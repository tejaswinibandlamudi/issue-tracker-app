import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
    this.state = { issues: [], loading: true };
  }

  componentDidMount() {
    this.populateIssueData();
  }

  static renderIssuesTable(issues) {
    return (
      <table className='table table-striped' aria-labelledby="tabelLabel">
        <thead>
          <tr>
            <th>Description</th>
            <th>Date Created (C)</th>
            <th>Created By</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Criticality</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(issue =>
            <tr key={issue.id}>
              <td>{issue.description}</td>
                  <td>{
                      issue.createdOn.split('T')[0] + ' ' +
                      issue.createdOn.split('T')[1].split('.')[0]
                  }
                  </td>
              <td>{issue.raisedBy}</td>
              <td>{issue.assignedTo}</td>
              <td>{issue.status}</td>
              <td>{issue.criticality}</td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : FetchData.renderIssuesTable(this.state.issues);

    return (
      <div>
        <h1 id="tabelLabel" >Issue tracker</h1>
        <p>All Issues in the database are...</p>
        {contents}
      </div>
    );
  }

  async populateIssueData() {
    const response = await fetch('http://localhost:8080/api/v1/issue/all');
    const data = await response.json();
    this.setState({ issues: data, loading: false });
  }
}
