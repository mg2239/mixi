import React from 'react';

class AuthView extends React.Component {
  constructor() {
    super();
    this.state = {
      playlist: null,
      access: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { access } = this.props.match.params;
    this.setState({ access });
  }

  handleChange(event) {
    this.setState({ playlist: event.target.value });
  }

  handleSubmit(event) {
    alert(`${this.state.playlist} + ${this.state.access}`)
  }

  render() {
    return <>
      <h5>Paste a link to any Spotify playlist below!</h5>
      <form onSubmit={this.handleSubmit}>
        <label>
          <input style={{ width: "40%", "font-weight": "400" }} type="text" onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>;
  }
}

export default AuthView;