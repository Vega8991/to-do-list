const questInput = document.getElementById('quest-input');
const addBtn = document.getElementById('add-btn');
const questList = document.getElementById('quest-list');
const emptyMessage = document.getElementById('empty-message');
const completedCount = document.getElementById('completed-count');
const activeCount = document.getElementById('active-count');

let quests = [];

function init() {
    loadQuestsFromLocalStorage();
    renderQuests();
    updateStats();
}

addBtn.addEventListener('click', addQuest);
questInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addQuest();
    }
});

function addQuest() {
    const questText = questInput.value.trim();
    
    if (questText === '') {
        alert('¡Escribe una misión antes de agregar!');
        return;
    }
    
    const newQuest = {
        id: Date.now(),
        text: questText,
        completed: false
    };
    
    quests.push(newQuest);
    questInput.value = '';
    
    saveQuestsToLocalStorage();
    renderQuests();
    updateStats();
}

function renderQuests() {
    questList.innerHTML = '';
    
    if (quests.length === 0) {
        emptyMessage.classList.add('show');
        return;
    }
    
    emptyMessage.classList.remove('show');
    
    quests.forEach(quest => {
        const li = document.createElement('li');
        li.className = `quest-item ${quest.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', quest.id);
        
        li.innerHTML = `
            <span class="quest-text">${quest.text}</span>
            <div class="quest-actions">
                <button class="btn-complete" onclick="toggleComplete(${quest.id})">
                    ${quest.completed ? 'Reabrir' : 'Completar'}
                </button>
                <button class="btn-delete" onclick="deleteQuest(${quest.id})">
                    Eliminar
                </button>
            </div>
        `;
        
        questList.appendChild(li);
    });
}

function toggleComplete(id) {
    const quest = quests.find(q => q.id === id);
    if (quest) {
        quest.completed = !quest.completed;
        saveQuestsToLocalStorage();
        renderQuests();
        updateStats();
    }
}

function deleteQuest(id) {
    quests = quests.filter(q => q.id !== id);
    saveQuestsToLocalStorage();
    renderQuests();
    updateStats();
}

function updateStats() {
    const completed = quests.filter(q => q.completed).length;
    const active = quests.filter(q => !q.completed).length;
    
    completedCount.textContent = completed;
    activeCount.textContent = active;
}

function saveQuestsToLocalStorage() {
    localStorage.setItem('quests', JSON.stringify(quests));
}

function loadQuestsFromLocalStorage() {
    const savedQuests = localStorage.getItem('quests');
    if (savedQuests) {
        quests = JSON.parse(savedQuests);
    }
}

init();
