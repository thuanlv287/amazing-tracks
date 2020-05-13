import React, { useState } from "react";
import { request } from "../utils";
import { TrackList } from "../components/track";
import PlayerEditor from "../components/player-editor";
import { isEmpty } from "../common";

const App = () => {
  const [list, setList] = useState([]);
  const options = {
    autoPlay: false
  }

  const getTrack = async (params) => {
    const { trackSlug } = params;
    const data = await request({ url: `https://us-central1-data-cloudstore.cloudfunctions.net/app/api/track?track=${trackSlug}` });
    if (isEmpty(data)) {
      setList([]);
    }
    const listNew = data.data.data.map(item => {
      return {
        id: item.id,
        url: item.urlSong,
        name: item.name,
        imageUrl: item.urlImageSong,
        author: item.author
      }
    })
    setList(listNew);
  }

  return (
    <div>
      <TrackList
        getTrack={getTrack}
      />
      <PlayerEditor
        playType='order'
        indexId={0}
        tracks={list}
        isShow={true}
        options={options}
      />
    </div>
  )
}

export default App;