 let shouldStop = false;
 let stopped = false;
 const videoElement = document.getElementsByTagName("video")[0];
 const downloadLink = document.getElementById('download');
 const stopButton = document.getElementById('stop');
 const recordAudioBtn = document.getElementById('record_audio');
 const recordVideoBtn = document.getElementById('record_video');
 const recordScreenBtn = document.getElementById('record_screen');
 stopButton.addEventListener('click', function() {
     shouldStop = true;
    
     player.stopVideo()

 });
 // recordAudioBtn.addEventListener('click', recordAudio);
 // recordVideoBtn.addEventListener('click', recordVideo);
 stopButton.style.visibility = "hidden";
 recordScreenBtn.style.visibility = "hidden";
 recordScreenBtn.addEventListener('click',recordScreen);
 const audioRecordConstraints = {
     echoCancellation: true
 }


 function startRecord() {
     $('.btn-info').prop('disabled', true);
     $('#stop').prop('disabled', false);
     $('#download').css('display', 'none')
 }

 function stopRecord() {

     $('.btn-info').prop('disabled', false);
     $('#stop').prop('disabled', true);
      recordScreenBtn.style.display = "none";
     stopButton.style.display = "none";
     $('#download').css('display', 'block')

 }
 
 const makeid = function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
 const handleRecord = function({ stream, mimeType }) {
     startRecord()
     let recordedChunks = [];
     stopped = false;
     const mediaRecorder = new MediaRecorder(stream);

     mediaRecorder.ondataavailable = function(e) {
         if (e.data.size > 0) {
             recordedChunks.push(e.data);
         }

         if (shouldStop === true && stopped === false) {
             mediaRecorder.stop();
             stopped = true;
         }
     };

     mediaRecorder.onstop = function() {
         const blob = new Blob(recordedChunks, {
             type: mimeType
         });
         recordedChunks = []
         const filename = 'karaoke_' + makeid(5)
         downloadLink.href = URL.createObjectURL(blob);
         downloadLink.download = `${filename || 'recording'}.webm`;
         stopRecord();
         videoElement.srcObject = null;
     };

     mediaRecorder.start(200);
 };

 // async function recordAudio() {
 //     const mimeType = 'audio/webm';
 //     shouldStop = false;
 //     const stream = await navigator.mediaDevices.getUserMedia({ audio: audioRecordConstraints });
 //     handleRecord({ stream, mimeType })
 // }

 async function recordVideo() {
     const mimeType = 'video/webm';
     shouldStop = false;
     const constraints = {
         audio: {
             "echoCancellation": true
         },
         video: {
             "width": {
                 "min": 640,
                 "max": 1024
             },
             "height": {
                 "min": 480,
                 "max": 768
             }
         }
     };
     const stream = await navigator.mediaDevices.getUserMedia(constraints);
     videoElement.srcObject = stream;
     // handleRecord({ stream, mimeType })
 }

 async function recordScreen() {
    recordVideo()
     const mimeType = 'video/webm';
     shouldStop = false;
     const constraints = {
         video: {
             cursor: 'motion'
         }
     };
     if (!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)) {
         return window.alert('Screen Record not supported!')
     }
     let stream = null;
     const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: { cursor: "motion" }, audio: { 'echoCancellation': true } });
     if (window.confirm("Record audio with screen?")) {
         const audioContext = new AudioContext();

         const voiceStream = await navigator.mediaDevices.getUserMedia({ audio: { 'echoCancellation': true }, video: false });
         const userAudio = audioContext.createMediaStreamSource(voiceStream);

         const audioDestination = audioContext.createMediaStreamDestination();
         userAudio.connect(audioDestination);
         player.playVideo()
         if (displayStream.getAudioTracks().length > 0) {
             const displayAudio = audioContext.createMediaStreamSource(displayStream);
             displayAudio.connect(audioDestination);
         }

         const tracks = [...displayStream.getVideoTracks(), ...audioDestination.stream.getTracks()]
         stream = new MediaStream(tracks);
         handleRecord({ stream, mimeType })
     } else {
         stream = displayStream;
         handleRecord({ stream, mimeType });
     };
     document.getElementById("stop").style.display = "inline-block"
    document.getElementById("record_screen").style.display = "none"
     //videoElement.srcObject = stream;
 }
