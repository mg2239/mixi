import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import TrackDisplay from './TrackDisplay';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  accessToken: string
}

export default function PlaylistInput({ accessToken }: Props) {
  toast.configure();

  const [playlist, setPlaylist] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validURI, setValidURI] = useState(true);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValidURI(false);
    setPlaylist(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.dismiss();
    const reg = new RegExp('^spotify:playlist:.*');
    if (playlist && playlist.match(reg)) {
      setSubmitted(true);
    } else {
      setValidURI(true);
    }
  }

  function warning() {
    if (!validURI) {
      return toast.error('Invalid URI!', {
        toastId: '',
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

  return (
    <>
      {!submitted && (
        <>
          <h5>Enter a Spotify playlist URI below!</h5>
          <p>
            Check
            {' '}
            <a href="https://community.spotify.com/t5/Spotify-Answers/What-s-a-Spotify-URI/ta-p/919201" target="_blank" rel="noopener noreferrer">this link</a>
            {' '}
            if you don&apos;t know how to find a playlist&apos;s URI.
          </p>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="playlist">
              <input id="playlist" style={{ width: '60%', fontWeight: 400 }} type="text" onChange={(e) => handleChange(e)} />
            </label>
            <input type="submit" value="Submit" />
            {warning()}
            <ToastContainer />
          </form>
        </>
      )}
      {submitted && (
        <>
          <TrackDisplay accessToken={accessToken} playlist={playlist} />
        </>
      )}
    </>
  );
}
