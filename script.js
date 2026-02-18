const calendar = document.getElementById('calendar');

// Just like C/Python: We loop 30 times to make 30 days
for (let i = 1; i <= 30; i++) {
    const dayBox = document.createElement('div');
    dayBox.className = 'day';
    dayBox.innerHTML = `Day ${i}`;
    
    // Logic to allow a recipe to be dropped here
    dayBox.ondragover = (e) => e.preventDefault();
    dayBox.ondrop = (e) => {
        const id = e.dataTransfer.getData("text");
        const recipe = document.getElementById(id);
        dayBox.appendChild(recipe);
    };
    
    calendar.appendChild(dayBox);
}

// Logic to let the recipes be "draggable"
document.querySelectorAll('.recipe').forEach(recipe => {
    recipe.ondragstart = (e) => {
        e.dataTransfer.setData("text", e.target.id);
    };
});