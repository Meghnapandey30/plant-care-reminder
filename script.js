
// Get saved plants from local storage
let plants = JSON.parse(localStorage.getItem("plants")) || [];

// Get today's date
function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

// Save plants in local storage
function savePlants() {
    localStorage.setItem("plants", JSON.stringify(plants));
}

// Display plants on dashboard
function displayPlants() {
    const plantList = document.getElementById("plantList");

    plantList.innerHTML = "";

    plants.forEach((plant, index) => {
        const card = document.createElement("div");
        card.className = "plant-card";

        const name = document.createElement("h3");
        name.textContent = "🌿 " + plant.name;

        const type = document.createElement("p");
        type.textContent = "Type: " + plant.type;

        const date = document.createElement("p");
        date.textContent = "Next watering: " + plant.waterDate;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Plant";
        deleteButton.type = "button";
        deleteButton.style.cssText =
            "background:#b94b4b;color:white;border:0;padding:9px 14px;border-radius:6px;cursor:pointer;margin-top:10px;";

        deleteButton.addEventListener("click", function () {
            plants.splice(index, 1);
            savePlants();
            displayPlants();
            displayReminders();
        });

        card.append(name, type, date, deleteButton);
        plantList.appendChild(card);
    });

    document.getElementById("totalPlants").textContent =
        plants.length;

    const todayTasks = plants.filter(
        plant => plant.waterDate === getToday()
    ).length;

    document.getElementById("totalTasks").textContent =
        todayTasks;
}

// Add a new plant
document.getElementById("plantForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("plantName").value.trim();
    const type = document.getElementById("plantType").value.trim();
    const waterDate = document.getElementById("waterDate").value;

    if (!name || !type || !waterDate) {
        alert("Please fill all the details!");
        return;
    }

    const newPlant = {
        name: name,
        type: type,
        waterDate: waterDate
    };

    plants.push(newPlant);

    savePlants();
    displayPlants();
    displayReminders();

    document.getElementById("plantForm").reset();

    alert("Plant added successfully! 🌱");

    showSection("dashboard");
});

// Display watering reminders
function displayReminders() {
    const reminderList = document.getElementById("reminderList");

    reminderList.innerHTML = "";

    if (plants.length === 0) {
        reminderList.textContent = "No reminders yet. Add your first plant!";
        return;
    }

    const today = getToday();

    const sortedPlants = [...plants].sort(
        (a, b) => a.waterDate.localeCompare(b.waterDate)
    );

    sortedPlants.forEach(plant => {
        const item = document.createElement("p");

        if (plant.waterDate < today) {
            item.textContent = "⚠️ " + plant.name + " - Watering overdue!";
        } else if (plant.waterDate === today) {
            item.textContent = "💧 " + plant.name + " - Water today!";
        } else {
            item.textContent = "🌱 " + plant.name +
                " - Water on " + plant.waterDate;
        }

        item.style.padding = "12px";
        reminderList.appendChild(item);
    });
}

// Switch between website sections
function showSection(sectionId) {
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(sectionId).classList.remove("hidden");
}

// Load saved plants when website opens
displayPlants();
displayReminders();
