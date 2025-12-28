import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GameState } from './game.js';
import { UIManager } from './ui.js';

// --- Constants ---
const ROOM_SIZE = { x: 5, y: 3, z: 5 };
const PLAYER_RADIUS = 0.3; 

// --- Globals ---
let scene, camera, renderer, controls;
let raycaster;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Game Logic
const gameState = new GameState();
let uiManager;
let selectedItemData = null; 
let ghostMesh = null;
let placementValid = false;
let roomMeshes = []; 
let floorMesh = null; 
let itemMeshes = []; 

init();
animate();

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    scene.fog = new THREE.Fog(0xeeeeee, 0, 20);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 1.6; 

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    // 4. Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(3, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // 5. Room
    createRoom();

    // 6. Controls
    controls = new PointerLockControls(camera, document.body);
    
    // 7. Raycaster
    raycaster = new THREE.Raycaster();

    // 8. UI Integration
    uiManager = new UIManager(gameState, {
        onSelectItem: (item) => {
            selectedItemData = item;
            updateGhostMesh();
        },
        onCompletePhase: () => {
            const result = gameState.completePhase();
            if (result === "GAME_COMPLETE") {
                uiManager.showWin();
                controls.unlock();
            } else if (result) {
                // Lock items
                uiManager.update();
            }
        },
        onStartGame: () => {
            controls.lock();
        },
        onRestart: () => {
            resetGameScene();
            gameState.resetGame();
            uiManager.update();
            controls.lock();
        },
        onBackToTitle: () => {
            resetGameScene();
            gameState.resetGame();
            uiManager.update();
            uiManager.showTitle();
            controls.unlock();
        }
    });

    // 9. Event Listeners
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('wheel', onMouseWheel);
    window.addEventListener('resize', onWindowResize);

    controls.addEventListener('lock', () => {
        uiManager.toggleInventory(false);
    });
    controls.addEventListener('unlock', () => {
        uiManager.toggleInventory(true);
    });

    uiManager.update();
}

function createRoom() {
    roomMeshes = [];
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(ROOM_SIZE.x, ROOM_SIZE.z);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    roomMeshes.push(floor);
    floorMesh = floor;

    // Grid Helper
    const grid = new THREE.GridHelper(Math.max(ROOM_SIZE.x, ROOM_SIZE.z), Math.max(ROOM_SIZE.x, ROOM_SIZE.z) * 2);
    scene.add(grid);

    // Walls
    const wallMat = new THREE.MeshLambertMaterial({ color: 0xdddddd, side: THREE.DoubleSide });
    
    // Position walls so they are exactly at the boundary.
    // BoxGeometry center is 0,0,0. 
    // Back Wall (Z-)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.x, ROOM_SIZE.y, 0.1), wallMat);
    backWall.position.set(0, ROOM_SIZE.y / 2, -ROOM_SIZE.z / 2 - 0.05); // Move out by half thickness
    scene.add(backWall);
    roomMeshes.push(backWall);

    // Front Wall (Z+)
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.x, ROOM_SIZE.y, 0.1), wallMat);
    frontWall.position.set(0, ROOM_SIZE.y / 2, ROOM_SIZE.z / 2 + 0.05);
    scene.add(frontWall);
    roomMeshes.push(frontWall);

    // Left Wall (X-)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, ROOM_SIZE.y, ROOM_SIZE.z), wallMat);
    leftWall.position.set(-ROOM_SIZE.x / 2 - 0.05, ROOM_SIZE.y / 2, 0);
    scene.add(leftWall);
    roomMeshes.push(leftWall);

    // Right Wall (X+)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, ROOM_SIZE.y, ROOM_SIZE.z), wallMat);
    rightWall.position.set(ROOM_SIZE.x / 2 + 0.05, ROOM_SIZE.y / 2, 0);
    scene.add(rightWall);
    roomMeshes.push(rightWall);
}

function resetGameScene() {
    itemMeshes.forEach(mesh => scene.remove(mesh));
    itemMeshes = [];
    
    camera.position.set(0, 1.6, 0);
    camera.rotation.set(0, 0, 0); 
}

function updateGhostMesh() {
    if (ghostMesh) {
        scene.remove(ghostMesh);
        ghostMesh = null;
    }
    if (!selectedItemData) return;

    const dim = selectedItemData.dimensions;
    const geo = new THREE.BoxGeometry(dim.x, dim.y, dim.z);
    const mat = new THREE.MeshBasicMaterial({ color: selectedItemData.color, opacity: 0.5, transparent: true });
    ghostMesh = new THREE.Mesh(geo, mat);
    scene.add(ghostMesh);
}

function onMouseWheel(event) {
    // Disable manual rotation for wall-mounted items to keep them aligned
    if (controls.isLocked && ghostMesh && selectedItemData && !selectedItemData.wallMounted) {
        ghostMesh.rotation.y += event.deltaY * 0.002;
    }
}

function onKeyDown(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = true; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = true; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = true; break;
        case 'KeyE': 
            if (controls.isLocked) controls.unlock();
            else controls.lock();
            break;
    }
}

function onKeyUp(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = false; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = false; break;
    }
}

function onMouseDown(event) {
    if (!controls.isLocked) return;

    if (event.button === 0) { // Left Click
        if (ghostMesh && placementValid && selectedItemData) {
            placeItem();
        }
    } else if (event.button === 2) { // Right Click
        const intersects = raycaster.intersectObjects(itemMeshes);
        if (intersects.length > 0) {
            const hitObject = intersects[0].object;
            const removed = gameState.removeItem(hitObject.uuid);
            if (removed) {
                scene.remove(hitObject);
                itemMeshes = itemMeshes.filter(m => m !== hitObject);
                uiManager.update();
            }
        }
    }
}

function placeItem() {
    const dim = selectedItemData.dimensions;
    const geo = new THREE.BoxGeometry(dim.x, dim.y, dim.z);
    const mat = new THREE.MeshLambertMaterial({ color: selectedItemData.color });
    const mesh = new THREE.Mesh(geo, mat);
    
    mesh.position.copy(ghostMesh.position);
    mesh.rotation.copy(ghostMesh.rotation);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    scene.add(mesh);
    itemMeshes.push(mesh);
    gameState.addItem(selectedItemData, mesh.uuid);
    
    uiManager.update();
}

function checkPlacementValidity(position, hitObject) {
    if (!selectedItemData || !ghostMesh) return false;
    
    const isWall = roomMeshes.includes(hitObject) && hitObject !== floorMesh;

    // 1. Strict Floor Check
    if (selectedItemData.strictFloor) {
        if (hitObject !== floorMesh) {
            return false;
        }
    }
    
    // 2. Wall Mounted Check
    if (selectedItemData.wallMounted) {
        if (!isWall) return false;
    }

    // 3. Room Bounds Check
    // For wall mounted items, we need a bit more leniency at the back face (where it touches wall)
    ghostMesh.position.copy(position); 
    ghostMesh.updateMatrixWorld(true);

    const ghostBox = new THREE.Box3().setFromObject(ghostMesh);
    const min = ghostBox.min;
    const max = ghostBox.max;

    const roomMinX = -ROOM_SIZE.x / 2;
    const roomMaxX = ROOM_SIZE.x / 2;
    const roomMinZ = -ROOM_SIZE.z / 2;
    const roomMaxZ = ROOM_SIZE.z / 2;
    
    const epsilon = 0.05; // Slightly larger epsilon

    if (min.x < roomMinX - epsilon || max.x > roomMaxX + epsilon || 
        min.z < roomMinZ - epsilon || max.z > roomMaxZ + epsilon) {
        return false;
    }

    // 4. Collision with other items
    const collisionBox = ghostBox.clone().expandByScalar(-0.05);

    for (const itemMesh of itemMeshes) {
        if (itemMesh === hitObject) continue; 

        const itemBox = new THREE.Box3().setFromObject(itemMesh);
        if (collisionBox.intersectsBox(itemBox)) {
            return false;
        }
    }

    return true;
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    if (controls.isLocked) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();

        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        
        // --- Player Collision Logic ---
        const halfX = ROOM_SIZE.x / 2 - PLAYER_RADIUS;
        const halfZ = ROOM_SIZE.z / 2 - PLAYER_RADIUS;
        camera.position.x = Math.max(-halfX, Math.min(halfX, camera.position.x));
        camera.position.z = Math.max(-halfZ, Math.min(halfZ, camera.position.z));
        // ------------------------------

        // Raycast
        const intersectObjects = [...roomMeshes, ...itemMeshes];
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        
        const intersects = raycaster.intersectObjects(intersectObjects);
        
        if (intersects.length > 0 && selectedItemData && ghostMesh) {
            const hit = intersects[0];
            const hitObject = hit.object;

            let validSurface = true;
            
            // Check surface validity
            const isFloor = hitObject === floorMesh;
            const isWall = roomMeshes.includes(hitObject) && !isFloor;
            const isItem = itemMeshes.includes(hitObject);

            if (selectedItemData.floorOnly && !isFloor && !isItem) validSurface = false;
            if (selectedItemData.wallMounted && !isWall) validSurface = false;
            
            // Stacking logic
            if (isItem) {
                 const itemData = gameState.placedItems.find(p => p.meshUuid === hitObject.uuid)?.data;
                 if (itemData && !itemData.stackable) {
                     validSurface = false;
                 }
                 if (selectedItemData.wallMounted) validSurface = false; // Cant put wall item on another item (yet)
            }

            if (selectedItemData.wallMounted && isWall) {
                // Wall Placement Logic
                const normal = hit.face.normal;
                const point = hit.point;
                const depth = selectedItemData.dimensions.z; // Assumes Z is depth

                // Position: Point + Normal * (half depth)
                const targetPos = point.clone().add(normal.clone().multiplyScalar(depth / 2));
                
                ghostMesh.position.copy(targetPos);
                
                // Rotation: Look at normal direction
                // lookAt aligns +Z to target. We want Back (-Z) to be towards wall (opposite normal).
                // So +Z is same direction as normal.
                // We look at (Position + Normal)
                const lookTarget = ghostMesh.position.clone().add(normal);
                ghostMesh.lookAt(lookTarget);

            } else {
                // Floor/Surface Placement Logic
                const point = hit.point;
                let targetY = point.y + selectedItemData.dimensions.y / 2;
                ghostMesh.position.set(point.x, targetY, point.z);
                
                // Reset rotation pitch/roll if needed, keep Y yaw (handled by user or default)
                ghostMesh.rotation.x = 0;
                ghostMesh.rotation.z = 0;
                // keep ghostMesh.rotation.y from user input
            }

            if (!validSurface) {
                placementValid = false;
            } else {
                placementValid = checkPlacementValidity(ghostMesh.position, hitObject);
            }
            
            ghostMesh.material.color.setHex(placementValid ? 0x00ff00 : 0xff0000);
        } else if (ghostMesh) {
            ghostMesh.position.set(0, -100, 0);
        }
    }

    prevTime = time;
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
