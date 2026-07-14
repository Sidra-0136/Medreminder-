let editingCard = null;
let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
const form = document.getElementById("medicine-form");
const medicineContainer = document.getElementById("medicine-container");
const placeholder = document.getElementById("placeholder");

function createMedicineCard(medicine) {

    const card = document.createElement("div");
    card.dataset.id = medicine.id;
    card.className = "medicine-card";

    card.innerHTML = `
        <h3>💊 ${medicine.medicineName}</h3>
        <p>💉 Dosage: ${medicine.dosage}</p>
        <p>⏰ Time: ${medicine.time}</p>
        <p>🔁 Repeat: ${medicine.repeatText}</p>

        <div class="card-buttons">
            <button class="taken-btn">✅ Mark as Taken</button>
            <button class="edit-btn">✏ Edit</button>
            <button class="delete-btn">🗑 Delete</button>
        </div>
    `;

const deleteBtn = card.querySelector(".delete-btn");

deleteBtn.addEventListener("click", function () {
medicines = medicines.filter(function(item) {
    return item.id !== medicine.id;
});

localStorage.setItem("medicines", JSON.stringify(medicines));
    card.remove();

    if (medicineContainer.children.length === 1) {
        placeholder.style.display = "flex";
    }

});

const takenBtn = card.querySelector(".taken-btn");

takenBtn.addEventListener("click", function () {
medicine.taken = true;

localStorage.setItem(
    "medicines",
    JSON.stringify(medicines)
);
    takenBtn.textContent = "✅ Taken";
    takenBtn.disabled = true;

    card.style.backgroundColor = "#f0fdf4";
    card.style.borderColor = "#22c55e";
    takenBtn.style.backgroundColor = "#166534";

});

const editBtn = card.querySelector(".edit-btn");

editBtn.addEventListener("click", function () {

    editingCard = card;

    form.classList.remove("hidden");

    document.getElementById("medicine-name").value = medicine.medicineName;
    document.getElementById("dosage").value = medicine.dosage;
    document.getElementById("time").value = medicine.time;

});
if (medicine.taken) {

    takenBtn.textContent = "✅ Taken";
    takenBtn.disabled = true;

    card.style.backgroundColor = "#f0fdf4";
    card.style.borderColor = "#22c55e";
    takenBtn.style.backgroundColor = "#166534";

}
    medicineContainer.appendChild(card);

    return card;
};

medicines.forEach(function(medicine) {
    createMedicineCard(medicine);
});

if (medicines.length > 0) {
    placeholder.style.display = "none";
}

form.addEventListener("submit", function(event){

    event.preventDefault();

    const medicineName = document.getElementById("medicine-name").value;
    const dosage = document.getElementById("dosage").value;
    const time = document.getElementById("time").value;
    placeholder.style.display = "none";
    const repeat = document.querySelector('input[name="repeat"]:checked').value;
    
    const selectedDays = [];

document.querySelectorAll('#days input[type="checkbox"]:checked').forEach(day => {
    selectedDays.push(day.value);
});

let repeatText;

if (repeat === "Daily") {
    repeatText = "Daily";
} else {
    repeatText = selectedDays.join(", ");
}

if (repeat === "Specific Days" && selectedDays.length === 0) {
    alert("Please select at least one day.");
    return;
}
    
    if (editingCard) {

    editingCard.querySelector("h3").textContent = `💊 ${medicineName}`;
    editingCard.querySelectorAll("p")[0].textContent = `💉 Dosage: ${dosage}`;
    editingCard.querySelectorAll("p")[1].textContent = `⏰ Time: ${time}`;
    editingCard.querySelectorAll("p")[2].textContent = `🔁 Repeat: ${repeatText}`;
    const medicineToUpdate = medicines.find(function(item) {
    return item.id === Number (editingCard.dataset.id);
});
if (medicineToUpdate) {
    medicineToUpdate.medicineName = medicineName;
    medicineToUpdate.dosage = dosage;
    medicineToUpdate.time = time;
    medicineToUpdate.repeatText = repeatText;

    localStorage.setItem("medicines", JSON.stringify(medicines));
}

    editingCard = null;

    form.reset();
    form.classList.add("hidden");

    return;
}
    
    const medicine = {
        id: Date.now(),
        medicineName,
        dosage,
        time,
        repeat: repeat,
        selectedDays: selectedDays,
        repeatText: repeatText,
        taken: false
    };
    medicines.push(medicine);
    localStorage.setItem("medicines",
        JSON.stringify(medicines)
    );
    createMedicineCard(medicine);
    

    form.reset();
    form.classList.add("hidden");

});

const addBtn = document.getElementById("add-btn");
const cancelBtn = document.getElementById("cancel-btn");

addBtn.addEventListener("click", () => {
    form.classList.remove("hidden");
});

cancelBtn.addEventListener("click", () => {
    form.classList.add("hidden");
    form.reset();
});

const daily = document.getElementById("daily");
const specific = document.getElementById("specific");
const days = document.getElementById("days");

daily.addEventListener("change", () => {
    days.style.display = "none";
});

specific.addEventListener("change", () => {
    days.style.display = "flex";
});