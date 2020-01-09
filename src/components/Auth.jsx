import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import TrackDisplay from './TrackDisplay';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class Auth extends React.Component {
  constructor(props) {
    super();
    let { access } = props
    this.state = {
      playlist: null,
      access: access,
      isSubmitted: false,
      invalid: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ invalid: false, playlist: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let reg = new RegExp('spotify:playlist:.*');
    if (this.state.playlist && this.state.playlist.match(reg)) {
      this.setState({ isSubmitted: true });
    }
    else {
      this.setState({ invalid: true });
    }
  }

  warning() {
    if (this.state.invalid) {
      return toast.error("Invalid URI!", {
        toastId: "",
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
    else {
      return null;
    }
  }

  render() {
    return <>
      {!this.state.isSubmitted && <>
        <h5>Enter a Spotify playlist URI below!</h5>
        <p>Check <a href="https://community.spotify.com/t5/Spotify-Answers/What-s-a-Spotify-URI/ta-p/919201" target="_blank" rel="noopener noreferrer">this link</a> if you don't know how to find a playlist's URI.</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            <input style={{ width: "60%", fontWeight: 400 }} type="text" onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
          {this.warning()}
          <ToastContainer />
        </form>
      </>}
      {this.state.isSubmitted && <>
        <TrackDisplay access={this.state.access} playlist={this.state.playlist} />
      </>}
    </>
  }
}

export default Auth;