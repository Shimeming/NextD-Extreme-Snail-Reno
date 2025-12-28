import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
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
let ghostMesh = null; // This will now be a Group containing the visual mesh
let placementValid = false;
let roomMeshes = []; 
let floorMesh = null; 
let itemMeshes = []; 

// Asset Management
const fbxLoader = new FBXLoader();
const modelCache = new Map(); // path -> THREE.Group (normalized)

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
    
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.x, ROOM_SIZE.y, 0.1), wallMat);
    backWall.position.set(0, ROOM_SIZE.y / 2, -ROOM_SIZE.z / 2 - 0.05); 
    scene.add(backWall);
    roomMeshes.push(backWall);

    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(ROOM_SIZE.x, ROOM_SIZE.y, 0.1), wallMat);
    frontWall.position.set(0, ROOM_SIZE.y / 2, ROOM_SIZE.z / 2 + 0.05);
    scene.add(frontWall);
    roomMeshes.push(frontWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, ROOM_SIZE.y, ROOM_SIZE.z), wallMat);
    leftWall.position.set(-ROOM_SIZE.x / 2 - 0.05, ROOM_SIZE.y / 2, 0);
    scene.add(leftWall);
    roomMeshes.push(leftWall);

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

// --- Asset Loading & Normalization ---
function loadAndPrepareModel(itemData, callback) {
    if (modelCache.has(itemData.id)) {
        callback(modelCache.get(itemData.id).clone());
        return;
    }

    // If no model path, use placeholder box
    if (!itemData.modelPath) {
        const geo = new THREE.BoxGeometry(itemData.dimensions.x, itemData.dimensions.y, itemData.dimensions.z);
        const mat = new THREE.MeshLambertMaterial({ color: itemData.color });
        const mesh = new THREE.Mesh(geo, mat);
        modelCache.set(itemData.id, mesh);
        callback(mesh.clone());
        return;
    }

    fbxLoader.load(itemData.modelPath, (fbx) => {
        // Normalize Scale and Position
        // 1. Compute Box
        const box = new THREE.Box3().setFromObject(fbx);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // 2. Create Wrapper Group (The Actor)
        const wrapper = new THREE.Group();
        wrapper.add(fbx);

        // 3. Center the mesh inside the wrapper
        // We want the wrapper's (0,0,0) to be the CENTER of the object
        fbx.position.x = -center.x;
        fbx.position.y = -center.y;
        fbx.position.z = -center.z;

        // 4. Scale to match Target Dimensions
        const targetX = itemData.dimensions.x;
        const targetY = itemData.dimensions.y;
        const targetZ = itemData.dimensions.z;

        // Avoid divide by zero
        const scaleX = size.x > 0 ? targetX / size.x : 1;
        const scaleY = size.y > 0 ? targetY / size.y : 1;
        const scaleZ = size.z > 0 ? targetZ / size.z : 1;

        wrapper.scale.set(scaleX, scaleY, scaleZ);

        // 5. Apply Material Color (since textures are missing)
        fbx.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                // Apply catalog color
                child.material = new THREE.MeshLambertMaterial({ color: itemData.color });
            }
        });

        modelCache.set(itemData.id, wrapper);
        callback(wrapper.clone());
    }, undefined, (error) => {
        console.error("Error loading model:", error);
        // Fallback to box
        const geo = new THREE.BoxGeometry(itemData.dimensions.x, itemData.dimensions.y, itemData.dimensions.z);
        const mat = new THREE.MeshLambertMaterial({ color: itemData.color });
        const mesh = new THREE.Mesh(geo, mat);
        modelCache.set(itemData.id, mesh);
        callback(mesh.clone());
    });
}


function updateGhostMesh() {
    if (ghostMesh) {
        scene.remove(ghostMesh);
        ghostMesh = null;
    }
    if (!selectedItemData) return;

    loadAndPrepareModel(selectedItemData, (model) => {
        // If selection changed while loading, discard
        if (selectedItemData.id !== selectedItemData.id) return; 

        ghostMesh = model;
        
        // Make Transparent
        ghostMesh.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.5;
            }
        });

        // Hide initially until raycast updates position
        ghostMesh.position.set(0, -100, 0); 
        scene.add(ghostMesh);
    });
}

function onMouseWheel(event) {
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
        // Raycast intersects gives mesh. parent might be the Group.
        // We need to find the root object in itemMeshes
        const intersects = raycaster.intersectObjects(scene.children, true); // true = recursive
        
        let hitRoot = null;
        for (const hit of intersects) {
            // Check if hit object or any parent is in itemMeshes
            let obj = hit.object;
            while(obj) {
                if (itemMeshes.includes(obj)) {
                    hitRoot = obj;
                    break;
                }
                obj = obj.parent;
            }
            if (hitRoot) break;
        }

        if (hitRoot) {
            const removed = gameState.removeItem(hitRoot.uuid);
            if (removed) {
                scene.remove(hitRoot);
                itemMeshes = itemMeshes.filter(m => m !== hitRoot);
                uiManager.update();
            }
        }
    }
}

function placeItem() {
    if (!ghostMesh) return;

    loadAndPrepareModel(selectedItemData, (model) => {
        model.position.copy(ghostMesh.position);
        model.rotation.copy(ghostMesh.rotation);
        
        scene.add(model);
        itemMeshes.push(model);
        // Map mesh UUID to item UUID for logic
        gameState.addItem(selectedItemData, model.uuid);
        uiManager.update();
    });
}

function checkPlacementValidity(position, hitObject) {
    if (!selectedItemData || !ghostMesh) return false;
    
    // Check if we hit a wall for wall-mounted items
    let isWall = false;
    if (hitObject) {
         isWall = roomMeshes.includes(hitObject) && hitObject !== floorMesh;
    }

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
    ghostMesh.position.copy(position); 
    ghostMesh.updateMatrixWorld(true);

    const ghostBox = new THREE.Box3().setFromObject(ghostMesh);
    const min = ghostBox.min;
    const max = ghostBox.max;

    const roomMinX = -ROOM_SIZE.x / 2;
    const roomMaxX = ROOM_SIZE.x / 2;
    const roomMinZ = -ROOM_SIZE.z / 2;
    const roomMaxZ = ROOM_SIZE.z / 2;
    
    const epsilon = 0.05; 

    if (min.x < roomMinX - epsilon || max.x > roomMaxX + epsilon || 
        min.z < roomMinZ - epsilon || max.z > roomMaxZ + epsilon) {
        return false;
    }

    // 4. Collision with other items
    const collisionBox = ghostBox.clone().expandByScalar(-0.05);

    for (const itemRoot of itemMeshes) {
        if (itemRoot === hitObject) continue; 
        
        const itemBox = new THREE.Box3().setFromObject(itemRoot);
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
        // itemMeshes are Groups now. intersectObjects needs recursive check or check children.
        // We'll traverse itemMeshes to get all children meshes for raycasting.
        let interactables = [...roomMeshes];
        itemMeshes.forEach(group => {
            group.traverse(child => {
                if (child.isMesh) interactables.push(child);
            });
        });

        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        
        const intersects = raycaster.intersectObjects(interactables);
        
        if (intersects.length > 0 && selectedItemData && ghostMesh) {
            const hit = intersects[0];
            const hitObject = hit.object;

            let validSurface = true;
            
            const isFloor = hitObject === floorMesh;
            const isWall = roomMeshes.includes(hitObject) && !isFloor;
            
            // Determine if we hit an item
            let hitItemRoot = null;
            let obj = hitObject;
            while(obj) {
                if (itemMeshes.includes(obj)) {
                    hitItemRoot = obj;
                    break;
                }
                obj = obj.parent;
            }
            const isItem = !!hitItemRoot;

            if (selectedItemData.floorOnly && !isFloor && !isItem) validSurface = false;
            if (selectedItemData.wallMounted && !isWall) validSurface = false;
            
            if (isItem && hitItemRoot) {
                 const itemData = gameState.placedItems.find(p => p.meshUuid === hitItemRoot.uuid)?.data;
                 if (itemData && !itemData.stackable) {
                     validSurface = false;
                 }
                 if (selectedItemData.wallMounted) validSurface = false; 
            }

            if (selectedItemData.wallMounted && isWall) {
                const normal = hit.face.normal;
                const point = hit.point;
                const depth = selectedItemData.dimensions.z; 

                const targetPos = point.clone().add(normal.clone().multiplyScalar(depth / 2));
                
                ghostMesh.position.copy(targetPos);
                
                const lookTarget = ghostMesh.position.clone().add(normal);
                ghostMesh.lookAt(lookTarget);

            } else {
                const point = hit.point;
                let targetY = point.y + selectedItemData.dimensions.y / 2;
                ghostMesh.position.set(point.x, targetY, point.z);
                
                ghostMesh.rotation.x = 0;
                ghostMesh.rotation.z = 0;
            }

            if (!validSurface) {
                placementValid = false;
            } else {
                placementValid = checkPlacementValidity(ghostMesh.position, hitItemRoot || hitObject);
            }
            
            // Update ghost color
            const color = placementValid ? 0x00ff00 : 0xff0000;
            ghostMesh.traverse(child => {
                if (child.isMesh) child.material.color.setHex(color);
            });

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