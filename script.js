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
    newRecipe.onclick = function () { showDetails(this); };

    document.getElementById('bank').appendChild(newRecipe);
    nameInput.value = "";
    detailsInput.value = "";
}

// 4. Existing Support Functions
function handleDrop(e) {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("text");
    const originalRecipe = document.getElementById(recipeId);

    let targetDay = e.target;
    if (!targetDay.classList.contains('day')) {
        targetDay = targetDay.closest('.day');
    }

    if (originalRecipe && targetDay) {
        // 1. Create a CLONE of the recipe
        const recipeClone = originalRecipe.cloneNode(true);

        // 2. Give the clone a new ID so it's unique
        recipeClone.id = 'clone-' + Date.now();

        // 3. Re-attach the click event to the clone so it still opens the modal
        recipeClone.onclick = function () { showDetails(this); };

        targetDay.appendChild(recipeClone);

        // 4. Save the progress
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
    if (currentRecipeEl) { currentRecipeEl.remove(); closeModal(); }
}

function setupExistingRecipes() {
    document.querySelectorAll('.recipe').forEach(r => {
        r.onclick = function () { showDetails(this); };
        r.ondragstart = (e) => e.dataTransfer.setData("text", e.target.id);
    });
}