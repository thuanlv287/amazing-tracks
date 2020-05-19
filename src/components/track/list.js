import React from "react";

const TrackList = props => {
  const { tracks } = props || [];

  return (
    <div className="container">
      <div className="track-list">
        {
          tracks.length !== 0 && tracks.map((track, index) => {
            return (
              <div key={index} className="track-item">
                <div className="track-link">
                  <div className="track-image">
                    <img src={track.trackImageUrl} />
                    <span className="play-btn" onClick={() => props.getTrack(track)}></span>
                  </div>
                  <div className="track-list-desc">
                    <h2>{track.trackName}</h2>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default TrackList;