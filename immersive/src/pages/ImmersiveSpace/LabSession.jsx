import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { IoMdExit } from "react-icons/io";
import PdfViewer from "../../components/ImmersiveSpace/PDFViewer";
import VideoViewer from "../../components/ImmersiveSpace/VideoViewer";
import wallTexture from "../../assets/ImmersiveSpace/textures/blueWall2.jpg";
import floorTexture from "../../assets/ImmersiveSpace/textures/floor6.jpg";
import ceilingTexture from "../../assets/ImmersiveSpace/textures/ceilingLamps.jpg"
import teacherDesk from "../../assets/ImmersiveSpace/3D_Components/teacher_desk.glb";
import ProjectorScreen from "../../assets/ImmersiveSpace/3D_Components/projector_screen.glb"; 
import Projector from "../../assets/ImmersiveSpace/3D_Components/projector.glb"; 
import WindowBlind from "../../assets/ImmersiveSpace/3D_Components/window.glb";
import DeskEntity from '../../components/ImmersiveSpace/DeskEntity.jsx';
import deskShelf from "../../assets/ImmersiveSpace/3D_Components/ikea_fjallbo_wall_shelf.glb";
import arduinoProject1 from "../../assets/ImmersiveSpace/3D_Components/arduino_uno2.glb";
import motor1 from "../../assets/ImmersiveSpace/3D_Components/motor1.glb";
import SharedDesk from "../../components/ImmersiveSpace/SharedDesk.jsx";
import securityCamera from "../../assets/ImmersiveSpace/3D_Components/security_camera.glb";
import AC from "../../assets/ImmersiveSpace/3D_Components/conditioner_slide_dc.glb";
import ToOfferLights from "../../components/ImmersiveSpace/TofferLights";
import { useNavigate , useParams } from "react-router-dom";
import LoadingScreen from '../../components/ImmersiveSpace/LoadingScreen.jsx';
const Boy = process.env.PUBLIC_URL + '/assets/boy/scene.gltf';




function LabSession(){
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

    const handleExit = () => {
      navigate('/my-space/sessions');
    };
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
      <div className='App' >
          <a-scene ref={sceneRef} loading-screen="enabled:false;"  >
              <a-assets>
                  {assets.map((asset) => (
                      <a-asset-item key={asset.idAsset} id={asset.idAsset} src={asset.url}></a-asset-item>
                  ))}
                  <img id="wallTexture" src={wallTexture} alt="name"/>
                  <img id="floorTexture" src={floorTexture}  alt="name"/>
                  <img id="ceilingTexture" src={ceilingTexture} alt="name" />
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
                  <a-plane 
                        position={`${asset.properties.position.x} ${asset.properties.position.y + 1} ${asset.properties.position.z}`} 
                        width="2"               
                        height="0.5" 
                        rotation={`${asset.properties.rotation.x} ${asset.properties.rotation.y} ${asset.properties.rotation.z}`}
                        color="#000000"         
                        opacity="0.3"
                        look-at="#camera"           
                    ></a-plane>
                  <a-text
                    value={asset.name} // Assuming you want to display the asset ID as the name
                    position={`${asset.properties.position.x} ${asset.properties.position.y + 1} ${asset.properties.position.z}`} // Adjust the Y position to place the text above the model
                    align="center"
                    rotation={`${asset.properties.rotation.x} ${asset.properties.rotation.y} ${asset.properties.rotation.z}`}
                    color="white" // You can change the color as needed
                  ></a-text>
                </a-entity>
              ))}
        

        {users.map((user) => (
                    <a-entity
                    key={user.id}
                    position={`${user.position.x} 0 ${user.position.z}`}
                    rotation={`${user.rotation.x} ${user.rotation.y} ${user.rotation.z}`}
                    >
                    {user.gender === 'men' && (
                    <a-gltf-model
                        src={Boy}
                        scale="8 8 8"
                        {...(user.isMoving && { 'animation-mixer': '' })} // Conditionally add animation-mixer if user is moving
                    ></a-gltf-model>
                    )}
                    {user.gender === 'women' && (
                    <a-gltf-model
                        src={Boy}
                        scale="8 8 8"
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
                  scale="5 5 5"
                  position="39 11 -17"
                  rotation="0 -90 0"
                  />
              
                  <PdfViewer 
                  pdf={course?.coursepdf || ''}
                  scale={2.5}
                  rotation="0 -90 0"
                  position="32 5 20" />
              

                  <ToOfferLights />
              {/* Floor */}
              <a-plane 
                  rotation="-90 0 0" 
                  width="80" // Doubled the width
                  height="80" // Doubled the height
                  material={`src: url(${floorTexture}); repeat: 4 5`}  
                  class="collidable"
              />
              {/* Teacher Desk */}
              <a-gltf-model 
                   src={teacherDesk} 
                   position="-30 1.9 0" 
                   scale=".09 .09 .09"
                   rotation="0 180 0"
                  class="collidable"
              ></a-gltf-model>
               {/* Walls */}
              <a-box 
                  position="0 10 -40" 
                  rotation="0 0 0" 
                  width="80" 
                  height="20" 
                  depth="0.1" 
                  material={`src: url(${wallTexture}); repeat: 4 2`}  
                  src={wallTexture}
                  class="collidable "

              />

              <a-box 
                  position="40 10 0" 
                  rotation="0 -90 0" 
                  width="80" 
                  height="20" 
                  depth="0.1" 
                  material={`src: url(${wallTexture}); repeat: 4 2`}  
                  src={wallTexture}
                  repeat="4 2"
                  class="collidable "
              />

              <a-box 
                  position="-40 10 0" 
                  rotation="0 90 0" 
                  width="80" 
                  height="20" 
                  depth="0.1" 
                  material={`src: url(${wallTexture}); repeat: 4 2`}  
                  src={wallTexture}
                  class="collidable "
              />

              <a-box 
                  position="0 10 40" 
                  rotation="0 180 0" 
                  width="80" 
                  height="20" 
                  depth="0.1" 
                  material={`src: url(${wallTexture});repeat: 4 2`}  
                  src={wallTexture}
                  class="collidable "
              />

              {/* Ceiling */}
              <a-plane 
                  position="0 20 0" 
                  rotation="90 0 0" 
                  width="80" 
                  height="80" 
                  material={`src: url(${ceilingTexture}); repeat: 2 3`}  
                  src={ceilingTexture}
                  class="collidable"
              />

              {/* Projector screen */}
              <a-gltf-model 
                  src={ProjectorScreen} 
                  position="79 30 -17" 
                  scale="4 10 6"
                  rotation="0 0 0"
              ></a-gltf-model>
              {/*The video is projected in the projetor screen */}


              {/* Projector  */}
              <a-gltf-model 
                  src={Projector} 
                  position="50 33 -17" 
                  scale="10 10 10"
                  rotation="0 90 0"
              ></a-gltf-model>

              <a-entity>
                  <a-gltf-model 
                      src={WindowBlind} 
                      position="-18 8 39.5" 
                      scale="2 2 2"
                      rotation="0 0 0"
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={WindowBlind} 
                      position="0 8 39.5" 
                      scale="2 2 2"
                      rotation="0 0 0"
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={WindowBlind} 
                      position="18 8 39.5" 
                      scale="2 2 2"
                      rotation="0 0 0"
                  ></a-gltf-model>
              </a-entity>

              <a-entity>
                  <a-gltf-model 
                      src={WindowBlind} 
                      position="-18 8 -39.5" 
                      scale="2 2 2"
                      rotation="0 180 0"
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={WindowBlind} 
                      position="0 8 -39.5" 
                      scale="2 2 2"
                      rotation="0 180 0"
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={WindowBlind} 
                      position="18 8 -39.5" 
                      scale="2 2 2"
                      rotation="0 180 0"
                  ></a-gltf-model>
              </a-entity>


              {/* Desks with chairs with lights and pcs */}
              <DeskEntity position="-24 0 -36" rotation="0 0 0"/>
              <DeskEntity position="-12 0 -36" rotation="0 0 0"/>
              <DeskEntity position="0 0 -36"rotation="0 0 0" />
              <DeskEntity position="12 0 -36" rotation="0 0 0"/>
              <DeskEntity position="24 0 -36" rotation="0 0 0"/>


              <DeskEntity position="-24 0 36" rotation="0 180 0"/>
              <DeskEntity position="-12 0 36" rotation="0 180 0"/>
              <DeskEntity position="0 0 36" rotation="0 180 0"/>
              <DeskEntity position="12 0 36" rotation="0 180 0"/>
              <DeskEntity position="24 0 36" rotation="0 180 0"/>



              <SharedDesk position='0 0 0' rotation='0 0 0'/>
              <SharedDesk position='0 0 -20' rotation='0 0 0'/>
     
              <a-entity>
                  <a-gltf-model 
                      src={deskShelf} 
                      position="34.5 5 -38.7" 
                      scale="13 13 8"
                      rotation="0 -90 0"
                      class="collidable"
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={arduinoProject1} 
                      position="33 6.9 -38" 
                      scale=".5 .5 .5"
                      rotation="0 0 0"
                      class="collidable"
                      grabbable
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={deskShelf} 
                      position="34.5 8 -38.7" 
                      scale="13 13 8"
                      rotation="0 -90 0"
                      class="collidable"
                  ></a-gltf-model>
                  <a-gltf-model 
                      src={motor1} 
                      position="35 9.4 -38.5" 
                      scale="6 6 6"
                      rotation="0 90 0"
                      class="collidable"
                  ></a-gltf-model>
              </a-entity>
              
                <a-gltf-model  
                    src={securityCamera}
                    position="-39 20 -39"
                    scale=".5 .5 .5"
                    rotation="180 -120 0"
                ></a-gltf-model>
                <a-gltf-model  
                    src={securityCamera}
                    position="39 20 39"
                    scale=".5 .5 .5"
                    rotation="180 50 0"
                ></a-gltf-model>


            <a-gltf-model 
                src={ProjectorScreen} 
                position="39.4 15 -17" 
                scale="2 4 4"
                rotation="0 0 0"
                class="collidable"
            ></a-gltf-model>

            <a-gltf-model 
                src={Projector} 
                position="30 18 -17" 
                scale="5 5 5"
                rotation="0 90 0"
                
            ></a-gltf-model>

              <a-gltf-model  
                  src={AC}
                  position="39 18 5"
                  rotation="0 -90 0"
                  scale="13 9 4"
              ></a-gltf-model>
              <a-gltf-model  
                  src={AC}
                  position="-39 18 0"
                  rotation="0 90 0"
                  scale="13 9 4"
              ></a-gltf-model>  

              <a-entity
                  id="camera"
                  camera
                  look-controls
                  my-custom-look-controls
                  camera-collider="speed: 1; radius: 0.5"
                  ref={cameraRef}
                  rotation="0 0 0"
                  position="10 12 0"
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
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
      <button style={{ position: 'fixed',top: '20px', right: '20px', zIndex: '1000' }} className="btn  btn-danger" onClick={handleExit}><IoMdExit/> Exit</button>
      </div>

  );
}
export default LabSession;