// objectManipulation.js
export const selectObject = (evt, setSelectedObject, cameraRef) => {
  const target = evt.target;

  if (target && target.classList.contains('selectable')) {
    setSelectedObject(target);
    target.setAttribute('material', 'color', '#FF0000'); // Provide visual feedback

    // Disable camera look-controls when an object is selected
    if (cameraRef.current) {
      cameraRef.current.components['look-controls'].pause(); // Pausing look-controls
      cameraRef.current.removeAttribute('camera-collider');  // Remove camera-collider
    }

    console.log("Selected object:", target);
  }
};

export const modifyObjectWithKeys = (event, selectedObject, setSelectedObject, cameraRef) => {
  if (!selectedObject) {
    console.log("No object selected");
    return;
  }

  const position = selectedObject.getAttribute('position');
  const rotation = selectedObject.getAttribute('rotation');
  const scale = selectedObject.getAttribute('scale');

  console.log("Before modification:", { position, rotation, scale });

  const moveSpeed = 0.1; // Default movement speed
  const shiftMoveSpeed = 0.5; // Movement speed when Shift is held down

  let newPosition = { ...position };

  if (event.key === 'Escape') {
    // Deselect object and re-enable camera
    selectedObject.removeAttribute('material','color'); // Removes the material attribute entirely
    setSelectedObject(null);

    // Re-enable camera look-controls and add camera-collider back
    if (cameraRef.current) {
      cameraRef.current.components['look-controls'].play(); // Resuming look-controls
      cameraRef.current.setAttribute('camera-collider', 'speed: 0.5; radius: 0.5'); // Re-add camera-collider
    }
    console.log("Object deselected");
    return; // Exit early to stop further processing
  }

  if (event.shiftKey) {
    // Increase movement speed when Shift is held down
    switch (event.key) {
      case 'ArrowUp': // Move forward
        newPosition.z -= shiftMoveSpeed;
        break;
      case 'ArrowDown': // Move back
        newPosition.z += shiftMoveSpeed;
        break;
      case 'ArrowLeft': // Move left
        newPosition.x -= shiftMoveSpeed;
        break;
      case 'ArrowRight': // Move right
        newPosition.x += shiftMoveSpeed;
        break;
      case 'w': // Move up
        newPosition.y += shiftMoveSpeed;
        break;
      case 's': // Move down
        newPosition.y -= shiftMoveSpeed;
        break;
      default:
        console.log("Invalid key pressed with Shift:", event.key);
        return; // Exit early if an invalid key is pressed with Shift
    }
  } else {
    switch (event.key) {
      // Move object
      case 'ArrowUp': // Move forward
        newPosition.z -= moveSpeed;
        break;
      case 'ArrowDown': // Move back
        newPosition.z += moveSpeed;
        break;
      case 'ArrowLeft': // Move left
        newPosition.x -= moveSpeed;
        break;
      case 'ArrowRight': // Move right
        newPosition.x += moveSpeed;
        break;
      case 'w': // Move up
        newPosition.y += moveSpeed;
        break;
      case 'c': // Move down
        newPosition.y -= moveSpeed;
        break;

      // Rotate object
      case 'a': // Rotate left
        selectedObject.setAttribute('rotation', { x: rotation.x, y: rotation.y - 5, z: rotation.z });
        break;
      case 'e': // Rotate right
        selectedObject.setAttribute('rotation', { x: rotation.x, y: rotation.y + 5, z: rotation.z });
        break;

      // Scale object
      case '+': // Increase scale
        selectedObject.setAttribute('scale', { x: scale.x + 0.01, y: scale.y + 0.01, z: scale.z + 0.01 });
        break;
      case '-': // Decrease scale
        selectedObject.setAttribute('scale', { x: scale.x - 0.01, y: scale.y - 0.01, z: scale.z - 0.01 });
        break;

      default:
        console.log("Invalid key pressed:", event.key);
        break;
    }
  }

  // Update the object's position
  selectedObject.setAttribute('position', newPosition);
  console.log("After modification:", {
    position: selectedObject.getAttribute('position'),
    rotation: selectedObject.getAttribute('rotation'),
    scale: selectedObject.getAttribute('scale'),
  });
};
