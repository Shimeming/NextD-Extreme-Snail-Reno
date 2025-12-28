export class GameState {
    constructor() {
        this.resetGame();
        
        this.phases = [
            {
                id: 1,
                requirements: { 'toilet': 1 }
            },
            {
                id: 2,
                requirements: { 'toilet': 1, 'sleep': 1 }
            },
            {
                id: 3,
                requirements: { 'toilet': 1, 'sleep': 3 }
            },
            {
                id: 4,
                requirements: { 'toilet': 1, 'sleep': 3, 'shower': 1, 'kitchen': 1 }
            },
            {
                id: 5,
                requirements: { 'toilet': 1, 'sleep': 3, 'shower': 1, 'kitchen': 2, 'seat': 1, 'surface': 1 }
            },
            {
                id: 6,
                requirements: { 'toilet': 2, 'sleep': 4, 'shower': 1, 'kitchen': 3, 'seat': 2, 'surface': 2, 'entertainment': 1 }
            },
            {
                id: 7,
                requirements: { 'toilet': 2, 'sleep': 6, 'shower': 2, 'kitchen': 4, 'storage': 10, 'access': 1, 'decor': 2 }
            }
        ];
    }

    resetGame() {
        this.budget = 0;
        this.currentPhase = 1;
        this.placedItems = []; 
        this.lockedItems = [];
    }

    getCurrentRequirements() {
        if (this.currentPhase > this.phases.length) return {};
        return this.phases[this.currentPhase - 1].requirements;
    }

    addItem(item, meshUuid) {
        this.placedItems.push({
            data: item,
            meshUuid: meshUuid,
            locked: false
        });
        this.budget += item.cost;
    }

    removeItem(meshUuid) {
        const index = this.placedItems.findIndex(i => i.meshUuid === meshUuid);
        if (index !== -1) {
            if (this.placedItems[index].locked) return false; 
            
            this.budget -= this.placedItems[index].data.cost;
            this.placedItems.splice(index, 1);
            return true;
        }
        return false;
    }

    checkRequirements() {
        const reqs = this.getCurrentRequirements();
        const currentStats = {};

        this.placedItems.forEach(p => {
            const type = p.data.type;
            const cap = p.data.capacity || 0;
            if (!currentStats[type]) currentStats[type] = 0;
            currentStats[type] += cap;
        });

        const status = [];
        let allMet = true;

        for (const [type, count] of Object.entries(reqs)) {
            const current = currentStats[type] || 0;
            const met = current >= count;
            if (!met) allMet = false;
            status.push({
                type: type,
                required: count,
                current: current,
                met: met
            });
        }

        return { allMet, status };
    }

    completePhase() {
        const check = this.checkRequirements();
        if (check.allMet) {
            this.placedItems.forEach(item => item.locked = true);
            
            if (this.currentPhase < this.phases.length) {
                this.currentPhase++;
                return true;
            } else {
                return "GAME_COMPLETE";
            }
        }
        return false;
    }
}
