import { useRef, useEffect, useState } from "react";
import { FiVideo, FiVideoOff, FiMic, FiMicOff } from 'react-icons/fi';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import './ConsultationOptions.css';

const servers = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc;
let localStream;

async function makeCall(appointmentId, socket, remoteVideo, token) {
  try {
    console.log('Making call with appointmentId:', appointmentId);
    pc = new RTCPeerConnection(servers);
    pc.onicecandidate = e => {
      console.log('ICE candidate event:', e);
      const message = {
        type: 'candidate',
        candidate: e.candidate ? e.candidate.candidate : null,
        sdpMid: e.candidate ? e.candidate.sdpMid : null,
        sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : null,
        token,
        room: appointmentId
      };
      console.log('Sending ICE candidate:', message);
      socket.emit('message', message);
    };
    pc.ontrack = e => {
      console.log('Track event:', e);
      remoteVideo.current.srcObject = e.streams[0];
    };
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    const offer = await pc.createOffer();
    console.log('Created offer:', offer);
    await pc.setLocalDescription(offer);
    const message = { type: 'offer', sdp: offer.sdp, token, room: appointmentId };
    console.log('Sending offer:', message);
    socket.emit('message', message);
  } catch (e) {
    console.error('Error in makeCall:', e);
  }
}

async function handleOffer(offer, socket, remoteVideo, appointmentId, token) {
  console.log('Handling offer:', offer, 'for appointment', appointmentId);
  if (pc) {
    console.error('Existing peerconnection');
    return;
  }
  try {
    pc = new RTCPeerConnection(servers);
    pc.onicecandidate = e => {
      console.log('ICE candidate event:', e);
      const message = {
        type: 'candidate',
        candidate: e.candidate ? e.candidate.candidate : null,
        sdpMid: e.candidate ? e.candidate.sdpMid : null,
        sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : null,
        token,
        room: appointmentId
      };
      console.log('Sending ICE candidate:', message);
      socket.emit('message', message);
    };
    pc.ontrack = e => {
      console.log('Track event:', e);
      remoteVideo.current.srcObject = e.streams[0];
    };
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    console.log('Created answer:', answer);
    await pc.setLocalDescription(answer);
    const message = { type: 'answer', sdp: answer.sdp, token, room: appointmentId };
    console.log('Sending answer:', message);
    socket.emit('message', message);
  } catch (e) {
    console.error('Error in handleOffer:', e);
  }
}

async function handleAnswer(answer, appointmentId) {
  console.log('Handling answer:', answer, 'for appointment', appointmentId);
  if (!pc) {
    console.error('No peerconnection');
    return;
  }
  try {
    await pc.setRemoteDescription(answer);
  } catch (e) {
    console.error('Error in handleAnswer:', e);
  }
}

async function handleCandidate(candidate, appointmentId) {
  console.log('Handling candidate:', candidate, 'for appointment', appointmentId);
  try {
    if (!pc) {
      console.error('No peerconnection');
      return;
    }
    await pc.addIceCandidate(candidate);
  } catch (e) {
    console.error('Error in handleCandidate:', e);
  }
}

async function hangup() {
  console.log('Hanging up');
  if (pc) {
    pc.close();
    pc = null;
  }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }

  // Clear the video elements
  if (localVideo.current) {
    localVideo.current.srcObject = null;
  }
  if (remoteVideo.current) {
    remoteVideo.current.srcObject = null;
  }
}

function ConsultationOptions({ appointmentId, userId, specialistId, socket }) {
  const startButton = useRef(null);
  const hangupButton = useRef(null);
  const muteAudButton = useRef(null);
  const muteVidButton = useRef(null);
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const [audiostate, setAudio] = useState(true);
  const [videostate, setVideo] = useState(true);
  const [started, setStarted] = useState(false)
  const { user: authenticatedUser } = useAuthContext();  // Access the authenticated user

  useEffect(() => {
    if (authenticatedUser) {
      console.log('Authenticated user token:', authenticatedUser.token);

      console.log('Component mounted');

      socket.on('message', e => {
        console.log('Received message:', e);
        if (!localStream) {
          console.log('Not ready yet');
          return;
        }
        console.log('Current appointmentId:', appointmentId);
        switch (e.type) {
          case 'offer':
            console.log('Handling offer');
            handleOffer(e, socket, remoteVideo, appointmentId, authenticatedUser.token);
            break;
          case 'answer':
            console.log('Handling answer');
            handleAnswer(e, appointmentId);
            break;
          case 'candidate':
            console.log('Handling candidate');
            handleCandidate(e, appointmentId);
            break;
          case 'create-room':
          case 'join-room':
            console.log('Room created or joined');
            if (pc) {
              console.log('Already in call, ignoring');
              return;
            }
            console.log('Calling makeCall with appointmentId:', e.appointmentId);
            makeCall(appointmentId, socket, remoteVideo, authenticatedUser.token);  // Corrected this line to use appointmentId directly
            break;
          case 'bye':
            console.log('Handling bye');
            if (pc) {
              handleHangUpButton()
            }
            break;
          default:
            console.log('Unhandled message type:', e);
            break;
        }
      });

      hangupButton.current.disabled = true;
      muteAudButton.current.disabled = true;
      muteVidButton.current.disabled = true;
      startButton.current.disabled = false;
    }

  }, [appointmentId, userId, specialistId, socket, authenticatedUser]);

  const handleStartButton = async () => {
    console.log('Starting call with appointmentId:', appointmentId);
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: { 'echoCancellation': true } });
      localVideo.current.srcObject = localStream;
    } catch (err) {
      console.error('Error while getting local media stream:', err);
    }
    const message = { type: 'ready', token: authenticatedUser.token, room: appointmentId };
    console.log('Sending ready:', message);
    socket.emit('message', message);
        startButton.current.disabled = true;
    hangupButton.current.disabled = false;
    muteAudButton.current.disabled = false;
    muteVidButton.current.disabled = false;
    setStarted(true)
  };

  const handleHangUpButton = async () => {
    console.log('Hanging up call');
    hangup();
    const message = { type: 'bye', token: authenticatedUser.token, room: appointmentId };
    console.log('Sending bye:', message);
    socket.emit('message', message);
    startButton.current.disabled = false;
    hangupButton.current.disabled = true;
    muteAudButton.current.disabled = true;
    muteVidButton.current.disabled = true;
    if (localVideo.current.classList.contains('big-video')){
      localVideo.current.classList.remove('big-video');
      localVideo.current.classList.add('small-video');
      remoteVideo.current.classList.remove('small-video');
      remoteVideo.current.classList.add('big-video');
    }
    setStarted(false)
  };

  function muteAudio() {
    console.log('Toggling audio mute');
    if (audiostate) {
      localStream.getAudioTracks().forEach(track => track.enabled = false);
      setAudio(false);
    } else {
      localStream.getAudioTracks().forEach(track => track.enabled = true);
      setAudio(true);
    }
  }

  function muteVideo() {
    console.log('Toggling video mute');
    if (videostate) {
      localStream.getVideoTracks()[0].enabled = false;
      setVideo(false);
    } else {
      localStream.getVideoTracks()[0].enabled = true;
      setVideo(true);
    }
  }

  const toggleVideos = () => {
    if (localVideo.current.classList.contains('big-video')) {
      localVideo.current.classList.remove('big-video');
      localVideo.current.classList.add('small-video');
      remoteVideo.current.classList.remove('small-video');
      remoteVideo.current.classList.add('big-video');
    } else {
      localVideo.current.classList.remove('small-video');
      localVideo.current.classList.add('big-video');
      remoteVideo.current.classList.remove('big-video');
      remoteVideo.current.classList.add('small-video');
    }
  };


  return (
    <Container className='consultation-options'>
      <Row className='video bg-main'>
          <div className="video-container">
            <video ref={remoteVideo} className='video-item big-video' autoPlay playsInline onClick={started? toggleVideos: ()=>{console.log("not started")}}></video>
            <video ref={localVideo} className='video-item small-video' autoPlay playsInline muted onClick={started? toggleVideos: ()=>{console.log("not started")}}></video>
          </div>
      </Row>
      <Row className='btn'>
        <Col className='d-flex justify-content-center'>
          <Button className='btn-start' ref={startButton} onClick={handleStartButton}>Start</Button>
          <Button className='btn-end' ref={hangupButton} onClick={handleHangUpButton}>Hang</Button>
          {videostate ?
            <Button className='btn-start' ref={muteVidButton} onClick={muteVideo}><FiVideo /></Button> :
            <Button className='btn-end' ref={muteVidButton} onClick={muteVideo}><FiVideoOff /></Button>}
          {audiostate ?
            <Button className='btn-start' ref={muteAudButton} onClick={muteAudio}><FiMic /></Button> :
            <Button className='btn-end' ref={muteAudButton} onClick={muteAudio}><FiMicOff /></Button>}
        </Col>
      </Row>
      <Row className="chat-coming-soon">
        <Col>
          <p>Chat functionality is coming soon!</p>
        </Col>
      </Row>
    </Container>
  );
}

export default ConsultationOptions;
