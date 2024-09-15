import React from 'react';
import officeDeskLamp from "../../assets/ImmersiveSpace/3D_Components/office_lamp.glb";
import officeChair from "../../assets/ImmersiveSpace/3D_Components/office_chair.glb";
import officeDesk from "../../assets/ImmersiveSpace/3D_Components/office_table.glb";
import desktopPc from "../../assets/ImmersiveSpace/3D_Components/desktop_pc.glb";

function DeskEntity({ position = "0 0 0", rotation = "0 0 0" }) {
    return (
        <a-entity position={position} rotation={rotation} class="collidable">
            <a-gltf-model 
                src={officeDesk} 
                position="0 0 0" 
                scale="7 7 7"
                class="collidable"
            ></a-gltf-model>
            <a-gltf-model 
                src={officeDeskLamp} 
                position="5 5.5 -2" 
                scale=".06 .06 .06"
                rotation="0 200 0"
            ></a-gltf-model>
            {/*<a-entity 
                light="type: point; intensity: .7; distance: 10"  
                position="5 5.5 -2"
            ></a-entity> */}
            <a-gltf-model 
                src={desktopPc} 
                position="0 5.7 0" 
                rotation="0 -15 0"
                scale="1.8 1.8 1.8"
            ></a-gltf-model>
            <a-gltf-model 
                src={officeChair} 
                position="0 4 2" 
                rotation="0 180 0"
                scale="6 6 6"
                class="collidable"
            ></a-gltf-model>
        </a-entity>
    );
}

export default DeskEntity;
