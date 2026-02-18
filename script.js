// 1. Global State: This "remembers" which recipe we are currently looking at in the popup
let currentRecipeEl = null;

// 2. Initialize the Calendar (Runs once when the page loads)
const calendar = document.getElementById('calendar');
for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'day';
    day.innerHTML = `<strong>Day ${i}</strong>`;
    
    // Allow the day box to receive dropped recipes
    day.ondragover = (e) => e.preventDefault();
    day.ondrop = handleDrop;
    
    calendar.appendChild(day);
}

function addNewRecipe() {
    const nameInput = document.getElementById('recipeInput');
    const detailsInput = document.getElementById('detailsInput');
    
    const recipeName = nameInput.value;
    const recipeDetails = detailsInput.value;

    if (recipeName === "") return;

    const newRecipe = document.createElement('div');
    newRecipe.className = 'recipe';
    newRecipe.draggable = true;
    newRecipe.id = 'r' + Date.now();
    
    // This puts the name on the card
    newRecipe.innerText = recipeName; 
    
    // This "hides" the details inside the element so we can find them later
    newRecipe.setAttribute('data-info', recipeDetails);

    newRecipe.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.id);
    };

    document.getElementById('bank').appendChild(newRecipe);

    // Clear both boxes
    nameInput.value = "";
    detailsInput.value = "";
}

// 4. The "POPUP" Logic: Shows the recipe details and delete button
function showDetails(recipeElement) {
    currentRecipeEl = recipeElement; // Link the global variable to this specific card
    
    const name = recipeElement.innerText;
    const details = recipeElement.getAttribute('data-info');

    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalDetails').innerText = details || "No details added yet!";
    document.getElementById('recipeModal').style.display = "block";
}

function closeModal() {
    document.getElementById('recipeModal').style.display = "none";
    currentRecipeEl = null; // Clear the memory
}

// 5. The "DELETE" Logic: Removes the card from the UI
function deleteCurrentRecipe() {
    if (currentRecipeEl) {
        currentRecipeEl.remove(); // Removes the HTML element
        closeModal();             // Closes the popup
    }
}

// 6. The "DRAG & DROP" Logic
function handleDrop(e) {
    e.preventDefault();
    const recipeId = e.dataTransfer.getData("text");
    const recipeElement = document.getElementById(recipeId);
    
    // "this" refers to the Day box we dropped into
    if (recipeElement) {
        this.appendChild(recipeElement);
    }
}

// 7. Make the existing sample recipes clickable too
document.querySelectorAll('.recipe').forEach(recipe => {
    recipe.onclick = function() {
        showDetails(this);
    };
});

function addNewRecipe() {
    // 1. Get the text from the input box
    const input = document.getElementById('recipeInput');
    const recipeName = input.value;

    // 2. If the box is empty, don't do anything
    if (recipeName === "") return;

    // 3. Create a new <div> for the recipe
    const newRecipe = document.createElement('div');
    newRecipe.className = 'recipe';
    newRecipe.draggable = true;
    newRecipe.id = 'r' + Date.now(); // Give it a unique ID based on the time
    newRecipe.innerText = recipeName;

    // 4. Add the dragging logic (just like the other recipes)
    newRecipe.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.id);
    };

    // 5. Put the new recipe into the "Bank"
    document.getElementById('bank').appendChild(newRecipe);

    // 6. Clear the input box so you can add another one
    input.value = "";
}