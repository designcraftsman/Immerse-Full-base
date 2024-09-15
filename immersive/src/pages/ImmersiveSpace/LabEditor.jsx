import { GrResources } from "react-icons/gr";
import { FaRegFilePdf } from "react-icons/fa";
import { IoHelp } from "react-icons/io5";
import { TbArrowsMove } from "react-icons/tb";
import { CiVideoOn } from "react-icons/ci";
import { useEffect, useRef, useState } from 'react';
import { selectObject, modifyObjectWithKeys } from '../../components/ImmersiveSpace/ObjectManipulation'; // Import functions
import PdfViewer from "../../components/ImmersiveSpace/PDFViewer";
import PDF from "../../assets/ImmersiveSpace/pdf/Rapport.pdf";
import VideoViewer from "../../components/ImmersiveSpace/VideoViewer";
import { IoCloseSharp } from "react-icons/io5";
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
import { useNavigate , useParams } from "react-router-dom";


function LabEditor(){
 const sceneRef = useRef(null);
 const cameraRef = useRef(null);
 const navigate = useNavigate();
 const [assets, setAssets] = useState([]);
 const [course, setCourse] = useState(null);
 const { idCourse } = useParams();
// Separate PDF state for managing its visibility
const [pdf, setPdf] = useState({ id: 'PDF', name: 'Course PDF', visible: false });
const [video, setVideo] = useState({ id: 'Video', name: 'Course Video', visible: false });

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
    console.log(jsonData.course);
    setCourse(jsonData.course);
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
      throw new Error('Failed to fetch assets');
    }
    const jsonData = await response.json();
    // Add the visible property to each asset
    const updatedAssets = jsonData.assets.map(asset => ({
      ...asset,
      visible: false  // Set initial visibility to false
    }));
    console.log(updatedAssets);
    setAssets(updatedAssets);
  } catch (error) {
    console.error('Error:', error);
  }
};



useEffect(() => {
  getAssets();
  getCourse();
}, [idCourse]);



const toggleVideoVisibility = () => {
  setVideo((prevVideo) => ({ ...prevVideo, visible: !prevVideo.visible }));
};
  const [selectedObject, setSelectedObject] = useState(null);
  useEffect(() => {
    if (sceneRef.current) {
      const sceneEl = sceneRef.current;
      
      const handleSelectObject = (evt) => selectObject(evt, setSelectedObject, cameraRef);
      const handleModifyObjectWithKeys = (event) => modifyObjectWithKeys(event, selectedObject, setSelectedObject, cameraRef);
      
      if(sceneEl) {
      sceneEl.addEventListener('click', handleSelectObject);
      window.addEventListener('keydown', handleModifyObjectWithKeys);
      }
      return () => {
          if(sceneEl) {
        sceneEl.removeEventListener('click', handleSelectObject);
        window.removeEventListener('keydown', handleModifyObjectWithKeys);
          }
      };
    }
    }, [selectedObject]);
    // Function to toggle the visibility of an asset
    const toggleVisibility = (index) => {
      setAssets((prevAssets) => {
        const newAssets = [...prevAssets];
        newAssets[index] = { ...newAssets[index], visible: !newAssets[index].visible };
        return newAssets;
      });
    };

    // Function to toggle PDF visibility
    const togglePdfVisibility = () => {
      setPdf((prevPdf) => ({ ...prevPdf, visible: !prevPdf.visible }));
    };

  useEffect(() => {
      const menuUI = document.getElementById('openEditor');
      const closeUI = document.getElementById('closebtn');
      const model = document.querySelector("#model");
      const openModel = document.querySelector("#help");

      if (menuUI && closeUI && model ) {
      menuUI.addEventListener('mousedown', openNav);
      closeUI.addEventListener('mousedown', closeNav);
      model.addEventListener("click", () => {
          model.classList.add("hide");
      });
      openModel.addEventListener("click", () => {
          model.classList.remove("hide");
      });
      }

      return () => {
      if (menuUI && closeUI) {
          menuUI.removeEventListener('mousedown', openNav);
          closeUI.removeEventListener('mousedown', closeNav);
      }
      };
  }, []);
    const openNav = () => {
      document.getElementById("mySidenav").style.width = "400px";
    };
  
    const closeNav = () => {
      document.getElementById("mySidenav").style.width = "0";
    };
    console.log('PDF visibility:', pdf.visible);

    const SaveCourse = async () => {
      const models = document.querySelectorAll('.uploadedAssets');
      const modelData = [];
    
      models.forEach((model) => {
        const id = model.getAttribute('name');
        
        // Get the position, rotation, and scale attributes from the A-Frame model
        const positionAttr = model.getAttribute('position');
        const rotationAttr = model.getAttribute('rotation');
        const scaleAttr = model.getAttribute('scale');
    
        const modelInfo = {
          id,
          position: {
            x: positionAttr.x,
            y: positionAttr.y,
            z: positionAttr.z,
          },
          rotation: {
            x: rotationAttr.x,
            y: rotationAttr.y,
            z: rotationAttr.z,
          },
          scale: {
            x: scaleAttr.x,
            y: scaleAttr.y,
            z: scaleAttr.z,
          },
        };
    
        modelData.push(modelInfo);
      });
    
      console.log('Model Data:', modelData);
     // Include the courseID in the payload
      const data = {
        idCourse: idCourse, // Use the idCourse from useParams
        assets: modelData,
      };
      // Send the model data to your backend
      try {
        const response = await fetch(`http://localhost:4200/assets/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data), // Send the data as a JSON payload
        });
    
        if (!response.ok) {
          throw new Error('Failed to save model data');
        }
    
        const jsonData = await response.json();
        navigate(`/my-space/make-quiz/${idCourse}`);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    

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
                asset.visible && (
                  <a-gltf-model
                    name={asset.idAsset}
                    key={asset.idAsset}
                    class="selectable uploadedAssets"
                    src={asset.url}
                    position="15 5 -3"
                    scale="1 1 1"
                    rotation="0 0 0"
                  ></a-gltf-model>
                )
              ))}
        
              {video.visible && (
                  <VideoViewer 
                  scale="5 5 5"
                  position="39 11 -17"
                  rotation="0 -90 0"
                  />
              )}

              {pdf.visible && (
                  <PdfViewer 
                  pdf={course.coursepdf ? course.coursepdf : ''}
                  scale={2.5}
                  rotation="0 -90 0"
                  position="32 5 20" />
              )}

                  
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




              <div id="model">
                  <div id="info">
                      <span id="close"><IoCloseSharp/></span>
                      <h2 className="fw-bolder">Welcome to Immerse Editor!</h2>
                      <h3 className="text-start fw-lighter ps-4" ><u>Instructions:</u></h3>
                      <ul>
                      <li className="text-start">Use the keys  WQSD for movement</li>
                      <li className="text-start">Scroll Up and Down for vertical movement</li>
                      <li className="text-start">To select a model , move the cursor to the element and left click with ur mouse</li>
                      <li className="text-start">Use the keyboard arrows <TbArrowsMove/> to control the  model  horizontal position and "Y" , "C" to control vertical position</li>
                      <li className="text-start">Use "+" and "-" to control the model scale</li>
                      <li className="text-start">Use "A" and "E" to control the model rotation</li>
                      <li className="text-start">You can control the position , scale and rotation for all assets(video , PDF and models)</li>
                      </ul>
                  </div>
              </div>
          </a-scene>
          <div id="mySidenav" className="sidenav d-flex flex-column">
      <div className="p-1 flex-grow-1">
        
        <div className='d-flex justify-content-between align-items-center'>
          <h2 className="fs-4 m-0 fw-bolder">Editor Menu</h2>
          <div className="d-flex align-items-center">
            <span id="help" role="button" className="m-0 fs-2 text-decoration-none text-dark  p-0"><IoHelp /></span>
            <span id="closebtn" role="button" className='fs-2 m-0 p-0 text-dark'><IoCloseSharp/></span>
          </div>
        </div>
        <hr />
        <h4 className='fs-5 fw-light text-start fw-bold'><GrResources/> Uploaded Assets</h4>
        <ul className="list-group">
          {assets.map((asset, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              {asset.name}
              <button 
                className={`btn ${asset.visible ? 'btn-danger' : 'btn-dark'}`} 
                onClick={() => toggleVisibility(index)}>
                {asset.visible ? 'Hide' : 'Show'}
              </button>
            </li>
          ))}
        </ul>
        <hr />
        <h4 className='fs-5 fw-light text-start mt-4 fw-bold'> <FaRegFilePdf /> PDF</h4>
        <button 
          className={`btn ${pdf.visible ? 'btn-danger' : 'btn-dark'} w-100`} 
          onClick={togglePdfVisibility}>
          {pdf.visible ? 'Hide PDF' : 'Show PDF'}
        </button>
        <hr />
        <h4 className='fs-5 fw-light text-start mt-4 fw-bold'> <CiVideoOn/> Video</h4>
        <button 
          className={`btn ${video.visible ? 'btn-danger' : 'btn-dark'} w-100`} 
          onClick={toggleVideoVisibility}>
          {video.visible ? 'Hide video' : 'Show video'}
        </button>
          </div>

          <div className="p-3">
          <button onClick={SaveCourse} className="btn btn-primary w-100 fw-bold text-white">Save the course</button>
          </div>
      </div>

          <div className='fs-4 cursor-pointer p-3 fw-bolder text-white' role="button" id="openEditor">&#9776; Open Editor Menu</div>
      </div>

  );
}
export default LabEditor;