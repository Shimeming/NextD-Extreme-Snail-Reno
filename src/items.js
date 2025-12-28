export const ITEM_CATALOG = [
    // --- SLEEPING ---
    {
        id: 'single_bed',
        cost: 300,
        type: 'sleep',
        capacity: 1,
        dimensions: { x: 1, y: 0.5, z: 2 }, 
        color: 0x3498db, 
        floorOnly: true,
        strictFloor: true, 
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Bed 1.fbx'
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
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Bed 3.fbx'
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
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Bunk Bed.fbx'
    },
    {
        id: 'floor_mat',
        cost: 50, 
        type: 'sleep',
        capacity: 1, 
        dimensions: { x: 1, y: 0.05, z: 2 },
        color: 0x95a5a6, 
        floorOnly: true,
        stackable: true,
        modelPath: 'ultimate-interior-pack/Models/Rug 1.fbx'
    },

    // --- SEATING ---
    {
        id: 'chair',
        cost: 50,
        type: 'seat',
        capacity: 1,
        dimensions: { x: 0.5, y: 1, z: 0.5 },
        color: 0xf1c40f, 
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Chair 1.fbx'
    },
    {
        id: 'office_chair',
        cost: 150,
        type: 'seat',
        capacity: 1,
        dimensions: { x: 0.7, y: 1.1, z: 0.7 },
        color: 0x34495e,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Office Chair 3.fbx'
    },
    {
        id: 'armchair',
        cost: 200,
        type: 'seat',
        capacity: 1,
        dimensions: { x: 1, y: 1, z: 1 },
        color: 0xe67e22,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Armchair.fbx'
    },
    {
        id: 'sofa_small',
        cost: 400,
        type: 'seat',
        capacity: 2,
        dimensions: { x: 1.8, y: 1, z: 1 },
        color: 0xc0392b,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Sofa 1.fbx'
    },
    {
        id: 'sofa_large',
        cost: 600,
        type: 'seat',
        capacity: 3,
        dimensions: { x: 2.5, y: 1, z: 1 },
        color: 0x27ae60,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Sofa 5.fbx'
    },

    // --- TABLES & SURFACES ---
    {
        id: 'table',
        cost: 100,
        type: 'surface',
        capacity: 1, 
        dimensions: { x: 1, y: 0.8, z: 1 },
        color: 0x8e44ad,
        floorOnly: true,
        stackable: true,
        modelPath: 'ultimate-interior-pack/Models/Table 1.fbx'
    },
    {
        id: 'coffee_table',
        cost: 80,
        type: 'surface',
        capacity: 1,
        dimensions: { x: 1.2, y: 0.4, z: 0.6 },
        color: 0xd35400,
        floorOnly: true,
        stackable: true,
        modelPath: 'ultimate-interior-pack/Models/Coffee Table 1.fbx'
    },
    {
        id: 'desk_large',
        cost: 250,
        type: 'surface',
        capacity: 2,
        dimensions: { x: 2, y: 0.8, z: 0.8 },
        color: 0x7f8c8d,
        floorOnly: true,
        stackable: true,
        modelPath: 'ultimate-interior-pack/Models/Desk 1.fbx'
    },
    {
        id: 'nightstand',
        cost: 60,
        type: 'surface',
        capacity: 1,
        dimensions: { x: 0.5, y: 0.5, z: 0.5 },
        color: 0x95a5a6,
        floorOnly: true,
        stackable: true,
        modelPath: 'ultimate-interior-pack/Models/Nightstand 1.fbx'
    },

    // --- KITCHEN & APPLIANCES ---
    {
        id: 'fridge',
        cost: 800,
        type: 'kitchen',
        capacity: 5,
        dimensions: { x: 0.8, y: 1.8, z: 0.8 },
        color: 0xecf0f1,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Refrigerator 1.fbx'
    },
    {
        id: 'microwave',
        cost: 120,
        type: 'kitchen',
        capacity: 1,
        dimensions: { x: 0.6, y: 0.4, z: 0.4 },
        color: 0xbdc3c7,
        floorOnly: false,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Microwave.fbx'
    },
    {
        id: 'stove',
        cost: 400,
        type: 'kitchen',
        capacity: 2,
        dimensions: { x: 0.8, y: 0.9, z: 0.8 },
        color: 0x34495e,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Stove.fbx'
    },
    {
        id: 'sink_kitchen',
        cost: 200,
        type: 'kitchen',
        capacity: 1,
        dimensions: { x: 0.8, y: 0.9, z: 0.6 },
        color: 0x7f8c8d,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Sink Desk.fbx'
    },

    // --- BATHROOM ---
    {
        id: 'toilet',
        cost: 200,
        type: 'toilet',
        capacity: 1,
        dimensions: { x: 0.6, y: 0.8, z: 0.8 },
        color: 0xffffff, 
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Toilet 1.fbx'
    },
    {
        id: 'shower',
        cost: 50,
        type: 'shower',
        capacity: 1,
        dimensions: { x: 0.2, y: 0.4, z: 0.2 }, 
        color: 0xbdc3c7, 
        floorOnly: false, 
        wallMounted: true, 
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Shower Head 1.fbx'
    },
    {
        id: 'bathtub',
        cost: 600,
        type: 'shower',
        capacity: 2,
        dimensions: { x: 1.8, y: 0.6, z: 0.8 },
        color: 0xecf0f1,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Bathtub 1.fbx'
    },

    // --- STORAGE ---
    {
        id: 'wardrobe',
        cost: 500,
        type: 'storage',
        capacity: 10,
        dimensions: { x: 1.2, y: 2, z: 0.6 },
        color: 0x8e44ad,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Wardrobe 1.fbx'
    },
    {
        id: 'bookcase',
        cost: 300,
        type: 'storage',
        capacity: 8,
        dimensions: { x: 1, y: 2, z: 0.4 },
        color: 0xd35400,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Bookcase.fbx'
    },
    {
        id: 'crate',
        cost: 20,
        type: 'storage',
        capacity: 1,
        dimensions: { x: 0.5, y: 0.5, z: 0.5 },
        color: 0xd35400,
        floorOnly: false,
        stackable: true,
        modelPath: 'ultimate-interior-pack/Models/Wooden Container 1.fbx'
    },

    // --- ENTERTAINMENT & MISC ---
    {
        id: 'tv',
        cost: 150,
        type: 'entertainment',
        capacity: 1,
        dimensions: { x: 0.8, y: 0.6, z: 0.2 },
        color: 0x2c3e50,
        floorOnly: false,
        wallMounted: true, 
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Television 1.fbx'
    },
    {
        id: 'laptop',
        cost: 1000,
        type: 'entertainment',
        capacity: 1,
        dimensions: { x: 0.4, y: 0.1, z: 0.3 },
        color: 0x34495e,
        floorOnly: false,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Laptop.fbx'
    },
    {
        id: 'plant',
        cost: 30,
        type: 'decor',
        capacity: 1,
        dimensions: { x: 0.4, y: 0.6, z: 0.4 },
        color: 0x2ecc71,
        floorOnly: false,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Potted Plant 1.fbx'
    },
    {
        id: 'cactus',
        cost: 20,
        type: 'decor',
        capacity: 1,
        dimensions: { x: 0.3, y: 0.4, z: 0.3 },
        color: 0x27ae60,
        floorOnly: false,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Cactus Planter.fbx'
    },
    {
        id: 'clock_wall',
        cost: 40,
        type: 'decor',
        capacity: 1,
        dimensions: { x: 0.4, y: 0.4, z: 0.05 },
        color: 0xf1c40f,
        floorOnly: false,
        wallMounted: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Wall Clock 1.fbx'
    },
    {
        id: 'mirror',
        cost: 100,
        type: 'decor',
        capacity: 1,
        dimensions: { x: 0.6, y: 1, z: 0.05 },
        color: 0x3498db,
        floorOnly: false,
        wallMounted: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Mirror 1.fbx'
    },
    {
        id: 'trash_can',
        cost: 15,
        type: 'decor',
        capacity: 1,
        dimensions: { x: 0.4, y: 0.5, z: 0.4 },
        color: 0x7f8c8d,
        floorOnly: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Trash Can 1.fbx'
    },
    {
        id: 'door',
        cost: 100,
        type: 'access',
        capacity: 1,
        dimensions: { x: 1, y: 2, z: 0.1 },
        color: 0x7f8c8d,
        floorOnly: true,
        strictFloor: true,
        stackable: false,
        modelPath: 'ultimate-interior-pack/Models/Door 1.fbx'
    }
];

export function getItemById(id) {
    return ITEM_CATALOG.find(item => item.id === id);
}
