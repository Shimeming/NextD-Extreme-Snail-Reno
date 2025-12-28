import { ITEM_CATALOG } from './items.js';
import { t, tItem, tPhase, setLanguage, getLang } from './lang.js';

export class UIManager {
    constructor(gameState, gameLogicCallbacks) {
        this.gameState = gameState;
        this.callbacks = gameLogicCallbacks; // { onSelectItem, onCompletePhase, onStartGame, onRestart, onBackToTitle }
        
        this.elements = {
            budget: document.getElementById('budget-display'),
            phase: document.getElementById('phase-display'),
            reqList: document.getElementById('req-list'),
            itemList: document.getElementById('item-list'),
            inventoryPanel: document.getElementById('inventory-panel'),
            completeBtn: document.getElementById('complete-phase-btn'),
            feedback: document.getElementById('phase-feedback'),
            startScreen: document.getElementById('start-screen'),
            langBtn: document.getElementById('lang-btn'),
            restartBtn: document.getElementById('restart-btn'),
            titleBtn: document.getElementById('title-btn'),
            controlPanel: document.getElementById('control-panel'),
            menuToggleBtn: document.getElementById('menu-toggle-btn'),
            controlsHint: document.getElementById('controls-hint'),
            requirementsHeader: document.querySelector('#requirements-panel h3'),
            inventoryHeader: document.querySelector('#inventory-panel h3')
        };

        this.initInventory();
        this.bindEvents();
        this.updateText();
    }

    initInventory() {
        this.elements.itemList.innerHTML = '';
        ITEM_CATALOG.forEach(item => {
            const card = document.createElement('div');
            card.className = 'item-card';
            // Store item ID to refresh text later
            card.dataset.itemId = item.id;
            
            card.innerHTML = `
                <div class="item-icon" style="background-color: #${item.color.toString(16).padStart(6, '0')}"></div>
                <div class="item-name">${tItem(item.id)}</div>
                <div style="font-size:0.8em; color: #666;">$${item.cost}</div>
            `;
            card.addEventListener('click', () => {
                document.querySelectorAll('.item-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.callbacks.onSelectItem(item);
            });
            this.elements.itemList.appendChild(card);
        });
    }

    bindEvents() {
        this.elements.completeBtn.addEventListener('click', () => {
            this.callbacks.onCompletePhase();
        });

        this.elements.startScreen.addEventListener('click', (e) => {
            // Only start if not clicking a button inside (if we added buttons there)
            // But currently the whole screen is a click zone.
            this.elements.startScreen.style.display = 'none';
            this.callbacks.onStartGame();
        });

        this.elements.langBtn.addEventListener('click', () => {
            const newLang = getLang() === 'en' ? 'zh' : 'en';
            setLanguage(newLang);
            this.elements.langBtn.textContent = t('lang');
            this.updateText();
            this.update(); // Update dynamic values
        });

        this.elements.menuToggleBtn.addEventListener('click', () => {
            this.elements.controlPanel.classList.toggle('hidden');
        });

        this.elements.restartBtn.addEventListener('click', () => {
            this.callbacks.onRestart();
            this.elements.controlPanel.classList.add('hidden');
        });

        this.elements.titleBtn.addEventListener('click', () => {
            this.callbacks.onBackToTitle();
            this.elements.controlPanel.classList.add('hidden');
        });
    }

    updateText() {
        // Static text updates
        this.elements.requirementsHeader.textContent = t('reqHeader');
        this.elements.inventoryHeader.textContent = t('inventory');
        this.elements.completeBtn.textContent = t('completeBtn');
        this.elements.controlsHint.textContent = t('controls');
        this.elements.langBtn.textContent = t('lang');

        // Inventory names
        document.querySelectorAll('.item-card').forEach(card => {
            const nameEl = card.querySelector('.item-name');
            if (nameEl && card.dataset.itemId) {
                nameEl.textContent = tItem(card.dataset.itemId);
            }
        });

        // Start screen might need refresh if visible
        if (this.elements.startScreen.style.display !== 'none') {
             // Basic start screen text refresh if needed, but it's usually transient
             const title = this.elements.startScreen.querySelector('h1');
             if(title && title.textContent !== t('win')) { // Don't overwrite win message
                 title.textContent = t('title');
                 const p = this.elements.startScreen.querySelectorAll('p');
                 if(p[0]) p[0].textContent = t('subtitle');
                 if(p[1]) p[1].textContent = t('start');
             }
        }
    }

    update() {
        // Update Budget
        this.elements.budget.textContent = `${t('budget')}: $${this.gameState.budget}`;
        this.elements.phase.textContent = `${t('phase')}: ${this.gameState.currentPhase}`;

        // Update Requirements
        const check = this.gameState.checkRequirements();
        this.elements.reqList.innerHTML = '';
        
        // Add Phase Description
        const desc = document.createElement('li');
        desc.style.fontStyle = 'italic';
        desc.style.marginBottom = '10px';
        desc.textContent = tPhase(this.gameState.currentPhase);
        this.elements.reqList.appendChild(desc);

        check.status.forEach(stat => {
            const li = document.createElement('li');
            const typeName = tItem(stat.type) !== stat.type ? tItem(stat.type) : stat.type.charAt(0).toUpperCase() + stat.type.slice(1);
            li.textContent = `${typeName}: ${stat.current}/${stat.required}`;
            li.className = stat.met ? 'req-met' : 'req-unmet';
            this.elements.reqList.appendChild(li);
        });

        this.elements.completeBtn.disabled = !check.allMet;
        
        if (check.allMet) {
            this.elements.feedback.textContent = t('feedback_met');
            this.elements.feedback.style.color = "#4caf50";
        } else {
            this.elements.feedback.textContent = t('feedback_unmet');
            this.elements.feedback.style.color = "#ff5722";
        }
    }

    toggleInventory(show) {
        if (show) {
            this.elements.inventoryPanel.classList.remove('hidden');
        } else {
            this.elements.inventoryPanel.classList.add('hidden');
        }
    }
    
    showWin() {
        this.elements.startScreen.innerHTML = `<h1>${t('win')}</h1><p>${t('finalBudget')}: $${this.gameState.budget}</p><p>${t('refresh')}</p>`;
        this.elements.startScreen.style.display = 'flex';
    }

    showTitle() {
        this.elements.startScreen.innerHTML = `<h1>${t('title')}</h1><p>${t('subtitle')}</p><p>${t('start')}</p>`;
        this.elements.startScreen.style.display = 'flex';
    }
}