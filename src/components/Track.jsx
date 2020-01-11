import React from 'react';
import PropTypes from 'prop-types';

function convertKey(scale, mode) {
  const numToKeyMaj = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const numToKeyMin = ['Cm', 'Dbm', 'Dm', 'Ebm', 'Em', 'Fm', 'Gbm', 'Gm', 'Abm', 'Am', 'Bbm', 'Bm'];
  if (mode) {
    return numToKeyMin[scale];
  }
  return numToKeyMaj[scale];
}

class Track extends React.Component {
  constructor(props) {
    super();
    const {
      title, artist, link, mode, img,
    } = props;
    let { scale, bpm } = props;
    scale = convertKey(scale, mode);
    bpm = Math.trunc(bpm + 0.5);
    this.state = {
      title, artist, link, scale, bpm, img,
    };
  }

  render() {
    const {
      img, link, artist, title, scale, bpm,
    } = this.state;
    return (
      <div className="track">
        <img src={img} className="track-img" alt="" />
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="nine columns">
              <a href={link} className="track-title" target="_blank" rel="noopener noreferrer">{title}</a>
              <p className="track-artist">{artist}</p>
            </div>
            <div className="three columns">
              <p className="track-keybpm">{`${scale} / ${bpm}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Track.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  mode: PropTypes.number.isRequired,
  bpm: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
};

export default Track;
