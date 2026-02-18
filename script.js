let currentRecipeEl = null;
let currentDate = new Date(); // Starts at today

// 1. Initialize Calendar on Load
window.onload = () => {
    renderCalendar();
    loadAllData();
    setupExistingRecipes();
};

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ""; // Clear old days

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // This targets ONLY the text between the arrows
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const monthDisplay = document.getElementById('monthDisplay');

    if (monthDisplay) {
        monthDisplay.innerText = `${monthName} ${year}`;
    }

    // Calculate days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Create empty slots for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'day empty';
        calendar.appendChild(emptyDiv);
    }

    // Create actual days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        // --- ADD THIS LINE ---
        day.setAttribute('data-day-num', i);
        // ---------------------
        day.innerHTML = `<strong>${i}</strong>`;
        day.ondragover = (e) => e.preventDefault();
        day.ondrop = handleDrop;
        calendar.appendChild(day);
    }
}

// 2. Navigation Buttons
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
    loadAllData();
}

// 3. Updated ADD function (Make sure to include the metadata part)
function addNewRecipe() {
    const nameInput = document.getElementById('recipeInput');
    const detailsInput = document.getElementById('detailsInput');
    if (nameInput.value === "") return;

    const newRecipe = document.createElement('div');
    newRecipe.className = 'recipe';
    newRecipe.draggable = true;
    newRecipe.id = 'r' + Date.now();
    newRecipe.innerText = nameInput.value;
    newRecipe.setAttribute('data-info', detailsInput.value);

    newRecipe.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
    newRecipe.onclick = function () { showDetails(this); };

    document.getElementById('bank').appendChild(newRecipe);
    nameInput.value = "";
    detailsInput.value = "";

    saveAllData();
}

// 4. Existing Support Functions
function handleDrop(e) {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("text");
    const originalRecipe = document.getElementById(recipeId);

    // Find the closest parent with the class 'day'
    let targetDay = e.target;
    if (!targetDay.classList.contains('day')) {
        targetDay = targetDay.closest('.day');
    }

    if (originalRecipe && targetDay) {
        // --- THIS IS THE MAGIC PART ---
        // Instead of moving the recipe, we make a COPY (clone) of it
        const recipeClone = originalRecipe.cloneNode(true);
        
        // We give the clone a unique ID so it doesn't clash with the original
        recipeClone.id = 'clone-' + Date.now();
        
        // We have to re-attach the click event so the modal still works on the clone
        recipeClone.onclick = function () { showDetails(this); };
        
        // Now we put the CLONE on the calendar, leaving the original in the sidebar
        targetDay.appendChild(recipeClone);
        // ------------------------------

        saveAllData();
    }
}

function showDetails(recipeElement) {
    currentRecipeEl = recipeElement;
    document.getElementById('modalTitle').innerText = recipeElement.innerText;
    document.getElementById('modalDetails').innerText = recipeElement.getAttribute('data-info') || "No details.";
    document.getElementById('recipeModal').style.display = "block";
}

function closeModal() { document.getElementById('recipeModal').style.display = "none"; }

function deleteCurrentRecipe() {
    if (currentRecipeEl) { 
        currentRecipeEl.remove(); 
        closeModal(); 
        saveAllData(); // <--- Add this
    }
}

function setupExistingRecipes() {
    document.querySelectorAll('.recipe').forEach(r => {
        r.onclick = function () { showDetails(this); };
        r.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
    });
}

function saveAllData() {
    const bankRecipes = [];
    const calendarRecipes = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 1. Save the Sidebar (Bank) items
    document.querySelectorAll('#bank .recipe').forEach(r => {
        // We only save the original recipes, not the ones already moved to the calendar
        bankRecipes.push({
            id: r.id,
            name: r.innerText,
            info: r.getAttribute('data-info')
        });
    });

    // 2. Save the Calendar items
    document.querySelectorAll('.day .recipe').forEach(r => {
        calendarRecipes.push({
            name: r.innerText,
            info: r.getAttribute('data-info'),
            day: r.parentElement.getAttribute('data-day-num')
        });
    });

    localStorage.setItem('recipeBank', JSON.stringify(bankRecipes));
    localStorage.setItem(`mealData-${year}-${month}`, JSON.stringify(calendarRecipes));
}

function loadAllData() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // 1. Clear the bank (to avoid duplicates) and load saved sidebar items
    const bankSaved = localStorage.getItem('recipeBank');
    if (bankSaved) {
        // Find the input area so we don't delete it
        const inputArea = document.querySelector('.input-area');
        const bank = document.getElementById('bank');
        
        // Remove old recipe divs but keep the title and input area
        document.querySelectorAll('#bank .recipe').forEach(r => r.remove());

        JSON.parse(bankSaved).forEach(data => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe';
            recipeDiv.draggable = true;
            recipeDiv.id = data.id;
            recipeDiv.innerText = data.name;
            recipeDiv.setAttribute('data-info', data.info || "");
            
            // Re-attach the drag and click events
            recipeDiv.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
            recipeDiv.onclick = function() { showDetails(this); };
            
            bank.appendChild(recipeDiv);
        });
    }

    // 2. Load the Calendar items (as we did before)
    const calendarSaved = localStorage.getItem(`mealData-${year}-${month}`);
    if (calendarSaved) {
        document.querySelectorAll('.day .recipe').forEach(r => r.remove());
        JSON.parse(calendarSaved).forEach(data => {
            const targetDay = document.querySelector(`.day[data-day-num="${data.day}"]`);
            if (targetDay) {
                const savedRecipe = document.createElement('div');
                savedRecipe.className = 'recipe';
                savedRecipe.innerText = data.name;
                savedRecipe.setAttribute('data-info', data.info || "");
                savedRecipe.onclick = function() { showDetails(this); };
                targetDay.appendChild(savedRecipe);
            }
        });
    }
}