  var textBtn = document.getElementById('btnPlay')
  textBtn.addEventListener('click', showYoutubeVideo);
  var player;

  function showYoutubeVideo() {
    console.log("showYoutubeVideo")
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  function youtube_parser(url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
  }

  function onYouTubeIframeAPIReady() {
    var txt = document.getElementById('txtUrl').value
    let ytId = youtube_parser(txt)
        console.log(ytId)
    player = new YT.Player('player', {
      height: '724',
      width: '724',
      videoId: ytId,
      playerVars: {
        controls:0,
        disablekb:1 
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    var txt = document.getElementById('txtUrl')
    txt.remove()
    var txtBtn = document.getElementById('btnPlay')
    textBtn.remove()
    // var txtLabel = document.getElementById('yt_text')
    // txtLabel.remove()

 const recordVideoBtn = document.getElementById('record_screen');
 recordVideoBtn.style.visibility = "visible";
  const stopButton = document.getElementById('stop');
 stopButton.style.visibility = "visible";


  }

  function onPlayerReady(event) {
    // event.target.playVideo();
  }
  var done = false;

  function onPlayerStateChange(event) {
    console.log(event)
    // if (event.data == YT.PlayerState.PLAYING && !done) {
    //   setTimeout(stopVideo, 6000);
    //   done = true;
    // }
  }

  function stopVideo() {
    player.stopVideo();
  }

  function playAudio() {
    player.playVideo()
  }