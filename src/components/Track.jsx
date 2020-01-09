import React from 'react';

class Track extends React.Component {
  constructor(props) {
    super();
    let { title, artist, link, scale, bpm, img } = props
    this.state = { title, artist, link, scale, bpm, img };
  }

  render() {
    return (
      <div className="track">
        <img src={this.props.img} className="track-img" alt=""></img>
        <div style={{ height: "100%", width: "100%" }}>
          <div className="row">
            <div className="nine columns">
              <a href={this.state.link} className="track-title">{this.state.title}</a>
              <p className="track-artist">{this.state.artist}</p>
            </div>
            <div className="three columns">
              <p className="track-key">{`Key: ${this.state.scale}`}</p>
              <p className="track-bpm">{`BPM: ${this.state.bpm}`}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Track;