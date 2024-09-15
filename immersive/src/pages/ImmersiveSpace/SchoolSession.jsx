import React from "react";
import { io } from 'socket.io-client';
import { IoMdExit } from "react-icons/io";
import { useEffect, useRef, useState } from 'react';
import { IoMdMic } from "react-icons/io";
import { IoMdMicOff } from "react-icons/io";
import PdfViewer from "../../components/ImmersiveSpace/PDFViewer";
import VideoViewer from "../../components/ImmersiveSpace/VideoViewer";
import wallTexture from "../../assets/ImmersiveSpace/textures/blueWall2.jpg";
import floorTexture from "../../assets/ImmersiveSpace/textures/floor6.jpg";
import ceilingTexture from "../../assets/ImmersiveSpace/textures/ceilingLamps.jpg";
import ProjectorScreen from "../../assets/ImmersiveSpace/3D_Components/projector_screen.glb"; 
import Projector from "../../assets/ImmersiveSpace/3D_Components/projector.glb"; 
import AC from "../../assets/ImmersiveSpace/3D_Components/conditioner_slide_dc.glb";
import tofferLights from "../../assets/ImmersiveSpace/3D_Components/troffer_light_3d_model.glb";
import schoolHall from "../../assets/ImmersiveSpace/3D_Components/theater_cinema_auditorium_style_1_of_2.glb";
import woodTexture from "../../assets/ImmersiveSpace/textures/wood5.webp";
import podium from "../../assets/ImmersiveSpace/3D_Components/podium.glb";
import roundDesk from "../../assets/ImmersiveSpace/3D_Components/secretary_desk_-_20mb.glb";
import officeChair from "../../assets/ImmersiveSpace/3D_Components/office_chair_modern.glb";
import laptop from "../../assets/ImmersiveSpace/3D_Components/laptop_free.glb";
import deskLights from "../../assets/ImmersiveSpace/3D_Components/desk_lamp_grren.glb"
import { useNavigate , useParams } from "react-router-dom";
import LoadingScreen from '../../components/ImmersiveSpace/LoadingScreen.jsx';
const Boy = process.env.PUBLIC_URL + '/assets/boy/scene.gltf';



function SchoolSession(){
    const lampPositions = [
        // First row
        [{ x: 0, z: 93 }, { x: -40, z: 93 }, { x: 40, z: 93 }, { x: -80, z: 93 }, { x: 80, z: 93 }],
        // Second row
        [{ x: 0, z: 50 }, { x: -40, z: 50 }, { x: 40, z: 50 }, { x: -80, z: 50 }, { x: 80, z: 50 }, { x: 120, z: 50 }, { x: -120, z: 50 }],
        // Third row
        [{ x: 0, z: 0 }, { x: -40, z: 0 }, { x: 40, z: 0 }, { x: -80, z: 0 }, { x: 80, z: 0 }, { x: 120, z: 0 }, { x: -120, z: 0 }, { x: 160, z: 0 }, { x: -160, z: 0 }],
        // Fourth row
        [{ x: 0, z: -50 }, { x: -40, z: -50 }, { x: 40, z: -50 }, { x: -80, z: -50 }, { x: 80, z: -50 }, { x: 120, z: -50 }, { x: -120, z: -50 }, { x: 160, z: -50 }, { x: -160, z: -50 }, { x: 200, z: -50 }, { x: -200, z: -50 }]
    ];
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [course, setCourse] = useState(null);
    const [gender] = useState(sessionStorage.getItem('gender'));
    const { sessionName,idCourse, username } = useParams();
    const [loading, setLoading] = useState(true); // Loading state
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [audio, setAudio] = useState(false);
    const socketRef = useRef();
    const messageEndRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [userJoin , setUserJoin] = useState([]);
   
    const getCourse = async () => {
     try {
       const response = await fetch(`http://localhost:4200/courses/get/course/${idCourse}`, {
         method: 'GET',
         headers: {
           'Content-Type': 'application/json',
         },
       });
       if (!response.ok) {
         throw new Error('Failed to fetch course');
       }
       const jsonData = await response.json();
       console.log(jsonData);
       setCourse(jsonData.course);
     } catch (error) {
       console.error('Error:', error);
     }
   };
   const handleExit = () => {
    navigate('/my-space/sessions');
  };
   useEffect(() => {
    socketRef.current = io('http://localhost:4200');
  
    socketRef.current.emit('joinRoom', { username, room: sessionName, gender });
  
    socketRef.current.on('userJoin', ({ id, username, position, rotation, isMoving, gender }) => {
      setUserJoin((prevUsers) => [...prevUsers, { id, username, position, rotation, isMoving, gender }]);
    });
  
    socketRef.current.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  
    socketRef.current.on('userLeave', (id) => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    });
  
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [sessionName, username, gender]);
  

  useEffect(() => {
    socketRef.current.on('updateUserPosition', ({ id, username, position, rotation, gender }) => {
      setUsers((prevUsers) => {
        // Create a new array of users with updated positions and rotation
        const updatedUsers = prevUsers.map((user) =>
          user.id === id
            ? { ...user, position, rotation, isMoving: user.position.x !== position.x, gender }
            : user
        );
  
        // If the user is new, add them to the list
        if (!prevUsers.find((user) => user.id === id)) {
          updatedUsers.push({ id, username, position, rotation, isMoving: false, gender });
        }
  
        return updatedUsers;
      });
    });
  }, []);
  
  
  useEffect(() => {
    if (audio) {
      socketRef.current.on('usersAudioStream', (audioData, socketId) => {
        if (socketId !== socketRef.current.id) {
          const audio = new Audio(audioData);
          if (!audio || document.hidden) {
            return;
          }
          audio.play();
        }
      });
    }
  }, [audio]); // This will only trigger when the microphone is toggled
  
  useEffect(() => {
  
    const updateCameraPosition = () => {
      const scene = sceneRef.current;
      if (!scene) return;
  
      const camera = scene.querySelector('#camera');
      if (!camera) return;
  
      const position = camera.getAttribute('position');
      let rotation = camera.getAttribute('rotation');
  
      if (!position || !rotation) return;
  
      // Ignore vertical (up/down) rotation by setting rotation.x to 0
      const distanceInFront = 2;
      const radianY = (rotation.y * Math.PI) / 180;
      
      // Adjusted position (ignoring rotation.x)
      const adjustedPosition = {
        x: position.x + Math.sin(radianY) * distanceInFront,
        y: position.y, // Keep the same y position to avoid vertical movement
        z: position.z + Math.cos(radianY) * distanceInFront,
      };
  
      // Adjusted rotation (ignore vertical rotation for movement purposes)
      const adjustedRotation = {
        x: 0, // Prevent up/down rotation (ignore rotation.x)
        y: (rotation.y + 180) % 360,
        z: rotation.z,
      };
  
      const animation = position.x !== adjustedPosition.x || position.z !== adjustedPosition.z ? 'walk' : 'idle';
  
      if (socketRef.current) {
        socketRef.current.emit('updatePosition', {
          position: adjustedPosition,
          rotation: adjustedRotation,
          animation,
        });
      }
    };
  
    const interval = setInterval(() => {
      updateCameraPosition();
    }, 100);
  
    return () => clearInterval(interval);
  
  }, [username, sceneRef]);
  // Adjusted dependencies
  
    
  

  useEffect(() => {
    let mediaRecorder;
    let audioStream;
  
    if (audio) {
      // Get microphone input
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
          if (!audio) return; // Exit if audio is turned off before the stream is ready
  
          audioStream = stream;
          mediaRecorder = new MediaRecorder(stream);
          let audioChunks = [];
  
          mediaRecorder.addEventListener("dataavailable", function (event) {
            audioChunks.push(event.data);
          });
  
          mediaRecorder.addEventListener("stop", function () {
            if (!audioStream || !audioStream.active) return; // Prevent errors if stream is inactive
  
            const audioBlob = new Blob(audioChunks, { type: 'audio/ogg; codecs=opus' });
            audioChunks = [];
            const fileReader = new FileReader();
            fileReader.readAsDataURL(audioBlob);
            fileReader.onloadend = function () {
              const base64String = fileReader.result;
              socketRef.current.emit("audioStream", base64String); // Send the audio stream to the server
            };
  
            // Restart recording if audio is still true and stream is active
            if (audio && audioStream.active) {
              mediaRecorder.start();
              setTimeout(function () {
                mediaRecorder.stop();
              }, 1000); // Stop after 1 second
            }
          });
  
          // Start the recording
          mediaRecorder.start();
          setTimeout(function () {
            mediaRecorder.stop();
          }, 1000); // Record for 1 second
        })
        .catch((error) => {
          console.error('Error capturing audio.', error);
        });
    }
  
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop()); // Stop all audio tracks
      }
  
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop(); // Ensure the recorder is stopped
      }
    };
  }, [audio]);
  
  
const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      socketRef.current.emit('chatMessage', newMessage);
      setNewMessage('');
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
   
       const getAssets = async () => {
        
         try {
           const response = await fetch(`http://localhost:4200/assets/get/course/${idCourse}`, {
             method: 'GET',
             headers: {
               'Content-Type': 'application/json',
             },
           });
       
           if (!response.ok) {
             throw new Error('Failed to save model data');
           }
       
           const jsonData = await response.json();
           setAssets(jsonData.assets);
         } catch (error) {
           console.error('Error:', error);
         }
       };
       const EnableVoiceCall = () => {
        setAudio(true); 
      };
      const DisableVoiceCall = () => {
        setAudio(false);
      };
       useEffect(() => {
         const fetchData = async () => {
           await getAssets();
           await getCourse();
     
           // Delay before setting loading to false
           setTimeout(() => {
             setLoading(false);
           }, 5000); 
         };
     
         fetchData();
       }, [idCourse]);
   
   
       if (loading) {
         return (
         <LoadingScreen text="Loading..." />
         )
       }
    return(
        <div className='App'>
            <a-scene ref={sceneRef} loading-screen="enabled:false;"   >
            <a-assets>
                  {assets.map((asset) => (
                      <a-asset-item key={asset.idAsset} id={asset.idAsset} src={asset.url}></a-asset-item>
                  ))}
                  <img id="wallTexture" src={wallTexture} />
                  <img id="floorTexture" src={floorTexture} />
                  <img id="ceilingTexture" src={ceilingTexture} />
                  <a-asset-item id="video" src={course?.video || ''}></a-asset-item>
                  <a-asset-item id="pdf" src={course?.coursepdf || ''}></a-asset-item>
              </a-assets>


              {assets.map((asset, index) => (
                <a-entity key={asset.idAsset}>
                  {/* GLTF Model */}
                  <a-gltf-model
                    class="selectable uploadedAssets"
                    src={`#${asset.idAsset}`} alt="Asset" 
                    position={`${asset.properties.position.x} ${asset.properties.position.y} ${asset.properties.position.z}`}
                    scale={`${asset.properties.scale.x} ${asset.properties.scale.y} ${asset.properties.scale.z}`}
                    rotation={`${asset.properties.rotation.x} ${asset.properties.rotation.y} ${asset.properties.rotation.z}`}
                  ></a-gltf-model>
                  
                  {/* Asset Name */}
                  <a-text
                    value={asset.name} // Assuming you want to display the asset ID as the name
                    position={`${asset.properties.position.x} ${asset.properties.position.y + 1} ${asset.properties.position.z}`} // Adjust the Y position to place the text above the model
                    align="center"
                    color="white" // You can change the color as needed
                  ></a-text>
                </a-entity>
              ))}

                {users.map((user) => (
                    <a-entity
                    key={user.id}
                    position={`${user.position.x} -18.5 ${user.position.z}`}
                    rotation={`${user.rotation.x} ${user.rotation.y} ${user.rotation.z}`}
                    >
                    {user.gender === 'men' && (
                    <a-gltf-model
                        src={Boy}
                        scale="12 12 12"
                        {...(user.isMoving && { 'animation-mixer': '' })} // Conditionally add animation-mixer if user is moving
                    ></a-gltf-model>
                    )}
                    {user.gender === 'women' && (
                    <a-gltf-model
                        src={Boy}
                        scale="1 1 1"
                        {...(user.isMoving && { 'animation-mixer': '' })} // Conditionally add animation-mixer if user is moving
                    ></a-gltf-model>
                    )}
                    {/* Username centered above the avatar */}
                    <a-text 
                        value={user.username} 
                        position="0 22 0"  
                        align="center"      
                        color="#FFF"       
                        width="4"   
                        scale="5 5 5"
                        look-at="#camera"       
                    ></a-text>
                    <a-plane 
                        position="0 22 -0.1"    
                        width="8"               
                        height="2"              
                        color="#000000"         
                        opacity="0.3"
                        look-at="#camera"           
                    ></a-plane>
                    </a-entity>
                ))}
              
                  <VideoViewer 
                    position="0 30 145"
                    rotation="0 180 0"
                    scale="20 20 20"
                  />
              

              
                  <PdfViewer 
                  pdf={course.coursepdf ? course.coursepdf : ''}
                  scale={4}
                    rotation="-2 210 0"
                    position="50 0 115"
                  />
            

                {lampPositions.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        {row.map((pos, lampIndex) => (
                            <React.Fragment key={lampIndex}>
                                <a-gltf-model src={tofferLights} scale="3 3 3" position={`${pos.x} 101 ${pos.z}`} rotation="0 90 0"></a-gltf-model>
                                {(lampIndex % 2 == 0) && ( <a-light type="spot" position={`${pos.x} 40 ${pos.z}`} intensity="0.9" distance="80" angle="45" penumbra="0.3" castShadow="true" rotation="-90 0 0" color="#fff4bf"></a-light>)}
                            </React.Fragment>
                        ))}
                    </React.Fragment>
                ))}
                <a-entity light="type: directional; color: #fffaa1; intensity: 0.6" position="0 100 30"></a-entity>

                <a-light type="spot" position="0 80 40" intensity="11" distance="100" color="fffbb8" angle="60" penumbra="0.5" castShadow="true" rotation="-90 0 0"></a-light>

                <a-entity light="type: ambient; intensity: 0.1"></a-entity>



                <a-box position="0 -20 85" class="collidable" width="250" height="3" depth="60" material={`src: url(${woodTexture});`}   ></a-box>
                <a-box position="0 -17 133" class="collidable" width="250" height="3" depth="40" material={`src: url(${woodTexture});`}  ></a-box> 

                <a-gltf-model src={schoolHall} scale=".37 .37 .37" position="0 -20 0"></a-gltf-model>

                <a-box class="collidable" position="0 30 152.6" width="310" height="150" depth="1" material={`src: url(${wallTexture});`}></a-box>
                
                {/*Collision Walls */}
                <a-box class="collidable" position="152 30 152.6" rotation="0 90 0" width="120" height="150" depth="1" material={`src: url(${wallTexture});`}></a-box>
                <a-box class="collidable" position="-152 30 152.6" rotation="0 90 0" width="120" height="150" depth="1" material={`src: url(${wallTexture});`}></a-box>
                {/*Floor collider */}
                <a-box class="collidable" position="0 -22 0" rotation="0 0 0" width="350" height=".1" depth="350" material={`src: url(${wallTexture});`}></a-box>
                {/*Ceiling collider */}
                <a-box class="collidable" position="0 105 0" rotation="0 0 0" width="350" height=".1" depth="350" material={`src: url(${wallTexture});`}></a-box>

                
                <a-gltf-model id="projectorScreen" src={ProjectorScreen} scale="20 20 20" position="0 60 150" rotation="0 90 0"></a-gltf-model>


                <a-gltf-model src={podium} scale="1 1 1" position="0 -13 109" rotation="0 180 0"></a-gltf-model>
                <a-gltf-model src={roundDesk} scale="10 10 10" position="0 -18 90" rotation="0 180 0"></a-gltf-model>
                <a-gltf-model src={laptop} scale=".03 .03 .03" position="0 -8 82"></a-gltf-model>
                <a-gltf-model src={deskLights} scale="3 3 3" position="-15 -8 82" rotation="0 43 0"></a-gltf-model>

                <a-light type="spot" position="-15 -4 82" intensity="11" distance="20" angle="60" penumbra="0.5" castShadow="true" rotation="-90 0 0"></a-light>

                <a-gltf-model src={officeChair} scale="14 14 14" position="0 -18 93" rotation="0 224 0"></a-gltf-model>

                {/* Projector  */}
                <a-gltf-model 
                    src={Projector} 
                    position="0 90 -17" 
                    scale="20 30 20"
                    rotation="0 0 0"
                ></a-gltf-model>


   

                <a-gltf-model  
                    src={AC}
                    position="39 78 -185"
                    rotation="0 0 0"
                    scale="30 20 20"
                ></a-gltf-model>
                <a-gltf-model  
                    src={AC}
                    position="-39 78 -185"
                    rotation="0 0 0"
                    scale="30 20 20"
                ></a-gltf-model>  
                <a-gltf-model  
                    src={AC}
                    position="80 78 -185"
                    rotation="0 0 0"
                    scale="30 20 20"
                ></a-gltf-model>
                <a-gltf-model  
                    src={AC}
                    position="-80 78 -185"
                    rotation="0 0 0"
                    scale="30 20 20"
                ></a-gltf-model>  

                <a-gltf-model  
                    src={AC}
                    position="200 78 -155"
                    rotation="0 -20 0"
                    scale="30 20 20"
                ></a-gltf-model>
                <a-gltf-model  
                    src={AC}
                    position="-200 78 -155"
                    rotation="0 20 0"
                    scale="30 20 20"
                ></a-gltf-model>  

                
                <a-entity
                    id="camera"
                    camera
                    look-controls
                    my-custom-look-controls
                    camera-collider="speed: 1; radius: 0.5"
                    ref={cameraRef}
                    rotation="0 180 0"
                    position="0 4 50"
                    >
                    <a-cursor></a-cursor>
                </a-entity>
                
            </a-scene>
            <div
        className="chat-box position-fixed bottom-0 start-0 p-3 m-3 shadow-lg"
        style={{
          width: '500px',
          maxHeight: '300px',
          overflowY: 'auto',
          backgroundColor: 'rgba(0, 0, 0, 0.20)',
          borderRadius: '8px',
        }}
      >
        <div className="messages opacity-100">
          {messages.map((msg, index) => (
            <div key={index} className="message bg-transparent text-white p-0 mb-0 rounded m-0 p-0">
              <p className="text-start mb-2">
                <span className="fw-bold text-info">{msg.username}:</span> {msg.text} <br />
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>{msg.time}</span>
              </p>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="input-group mt-2">
          <input
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="btn btn-primary text-white fw-bold rounded-end " onClick={handleSendMessage}>
            Send
          </button>
          { !audio && (
          <span role="button" className="text-white fs-5 ms-3 "  onClick={EnableVoiceCall}>
            <IoMdMic/>
          </span>
          )}
          { audio && (
          <span role="button" className="text-white fs-5 ms-3 " onClick={DisableVoiceCall}>
            <IoMdMicOff />
          </span>
          )}
          
        </div>
      </div>
      <button style={{ position: 'fixed',top: '20px', right: '20px', zIndex: '1000' }} className="btn  btn-danger" onClick={handleExit}><IoMdExit/> Exit</button>
      </div>
    );
}
export default SchoolSession;