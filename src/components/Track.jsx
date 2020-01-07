import React from 'react';

class Track extends React.Component {
  constructor(props) {
    super();
    let { title, artist, link, key, bpm } = props
    this.state = { title, artist, link, key, bpm };
  }

  render() {
    return (
      <div className="track">
        <a href={this.state.link} className="track-title">{this.state.title}</a>
        <p className="track-artist">{this.state.artist}</p>
        <div className="info">
          <p className="track-key">{`Key: ${this.state.key}`}</p>
          <p className="track-bpm">{`BPM: ${this.state.bpm}`}</p>
        </div>
      </div>
    )
  }
}

export default Track;