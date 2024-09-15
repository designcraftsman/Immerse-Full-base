import React from "react";
import { GrResources } from "react-icons/gr";
import { FaRegFilePdf } from "react-icons/fa";
import { IoHelp } from "react-icons/io5";
import { TbArrowsMove } from "react-icons/tb";
import { CiVideoOn } from "react-icons/ci";
import Window from '../../assets/ImmersiveSpace/3D_Models/window.glb';
import { useEffect, useRef, useState } from 'react';
import { selectObject, modifyObjectWithKeys } from '../../components/ImmersiveSpace/ObjectManipulation'; // Import functions
import PdfViewer from "../../components/ImmersiveSpace/PDFViewer";
import VideoViewer from "../../components/ImmersiveSpace/VideoViewer";
import Video from '../../assets/ImmersiveSpace/videos/video.mp4';
import PDF from '../../assets/ImmersiveSpace/pdf/Rapport.pdf';
import { IoCloseSharp } from "react-icons/io5";
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


function SchoolEditor(){

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
        console.log('Saved model data:', jsonData);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    useEffect(() => {
      getAssets();
      getCourse();
    }, [idCourse]);
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
                asset.visible && (
                  <a-gltf-model
                    name={asset.idAsset}
                    key={asset.idAsset}
                    class="selectable uploadedAssets"
                    src={asset.url}
                    position="31 -5 95"
                    scale="1 1 1"
                    rotation="0 0 0"
                  ></a-gltf-model>
                )
              ))}
        
              {video.visible && (
                  <VideoViewer 
                    position="0 30 145"
                    rotation="0 180 0"
                    scale="20 20 20"
                  />
              )}

              {pdf.visible && (
                  <PdfViewer 
                  pdf={course.coursepdf ? course.coursepdf : ''}
                  scale={4}
                    rotation="-2 210 0"
                    position="50 0 115"
                  />
              )}

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
export default SchoolEditor;