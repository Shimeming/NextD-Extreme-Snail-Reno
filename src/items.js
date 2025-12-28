export const ITEM_CATALOG = [
    {
        id: 'single_bed',
        cost: 300,
        type: 'sleep',
        capacity: 1,
        dimensions: { x: 1, y: 0.5, z: 2 }, 
        color: 0x3498db, 
        floorOnly: true,
        strictFloor: true, 
        stackable: false
    },
    {
        id: 'double_bed',
        cost: 500,
        type: 'sleep',
        capacity: 2,
        dimensions: { x: 1.8, y: 0.5, z: 2 },
        color: 0x2980b9, 
        floorOnly: true,
        strictFloor: true,
        stackable: false
    },
    {
        id: 'bunk_bed',
        cost: 700,
        type: 'sleep',
        capacity: 2,
        dimensions: { x: 1, y: 1.8, z: 2 },
        color: 0xe67e22, 
        floorOnly: true,
        strictFloor: true,
        stackable: false
    },
    {
        id: 'floor_mat',
        cost: 50, 
        type: 'sleep',
        capacity: 1, 
        dimensions: { x: 1, y: 0.05, z: 2 },
        color: 0x95a5a6, 
        floorOnly: true,
        stackable: true 
    },
    {
        id: 'chair',
        cost: 50,
        type: 'seat',
        capacity: 1,
        dimensions: { x: 0.5, y: 1, z: 0.5 },
        color: 0xf1c40f, 
        floorOnly: true,
        stackable: false
    },
    {
        id: 'gaming_chair',
        cost: 200,
        type: 'seat',
        capacity: 1,
        dimensions: { x: 0.7, y: 1.2, z: 0.7 },
        color: 0xe74c3c, 
        floorOnly: true,
        stackable: false
    },
    {
        id: 'table',
        cost: 100,
        type: 'surface',
        capacity: 1, 
        dimensions: { x: 1, y: 0.8, z: 1 },
        color: 0x8e44ad,
        floorOnly: true,
        stackable: true 
    },
    {
        id: 'toilet',
        cost: 200,
        type: 'toilet',
        capacity: 1,
        dimensions: { x: 0.6, y: 0.8, z: 0.8 },
        color: 0xffffff, 
        floorOnly: true,
        stackable: false
    },
    {
        id: 'shower',
        cost: 50,
        type: 'shower',
        capacity: 1,
        dimensions: { x: 0.2, y: 0.2, z: 0.2 }, 
        color: 0xbdc3c7, 
        floorOnly: false, 
        wallMounted: true, // Wall mounted
        stackable: false
    },
    {
        id: 'shelf',
        cost: 100,
        type: 'storage',
        capacity: 5, 
        dimensions: { x: 1, y: 2, z: 0.5 },
        color: 0x8e44ad,
        floorOnly: true,
        stackable: false
    },
    {
        id: 'crate',
        cost: 20,
        type: 'storage',
        capacity: 1,
        dimensions: { x: 0.5, y: 0.5, z: 0.5 },
        color: 0xd35400,
        floorOnly: false,
        stackable: true
    },
    {
        id: 'tv',
        cost: 150,
        type: 'entertainment',
        capacity: 1,
        dimensions: { x: 0.8, y: 0.6, z: 0.2 },
        color: 0x2c3e50,
        floorOnly: false,
        wallMounted: true, // Wall mounted
        stackable: false
    },
    {
        id: 'plant',
        cost: 30,
        type: 'decor',
        capacity: 1,
        dimensions: { x: 0.4, y: 0.6, z: 0.4 },
        color: 0x2ecc71,
        floorOnly: false,
        stackable: false
    },
    {
        id: 'door',
        cost: 100,
        type: 'access',
        capacity: 1,
        dimensions: { x: 1, y: 2, z: 0.1 },
        color: 0x7f8c8d,
        floorOnly: true,
        stackable: false
    }
];

export function getItemById(id) {
    return ITEM_CATALOG.find(item => item.id === id);
}
