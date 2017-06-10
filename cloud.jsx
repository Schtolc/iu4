import React from 'react';
import ReactDOM from 'react-dom';

class Form extends React.Component {
  constructor() {
    super();
    this.state = {
      payload: null,
      upload_status: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      payload: event.target.files[0]
    });
    event.preventDefault();
  }

  handleSubmit(event) {
    var formData = new FormData();
    if (!this.state.payload || this.state.payload.size < 8388608 /*268435456 TODO*/ ) {
      formData.append("payload", this.state.payload);
    }

    fetch('/upload', {
        method: 'POST',
        body: formData,
      })
      .then(resp => resp.json())
      .then(resp => this.setState({
        upload_status: resp.hasOwnProperty('reason') ?
          "fail" :
          "ok"
      }))
      .catch(err => this.setState({
        upload_status: "fail"
      }));

    event.preventDefault();
  }

  render() {
    return (
      <div>
    <form onSubmit={this.handleSubmit}>
        <input type="file" onChange={this.handleChange}></input>
        <input type="submit" value="upload"></input>
      </form>
    <p>{this.state.upload_status}</p>
    </div>
    );
  }
}

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      list: null,
    };

    this.tick = this.tick.bind(this);
  }

  tick() {
    fetch('/list')
      .then(resp => resp.json())
      .then(resp => this.setState({
        list: resp.files
      }))
      .catch(err => alert(err))
  }

  getList(list) {
    return list ? list : [];
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <ul>{this.getList(this.state.list).map(elem => <li key={elem}>{elem}</li>)}</ul>
    );
  }
}

class Cloud extends React.Component {
  render() {
    return (
      <div>
      <h1> IU4 Cloud </h1>
      <Form />
      <List />
      </div>
    );
  }
}

ReactDOM.render(
  <Cloud />,
  document.getElementById('root')
);