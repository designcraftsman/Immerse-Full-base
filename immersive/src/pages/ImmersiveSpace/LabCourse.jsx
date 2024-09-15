import { useEffect, useRef, useState } from 'react';
import PdfViewer from "../../components/ImmersiveSpace/PDFViewer";
import { IoMdExit } from "react-icons/io";
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



function Course(){
 const sceneRef = useRef(null);
 const cameraRef = useRef(null);
 const navigate = useNavigate();
 const [assets, setAssets] = useState([]);
 const [course, setCourse] = useState(null);
 const { idCourse } = useParams();
 const [loading, setLoading] = useState(true); // Loading state
 const [progress, setProgress] = useState(0); // Progress state

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
    setCourse(jsonData.course);
    setProgress((prev) => prev + 50); // Increase progress after course is fetched
  } catch (error) {
    console.error('Error:', error);
  }
};


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
        setProgress((prev) => prev + 50); // Increase progress after course is fetched
      } catch (error) {
        console.error('Error:', error);
      }
    };
    const handleExit = () => {
      navigate('/');
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
      <LoadingScreen text="Loading Resources..."/>
      )
    }
  return(
      <div className='App'>
          <a-scene ref={sceneRef} loading-screen="enabled:false;"  >
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
    {asset.properties ? (
      <>
        <a-gltf-model
          class="selectable uploadedAssets"
          src={asset.url}
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
          position={`${asset.properties.position.x} ${asset.properties.position.y + 3} ${asset.properties.position.z}`} // Adjust the Y position to place the text above the model
          align="center"
          rotation={`${asset.properties.rotation.x} ${asset.properties.rotation.y} ${asset.properties.rotation.z}`}
          color="white" // You can change the color as needed
        ></a-text>
      </>
    ) : null}
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
                  position="10 8 0"
                  >
                  <a-cursor></a-cursor>
              </a-entity>

          </a-scene>
          <button style={{ position: 'fixed',top: '20px', right: '20px', zIndex: '1000' }} className="btn  btn-danger" onClick={handleExit}><IoMdExit/> Exit</button>
      </div>

  );
}
export default Course;