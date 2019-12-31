import React from 'react';

class Auth extends React.Component {
  constructor(props) {
    super();
    this.state = {
      playlist: null,
      access: props.access,
      isSubmitted: false,
      isGenerated: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ playlist: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    alert(`${this.state.access} + ${this.state.playlist}`)
  }

  render() {
    return <>
      <h5>Paste a link to a Spotify playlist below!</h5>
      <form onSubmit={this.handleSubmit}>
        <label>
          <input style={{ width: "40%", "font-weight": "400" }} type="text" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>;
  }
}

export default Auth;