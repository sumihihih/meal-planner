let currentRecipeEl = null;
let currentDate = new Date(); // Starts at today

// 1. Initialize Calendar on Load
window.onload = () => {
    renderCalendar();
    setupExistingRecipes();
};

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = ""; // Clear old days

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // THIS LINE fixes the "Month Year" text:
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    document.getElementById('monthDisplay').innerText = `${monthName} ${year}`;
    
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
    newRecipe.onclick = function() { showDetails(this); };

    document.getElementById('bank').appendChild(newRecipe);
    nameInput.value = "";
    detailsInput.value = "";
}

// 4. Existing Support Functions
function handleDrop(e) {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("text");
    const recipeElement = document.getElementById(recipeId);

    // Ensure we are dropping into a 'day' div, not accidentally into the number inside it
    let targetDay = e.target;
    if (!targetDay.classList.contains('day')) {
        targetDay = targetDay.closest('.day');
    }
    
    if (recipeElement && targetDay) {
        targetDay.appendChild(recipeElement);
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
    if (currentRecipeEl) { currentRecipeEl.remove(); closeModal(); }
}

function setupExistingRecipes() {
    document.querySelectorAll('.recipe').forEach(r => {
        r.onclick = function() { showDetails(this); };
        r.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
    });
}
renderCalendar();
