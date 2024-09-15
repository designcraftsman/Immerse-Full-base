/* global AFRAME */
/* global THREE */
// custome Look controls debut
AFRAME.registerComponent('my-custom-look-controls', {
  schema: {
    enabled: { default: true }
  },
  init: function () {
    this.yawObject = new THREE.Object3D();
    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(this.yawObject);
    this.el.object3D.add(this.pitchObject);

    this.mouseDown = false;
    this.bindMethods();
    this.addEventListeners();
  },
  bindMethods: function () {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  },
  addEventListeners: function () {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
  },
  removeEventListeners: function () {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  },
  onMouseMove: function (event) {
    if (!this.data.enabled || !this.mouseDown) return;

    var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitchObject.rotation.x));
  },
  onMouseDown: function () {
    this.mouseDown = true;
  },
  onMouseUp: function () {
    this.mouseDown = false;
  }
});


  

AFRAME.registerComponent('camera-collider', {
  schema: {
    speed: { type: 'number', default: 0.1 },
    radius: { type: 'number', default: 0.3 }
  },
  init: function () {
    this.direction = new THREE.Vector3();
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,  // Added for flying up
      down: false // Added for flying down
    };
    this.scrollSpeed = 0;

    this.bindMethods();
    this.addEventListeners();
  },
  bindMethods: function () {
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this); // Bind the scroll event
  },
  addEventListeners: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('wheel', this.onMouseWheel); // Add the scroll listener
  },
  removeEventListeners: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('wheel', this.onMouseWheel); // Remove the scroll listener
  },
  onKeyDown: function (event) {
    switch (event.key) {
      case 'z': // Forward
        this.keys.forward = true;
        break;
      case 'q': // Left
        this.keys.left = true;
        break;
      case 's': // Backward
        this.keys.backward = true;
        break;
      case 'd': // Right
        this.keys.right = true;
        break;
    }
  },
  onKeyUp: function (event) {
    switch (event.key) {
      case 'z': // Forward
        this.keys.forward = false;
        break;
      case 'q': // Left
        this.keys.left = false;
        break;
      case 's': // Backward
        this.keys.backward = false;
        break;
      case 'd': // Right
        this.keys.right = false;
        break;
    }
  },
  onMouseWheel: function (event) {
    // Scroll up moves the camera up, scroll down moves it down
    if (event.deltaY < 0) {
      this.keys.up = true;
      this.keys.down = false;
    } else {
      this.keys.up = false;
      this.keys.down = true;
    }
    
    // Reset the scroll movement after a short delay
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      this.keys.up = false;
      this.keys.down = false;
    }, 200); // Adjust the delay as needed
  },
  tick: function () {
    var cameraEl = this.el.sceneEl.querySelector('[camera]');
    var camera = cameraEl.getObject3D('camera');
    if (!camera) return;

    // Ensure the 'my-custom-look-controls' component is present and accessible
    var lookControls = cameraEl.components['my-custom-look-controls'];
    if (!lookControls) return;

    var yawObject = lookControls.yawObject;

    // Reset direction
    this.direction.set(0, 0, 0);

    // Determine movement direction based on keys pressed
    if (this.keys.forward) this.direction.z -= 1;
    if (this.keys.backward) this.direction.z += 1;
    if (this.keys.left) this.direction.x -= 1;
    if (this.keys.right) this.direction.x += 1;
    if (this.keys.up) this.direction.y += 1;  // Move up
    if (this.keys.down) this.direction.y -= 1; // Move down

    if (this.direction.length() > 0) {
      this.direction.normalize();

      // Apply the custom look controls' rotation to the direction
      var rotation = new THREE.Euler(0, yawObject.rotation.y, 0, 'YXZ');
      this.direction.applyEuler(rotation);

      // Calculate next position
      var nextPosition = this.el.object3D.position.clone().add(this.direction.multiplyScalar(this.data.speed));

      // Use bounding sphere for collision detection
      var boundingSphere = new THREE.Sphere(nextPosition, this.data.radius);
      var collidableObjects = this.el.sceneEl.object3D.children.filter(child => child.el && child.el.classList && child.el.classList.contains('collidable'));

      var collisionDetected = collidableObjects.some(obj => {
        var objBoundingBox = new THREE.Box3().setFromObject(obj);
        return objBoundingBox.intersectsSphere(boundingSphere);
      });

      // Move if no collision detected
      if (!collisionDetected) {
        this.el.object3D.position.copy(nextPosition);
      }
    }
  },
  remove: function () {
    this.removeEventListeners();
  }
});
  