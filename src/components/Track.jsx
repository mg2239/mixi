import React from 'react';

class Track extends React.Component {
  constructor(props) {
    super();
    let { title, artist, link, scale, mode, bpm, img } = props
    scale = this.convertKey(scale, mode);
    bpm = Math.trunc(bpm + 0.5);
    this.state = { title, artist, link, scale, bpm, img };
  }

  convertKey(scale, mode) {
    let numToKeyMaj = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    let numToKeyMin = ['Cm', 'Dbm', 'Dm', 'Ebm', 'Em', 'Fm', 'Gbm', 'Gm', 'Abm', 'Am', 'Bbm', 'Bm'];
    if (mode) {
      return numToKeyMin[scale];
    }
    else {
      return numToKeyMaj[scale];
    }
  }

  render() {
    return (
      <div className="track">
        <img src={this.props.img} className="track-img" alt=""></img>
        <div style={{ height: "100%", width: "100%" }}>
          <div className="row">
            <div className="nine columns">
              <a href={this.state.link} className="track-title" target="_blank" rel="noopener noreferrer">{this.state.title}</a>
              <p className="track-artist">{this.state.artist}</p>
            </div>
            <div className="three columns">
              <p className="track-keybpm">{`${this.state.scale} / ${this.state.bpm}`}</p>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

export default Track;