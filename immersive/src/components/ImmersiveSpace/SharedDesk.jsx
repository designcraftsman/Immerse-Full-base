import officeSharedDesk from "../../assets/ImmersiveSpace/3D_Components/shared_office_desk.glb";
import deskShelf from "../../assets/ImmersiveSpace/3D_Components/ikea_fjallbo_wall_shelf.glb";
import Osciloscope from "../../assets/ImmersiveSpace/3D_Components/oscilloscope.glb";
import PowerSuply from "../../assets/ImmersiveSpace/3D_Components/power_suply_dc.glb";
import MultiMeter from "../../assets/ImmersiveSpace/3D_Components/digital_multi-meter.glb";
import BreadBoard from "../../assets/ImmersiveSpace/3D_Components/arduino_breadboard_low_poly.glb";
import IronStation from "../../assets/ImmersiveSpace/3D_Components/soldering_iron_station.glb";
import officeChair from "../../assets/ImmersiveSpace/3D_Components/office_chair.glb";

function SharedDesk({ position = "0 0 0", rotation = "0 0 0" }) {
    return (
       <>
       <a-entity position={position} rotation={rotation}  class="collidable">
            <a-gltf-model 
                src={officeSharedDesk} 
                position="0 6 9.1" 
                scale=".03 .07 .04"
                rotation="0 90 0"
                class="collidable"
            ></a-gltf-model>
            {/* Desk Shelf */}
            <a-gltf-model 
                src={deskShelf} 
                position="1 8 5" 
                scale="10 7 8"
                rotation="0 0 0"
                class="collidable"
            ></a-gltf-model>
            <a-gltf-model 
                src={deskShelf} 
                position="1 8 13" 
                scale="10 7 8"
                rotation="0 0 0"
                class="collidable"
            ></a-gltf-model>
            <a-gltf-model 
                src={deskShelf} 
                position="-1 8 5" 
                scale="10 7 8"
                rotation="0 180 0"
                class="collidable"
            ></a-gltf-model>
            <a-gltf-model 
                src={deskShelf} 
                position="-1 8 13" 
                scale="10 7 8"
                rotation="0 180 0"
                class="collidable"
            ></a-gltf-model> 

           
        </a-entity>
       </> 
        
    );
}

export default SharedDesk;
