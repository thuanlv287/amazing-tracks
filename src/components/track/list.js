import React, { useEffect, useState } from "react";
import { request } from "../../utils";
import { isEmpty } from "../../common";

const TrackList = props => {
  const [trackList, setTrackList] = useState([]);
  useEffect(() => {
    const getTrackList = async () => {
      const tracks = await request({ url: "https://us-central1-data-cloudstore.cloudfunctions.net/app/api/track-list" });
      if (isEmpty(tracks)) {
        setTrackList([]);
      }
      setTrackList(tracks.data.data);
    };
    getTrackList();
  }, []);

  return (
    <div className="container">
      <div className="track-list">
        {
          trackList.length !== 0 && trackList.map((track, index) => {
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