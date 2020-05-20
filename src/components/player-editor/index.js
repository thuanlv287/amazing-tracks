import React from 'react';
import { getRandom } from "../../common";
import './player.scss';



const ListItemForward = (props, ref) => {
  const { songs, onPlay, onCloseTrack } = props;
  let id = "";
  if (props.currentSong) {
    id = props.currentSong.id;
  }

  if (songs && songs.length !== 0) {
    return (
      <div className="track-info" ref={ref}>
        <div className="track-content">
          <span className="track-content-close" onClick={() => onCloseTrack()} >X</span>
          <div className="track-song">
            {songs && songs.map((song, index) => {
              return (
                <div key={index} className={song.id === id ? "song-item active" : "song-item"} >
                  <input type="checkbox" />
                  <div className="song-avatar">
                    <img
                      src={`${song.imageUrl}`}
                    />
                    <span className="play-btn" onClick={() => onPlay(songs, index)}></span>
                  </div>
                  <div>
                    <div className="song-info-name">{song.name}</div>
                    <div className="song-info-author">{song.author}</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="song-play-info">

          </div>
        </div>
      </div>
    )
  }
  return null;
}


const ListItem = React.forwardRef(ListItemForward);



const PlayerEditor = (props) => {
  // initalize reference
  const audioRef = React.useRef();
  const volumeRef = React.useRef();
  const playheadRef = React.useRef();
  const playRef = React.useRef();
  const speaker = React.useRef();
  const timelineRef = React.useRef();
  const volumeheadRef = React.useRef();
  const randomRef = React.useRef();
  const thumbSongRef = React.useRef();
  const listItemRef = React.useRef();
  const toggleIcon = React.useRef();

  const [timeStart, setTimeStart] = React.useState(0);
  const [timeEnd, setTimeEnd] = React.useState(0);
  const { options } = props;
  const tracks = props.tracks;
  const type = props.playType;
  const [playType, setPlayType] = React.useState(props.playType || 'order');
  const [songIndex, setSongIndex] = React.useState(props.indexId);
  const [song, setSong] = React.useState(null);

  React.useEffect(() => {
    audioRef.current && audioRef.current.addEventListener('canplay', () => {
      setTimeEnd(getDuration());
    });

    audioRef.current && audioRef.current.addEventListener('loadstart', () => {
      play();
    });

    audioRef.current && audioRef.current.addEventListener('ended', () => {
      pause();
    });

    // initalize currentTime
    audioRef.current && audioRef.current.addEventListener('timeupdate', () => {
      const rs = (getCurrentTime() * 100) / getDuration();
      setTimeStart(getCurrentTime());
      playheadRef.current.style.width = `${rs}%`;

      // play to end
      if (getDuration() === getCurrentTime()) {
        pause();
      }

    });

    // handler change current time
    timelineRef.current && timelineRef.current.addEventListener('click', (event) => {
      const offsetX = parseInt(event.offsetX);
      const totalWidth = parseInt(timelineRef.current.offsetWidth);
      const currentWidth = (offsetX * 100) / totalWidth;
      const currentTiming = (currentWidth * getDuration() / 100);
      audioRef.current.currentTime = currentTiming;
    })

    // handler change volume
    volumeRef.current && volumeRef.current.addEventListener('click', (event) => {
      const offsetX = parseInt(event.offsetX);
      const totalWidth = parseInt(volumeRef.current.offsetWidth);
      const currentVoluming = (offsetX * 100) / totalWidth;
      audioRef.current.volume = currentVoluming / 100;
      volumeheadRef.current.style.width = `${currentVoluming}%`;
      if (!offsetX) {
        mute();
      } else {
        unMute();
      }
    })
  }, []);

  React.useEffect(() => {
    getSong(tracks, songIndex);
  }, [tracks]);

  React.useEffect(() => {
    setPlayType(type);
  }, [type]);

  // change song by click director
  React.useEffect(() => {
    setSongIndex(props.indexId);
    getSong(tracks, props.indexId);
  }, [props.indexId]);



  const handlePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      play();
    } else {
      audioRef.current.pause();
      pause();
    }
  }

  const handleMute = () => {
    if (!audioRef.current.muted) {
      audioRef.current.muted = true;
      speaker.current.classList.add('mute');
    } else {
      audioRef.current.muted = false;
      speaker.current.classList.remove('mute');
    }
  }

  const getCurrentTime = () => {
    if (!audioRef.current) return '';
    return audioRef.current.currentTime;
  }

  const getDuration = () => {
    if (!audioRef.current) return '';
    return audioRef.current.duration;
  }

  const convertDuration = (duration) => {
    if (!duration) return '00:00';
    else {
      let minutes = parseInt(duration / 60, 10);
      let seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      return `${minutes}:${seconds}`;
    }
  }

  const pause = () => {
    playRef.current.classList.remove('paused');
    thumbSongRef.current.classList.remove('rotating');
  }

  const play = () => {
    playRef.current.classList.add('paused');
    thumbSongRef.current.classList.add('rotating');
  }

  const mute = () => {
    speaker.current.classList.add('mute');
  }

  const unMute = () => {
    speaker.current.classList.remove('mute');
  }

  /**
   * Fires when the current playlist is ended 
   */
  const getNextSong = () => {
    if (playType === 'order') {
      setSongIndex(songIndex + 1);
      getSong(tracks, songIndex + 1);
    }
    if (playType === 'random') {
      const randomIndx = getRandom(tracks);
      setSongIndex(randomIndx);
      getSong(tracks, randomIndx);
    }
  }

  const getPreviousSong = () => {
    if (!songIndex) {
      setSongIndex(songIndex);
      getSong(tracks, songIndex);
    } else {
      setSongIndex(songIndex - 1);
      getSong(tracks, songIndex - 1);
    }
  }

  /**
   * get src to play
   * @param {*} track 
   * @param {*} index 
   */

  const getSong = (track, index) => {
    if (track && track.length !== 0 && track.length > index) {
      setSong(track[index]);
      if (audioRef.current) {
        audioRef.current.load();
        audioRef.current.play();
      }
    }
  }

  const handleClickNextSong = () => {
    getNextSong();
  }
  const handlePreviousSong = () => {
    getPreviousSong();
  }

  const handleClickRandom = () => {
    if (playType === 'order') {
      setPlayType('random');
      randomRef.current.classList.add('active');
    } else {
      randomRef.current.classList.remove('active');
      setPlayType('order');
    }

  }

  /**
   * show/hide tracks
   */
  const toggleTracks = () => {
    if (listItemRef.current.classList.contains('show')) {
      listItemRef.current.classList.remove("show")
    } else {
      listItemRef.current.classList.add("show")
    }
    if (toggleIcon.current.classList.contains('change')) {
      toggleIcon.current.classList.remove("change")
    } else {
      toggleIcon.current.classList.add("change")
    }
  }

  return (
    <div className="player-bar" style={{
      display: (!tracks || tracks.length === 0) ? 'none' : 'block'
    }}>
      <div className="player">
        <div className="player-content">
          <audio
            ref={audioRef}
            {...options}
            onEnded={getNextSong}
          >
            <source src={song ? song.url : ''} />
          </audio>
          <div className="player-control">
            <div className="control-btn control-btn-previous only-pc">
              <a href="#" title="Previous" className="btn" onClick={handlePreviousSong}>
              </a>
            </div>

            <div className="control-btn control-btn-play" onClick={handlePlay}>
              <a href="#" title="Play/Pause" className='button' ref={playRef} >
              </a>
            </div>
            <div className="control-btn control-btn-next">
              <a href="#" title="Next" className="btn" onClick={handleClickNextSong}>
              </a>
            </div>
            <div className="control-btn control-btn-random only-pc" ref={randomRef}>
              <a href="#" title="Random" className="btn" onClick={handleClickRandom}>
              </a>
            </div>
            <div className="control-btn control-btn-loop only-pc">
              <a href="#" title="Loop" className="btn">
              </a>
            </div>

          </div>
          <div className="player-progress">
            <div className="progress-wrapper">
              <div className="progress-thumb-song rotating" ref={thumbSongRef}>
                <img
                  src={`${song ? song.imageUrl : ""}`}
                />
              </div>
              <div className="progress-info">
                <div className="player-info">
                  <div className="song-info">
                    <div>
                      <span className="song-info-name">{song ? song.name : ''} - </span>
                      <span className="song-info-author">{song ? song.author : ''}</span>
                    </div>
                  </div>
                  <div className="time-info only-pc">
                    <span>{convertDuration(timeStart)} </span>
                    <span>/ {convertDuration(timeEnd)}</span>
                  </div>
                </div>

                <div className="progress-timeline" ref={timelineRef}>
                  <div className="playhead" ref={playheadRef}></div>
                </div>
              </div>
            </div>


            <div className="progress-volume only-pc">
              <a href="#" title="Mute/Unmute" className="speaker" ref={speaker} onClick={handleMute}></a>
              <div className="volume-control">
                <div className="volume-timeline" ref={volumeRef}>
                  <div className="volumehead" ref={volumeheadRef}></div>
                </div>
              </div>
            </div>

          </div>
          <div className="player-track only-pc">
            <a href="#" title="Tracks list" className="" onClick={toggleTracks}> Track list({tracks ? tracks.length : '0'})</a>
          </div>
          <div className="player-track only-sp">
            <div class="toggle-icon only-sp" onClick={toggleTracks} ref={toggleIcon} >
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
            {/* <a href="#" title="Tracks list" className="" onClick={toggleTracks}> */}
            {/* </a> */}
          </div>
        </div>
      </div>
      <ListItem
        songs={tracks || []}
        onPlay={getSong}
        onCloseTrack={toggleTracks}
        currentSong={song}
        ref={listItemRef}
      />
    </div >
  )
}

export default PlayerEditor;