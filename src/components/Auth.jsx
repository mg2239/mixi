import React from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import TrackDisplay from './TrackDisplay';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();

class Auth extends React.Component {
  constructor(props) {
    super();
    const { access } = props;
    this.state = {
      playlist: null,
      access,
      isSubmitted: false,
      invalidURI: false,
      playlistDNE: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ invalidURI: false, playlistDNE: false, playlist: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    toast.dismiss();
    const { playlist } = this.state;
    const reg = new RegExp('^spotify:playlist:.*');
    if (playlist && playlist.match(reg)) {
      this.setState({ isSubmitted: true });
    } else {
      this.setState({ invalidURI: true });
    }
  }

  warning() {
    const { invalidURI, playlistDNE } = this.state;
    if (invalidURI) {
      return toast.error('Invalid URI!', {
        toastId: 1,
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
    if (playlistDNE) {
      return toast.error('Playlist does not exist!', {
        toastId: 2,
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
    return null;
  }

  render() {
    const { access, playlist, isSubmitted } = this.state;
    return (
      <>
        {!isSubmitted && (
          <>
            <h5>Enter a Spotify playlist URI below!</h5>
            <p>
              Check
              {' '}
              <a href="https://community.spotify.com/t5/Spotify-Answers/What-s-a-Spotify-URI/ta-p/919201" target="_blank" rel="noopener noreferrer">this link</a>
              {' '}
              if you don&apos;t know how to find a playlist&apos;s URI.
            </p>
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="playlist">
                <input id="playlist" style={{ width: '60%', fontWeight: 400 }} type="text" onChange={this.handleChange} />
              </label>
              <input type="submit" value="Submit" />
              {this.warning()}
              <ToastContainer />
            </form>
          </>
        )}
        {isSubmitted && (
          <>
            <TrackDisplay access={access} playlist={playlist} setState={(p) => this.setState(p)} />
          </>
        )}
      </>
    );
  }
}

Auth.propTypes = {
  access: PropTypes.string.isRequired,
};

export default Auth;
