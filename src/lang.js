export const TRANSLATIONS = {
    en: {
        title: "Micro-Renovator",
        subtitle: "Fit the requirements. Save the money.",
        start: "Click to Start",
        budget: "Budget",
        phase: "Phase",
        reqHeader: "Requirements",
        completeBtn: "Complete Phase",
        controls: "[WASD] Move | [Mouse] Look\n[E] Inventory | [Scroll] Rotate\n[L-Click] Place | [R-Click] Remove",
        inventory: "Inventory",
        win: "You Win!",
        finalBudget: "Final Budget",
        refresh: "Click 'Restart' to play again",
        restart: "Restart Game",
        titleScreen: "Title Screen",
        lang: "中文",
        feedback_met: "Requirements Met!",
        feedback_unmet: "Requirements not met.",
        locked: "Locked",
        items: {
            single_bed: "Single Bed",
            double_bed: "Double Bed",
            bunk_bed: "Bunk Bed",
            floor_mat: "Floor Mat",
            toilet: "Toilet",
            shower: "Shower Head",
            shelf: "Storage Shelf",
            crate: "Wood Crate",
            chair: "Basic Chair",
            gaming_chair: "Gaming Chair",
            table: "Small Table",
            door: "Door",
            plant: "Potted Plant",
            tv: "Old TV"
        },
        phases: {
            1: "Basic Needs: Install a toilet.",
            2: "Moving In: We need a place to sleep.",
            3: "Roommates: Two friends are joining.",
            4: "Hygiene Upgrade: One toilet isn't enough, and we need a shower.",
            5: "Working From Home: Need a desk and chair.",
            6: "Entertainment: Add a TV for the group.",
            7: "Crowded House: Maximize efficiency!"
        }
    },
    zh: {
        title: "微型改造王",
        subtitle: "滿足需求，越省越好。",
        start: "點擊開始",
        budget: "預算",
        phase: "階段",
        reqHeader: "需求清單",
        completeBtn: "完成階段",
        controls: "[WASD] 移動 | [滑鼠] 視角\n[E] 物品欄 | [滾輪] 旋轉\n[左鍵] 放置 | [右鍵] 移除",
        inventory: "家具倉庫",
        win: "恭喜通關！",
        finalBudget: "最終花費",
        refresh: "請點擊「重新開始」",
        restart: "重新開始",
        titleScreen: "回標題畫面",
        lang: "English",
        feedback_met: "需求已達成！",
        feedback_unmet: "需求未達成。",
        locked: "已鎖定",
        items: {
            single_bed: "單人床",
            double_bed: "雙人床",
            bunk_bed: "雙層床",
            floor_mat: "地墊",
            toilet: "馬桶",
            shower: "蓮蓬頭",
            shelf: "置物架",
            crate: "木箱",
            chair: "折疊椅",
            gaming_chair: "電競椅",
            table: "小方桌",
            door: "門",
            plant: "盆栽",
            tv: "舊電視"
        },
        phases: {
            1: "基本需求：首先，我們需要一個馬桶。",
            2: "入住準備：需要一個睡覺的地方。",
            3: "室友加入：兩個朋友要搬進來了。",
            4: "衛生升級：人變多了，一個馬桶不夠，還需要淋浴間。",
            5: "在家工作：需要一張桌子和椅子。",
            6: "休閒娛樂：買台電視給大家看吧。",
            7: "極限生存：最大化空間利用！"
        }
    }
};

let currentLang = 'en';

export function setLanguage(lang) {
    currentLang = lang;
}

export function getLang() {
    return currentLang;
}

export function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

export function tItem(id) {
    return TRANSLATIONS[currentLang].items[id] || id;
}

export function tPhase(id) {
    return TRANSLATIONS[currentLang].phases[id] || "";
}
