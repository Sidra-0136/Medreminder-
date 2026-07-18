let editingCard = null;
let remindedMedicines = [];
const reminderSound = new Audio("notification.wav");
let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
const form = document.getElementById("medicine-form");
const medicineContainer = document.getElementById("medicine-container");
const placeholder = document.getElementById("placeholder");

let currentLanguage = localStorage.getItem("language") || "english";
const languageBtn = document.getElementById("language-btn");
const translations = {
    english: {
        tagline: "Never miss your medication",
        addBtn: "+ Add Medicine",
        medicineCount: "Today's Medicines",
        formTitle: "Add New Medicine",
        medicineLabel: "Medicine Name",
        dosageLabel: "Dosage",
        timeLabel: "Time",
        repeatLabel: "Repeat",
        daily: "Daily",
        specific: "Specific Days",
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday",
        save: "Save",
        cancel: "Cancel",
        placeholderTitle: "No medicines added yet",
        placeholderText: 'Click "Add Medicine" to get started',
        cardDosage: "Dosage",
        cardTime: "Time",
        cardRepeat: "Repeat",
        cardTaken: "Mark as Taken",
        cardTakenDone: "✅ Taken",
        cardEdit: "✏ Edit",
        cardDelete: "🗑 Delete",
    },
    urdu: {
        tagline: "اپنی دوا لینا کبھی نہ بھولیں",
        addBtn: "+ دوا شامل کریں",
        medicineCount: "آج کی دوائیں",
        formTitle: "نئی دوا شامل کریں",
        medicineLabel: "دوا کا نام",
        dosageLabel: "خوراک",
        timeLabel: "وقت",
        repeatLabel: "دہرائیں",
        daily: "روزانہ",
        specific: "مخصوص دن",
        monday: "پیر",
        tuesday: "منگل",
        wednesday: "بدھ",
        thursday: "جمعرات",
        friday: "جمعہ",
        saturday: "ہفتہ",
        sunday: "اتوار",
        save: "محفوظ کریں",
        cancel: "منسوخ کریں",
        placeholderTitle: "فی الحال کوئی دوا موجود نہیں ہے",
        placeholderText: 'شروع کرنے کے لیے "دوا شامل کریں" پر کلک کریں',
        cardDosage: "خوراک",
        cardTime: "وقت",
        cardRepeat: "دہرائیں",
        cardTaken: "دوا لے لیں",
        cardTakenDone: "✅ دوا لی جا چکی ہے",
        cardEdit: "✏ ترمیم",
        cardDelete: "🗑 حذف کریں",
    }
};

function changeLanguage() {
    
    const text = translations[currentLanguage];
    
    document.getElementById("tagline").textContent = text.tagline;
    document.getElementById("add-btn").textContent = text.addBtn;
    
    updateMedicineCount();
    
    document.getElementById("form-title").textContent = text.formTitle;
    
    document.getElementById("medicine-label").textContent = text.medicineLabel;
    document.getElementById("dosage-label").textContent = text.dosageLabel;
    document.getElementById("time-label").textContent = text.timeLabel;
    document.getElementById("repeat-label").textContent = text.repeatLabel;
    
    document.getElementById("daily-label").lastChild.textContent = " " + text.daily;
    document.getElementById("specific-label").lastChild.textContent = " " + text.specific;
    
    document.getElementById("monday-label").lastChild.textContent = " " + text.monday;
    document.getElementById("tuesday-label").lastChild.textContent = " " + text.tuesday;
    document.getElementById("wednesday-label").lastChild.textContent = " " + text.wednesday;
    document.getElementById("thursday-label").lastChild.textContent = " " + text.thursday;
    document.getElementById("friday-label").lastChild.textContent = " " + text.friday;
    document.getElementById("saturday-label").lastChild.textContent = " " + text.saturday;
    document.getElementById("sunday-label").lastChild.textContent = " " + text.sunday;
    
    document.getElementById("save-btn").textContent = text.save;
    document.getElementById("cancel-btn").textContent = text.cancel;
    
    document.getElementById("placeholder-title").textContent = text.placeholderTitle;
    document.getElementById("placeholder-text").textContent = text.placeholderText;
    const medicineNameInput = document.getElementById("medicine-name");
    const dosageInput = document.getElementById("dosage");
    
    if (currentLanguage === "english") {
        
        medicineNameInput.placeholder = "Enter medicine name";
        dosageInput.placeholder = "e.g. 500 mg";
        
    } else {
        
        medicineNameInput.placeholder = "دوا کا نام درج کریں";
        dosageInput.placeholder = "مثال: 500 ملی گرام";
        
    }
    if (currentLanguage === "english") {
        
        languageBtn.textContent = "🌐 اردو";
        
    } else {
        
        languageBtn.textContent = "🌐 English";
        
    }
    if (currentLanguage === "urdu") {
        
        document.body.dir = "rtl";
        
    } else {
        
        document.body.dir = "ltr";
        
    }
    //renderMedicines();
}

function updateMedicineCount() {
    const medicineCount = document.getElementById("medicine-count");
    if (currentLanguage === "english") {
        medicineCount.textContent =
            `Today's Medicines (${medicines.length})`;
    } else {
        medicineCount.textContent =
            `آج کی دوائیں (${medicines.length})`;
    }
    
}

function renderMedicines() {
    
    medicineContainer.innerHTML = "";
    medicineContainer.appendChild(placeholder);
    placeholder.style.display = "none";
    
    medicines.forEach(function(medicine) {
        createMedicineCard(medicine);
    });
    
    if (medicines.length === 0) {
        medicineContainer.appendChild(placeholder);
        placeholder.style.display = "flex";
    }
    
}

function createMedicineCard(medicine) {
    
    const card = document.createElement("div");
    card.dataset.id = medicine.id;
    card.className = "medicine-card";
    
    const text = translations[currentLanguage];
    
    let repeatDisplay;
    
    if (medicine.repeat === "Daily") {
        repeatDisplay = text.daily;
    } else {
        repeatDisplay = medicine.selectedDays.map(function(day) {
            return translations[currentLanguage][day.toLowerCase()];
        }).join(", ");
    }
    
    card.innerHTML = `
        <h3>💊 ${medicine.medicineName}</h3>
<p>💉 ${text.cardDosage}: ${medicine.dosage}</p>
<p>⏰ ${text.cardTime}: ${medicine.time}</p>
<p>🔁 ${text.cardRepeat}: ${repeatDisplay}</p>

<div class="card-buttons">
<button class="taken-btn">${text.cardTaken}</button>
<button class="edit-btn">${text.cardEdit}</button>
<button class="delete-btn">${text.cardDelete}</button>
</div>
`;
    
    const deleteBtn = card.querySelector(".delete-btn");
    
    deleteBtn.addEventListener("click", function() {
        medicines = medicines.filter(function(item) {
            return item.id !== medicine.id;
        });
        
        localStorage.setItem("medicines", JSON.stringify(medicines));
        card.remove();
        
        updateMedicineCount();
        
        if (medicineContainer.children.length === 1) {
            placeholder.style.display = "flex";
        }
        
    });
    
    const takenBtn = card.querySelector(".taken-btn");
    
    takenBtn.addEventListener("click", function() {
        medicine.taken = true;
        
        localStorage.setItem(
            "medicines",
            JSON.stringify(medicines)
        );
        //takenBtn.textContent = "✅ Taken";
        takenBtn.textContent = translations[currentLanguage].cardTakenDone;
        takenBtn.disabled = true;
        
        card.style.backgroundColor = "#f0fdf4";
        card.style.borderColor = "#22c55e";
        takenBtn.style.backgroundColor = "#166534";
        
    });
    
    const editBtn = card.querySelector(".edit-btn");
    
    editBtn.addEventListener("click", function() {
        
        editingCard = card;
        
        form.classList.remove("hidden");
        
        document.getElementById("medicine-name").value = medicine.medicineName;
        document.getElementById("dosage").value = medicine.dosage;
        document.getElementById("time").value = medicine.time;
        document.querySelectorAll('#days input[type="checkbox"]').forEach(function(day) {
            day.checked = false;
        });
        if (medicine.repeat === "Daily" || medicine.repeat === "daily")
        {
            
            document.getElementById("daily").checked = true;
            days.style.display = "none";
            
        } else {
            
            document.getElementById("specific").checked = true;
            days.style.display = "flex";
            
            document.querySelectorAll('#days input[type="checkbox"]').forEach(function(day) {
                day.checked = medicine.selectedDays.includes(day.value);
            });
            
        }
        
    });
    if (medicine.taken) {
        
        //takenBtn.textContent = "✅ Taken";
        takenBtn.textContent = translations[currentLanguage].cardTakenDone;
        
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

updateMedicineCount();

if (medicines.length > 0) {
    placeholder.style.display = "none";
}
changeLanguage();

form.addEventListener("submit", function(event) {
    
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
        if (currentLanguage === "english") {
            alert("Please select at least one day.");
        } else {
            alert("کم از کم ایک دن منتخب کریں۔");
        }
        return;
    }
    
    if (editingCard) {
        const text = translations[currentLanguage];
        
        let repeatDisplay;
        
        if (repeat === "Daily") {
            
            repeatDisplay = text.daily;
            
        } else {
            
            repeatDisplay = selectedDays.map(function(day) {
                return translations[currentLanguage][day.toLowerCase()];
            }).join(", ");
            
        }
        
        editingCard.querySelector("h3").textContent =
            `💊 ${medicineName}`;
        
        editingCard.querySelectorAll("p")[0].textContent =
            `💉 ${text.cardDosage}: ${dosage}`;
        
        editingCard.querySelectorAll("p")[1].textContent =
            `⏰ ${text.cardTime}: ${time}`;
        
        editingCard.querySelectorAll("p")[2].textContent =
            `🔁 ${text.cardRepeat}: ${repeatDisplay}`;
        
        const medicineToUpdate = medicines.find(function(item) {
            return item.id === Number(editingCard.dataset.id);
        });
        
        if (medicineToUpdate) {
            
            medicineToUpdate.medicineName = medicineName;
            medicineToUpdate.dosage = dosage;
            medicineToUpdate.time = time;
            
            medicineToUpdate.repeat = repeat;
            medicineToUpdate.selectedDays = selectedDays;
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
    
    updateMedicineCount();
    
    
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
    const text = translations[currentLanguage];
    days.style.display = "flex";
});
languageBtn.addEventListener("click", function() {
    
    if (currentLanguage === "english") {
        currentLanguage = "urdu";
    } else {
        currentLanguage = "english";
    }
    
    localStorage.setItem("language", currentLanguage);
    
    renderMedicines();
    changeLanguage();
});

function requestNotificationPermission() {
    
    if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
        return;
    }
    
    if (Notification.permission !== "granted") {
        
        Notification.requestPermission().then(function(permission) {
            
            if (permission === "granted") {
                alert("Notifications enabled successfully! 🔔");
            }
            
        });
        
    }
    
}

function showReminderPopup(medicine) {

    const popup = document.getElementById("reminder-popup");
    if (popup.style.display === "flex") {
    return;
}
    const text = document.getElementById("reminder-text");
    const title = document.querySelector(".reminder-box h2");
    const takenBtn = document.getElementById("reminder-taken-btn");
    const closeBtn = document.getElementById("reminder-close-btn");

try {

    if (Notification.permission === "granted") {

        new Notification("💊 Medicine Reminder", {
            body: `${medicine.medicineName} - Time to take your medicine`
        });

    }

} catch (error) {

    console.log("Notification error:", error);

}

    if (currentLanguage === "english") {

        title.innerHTML = "💊 Time to Take Your Medicine";

        text.innerHTML = `
        It's time to take:
        <br>
        <strong>${medicine.medicineName}</strong>
        <br><br>
        Dosage: ${medicine.dosage}
        <br><br>
        After taking your medicine, click "Mark as Taken".
        <br>
        Stay healthy! 💙
        `;

        takenBtn.innerHTML = "Mark as Taken";
        closeBtn.innerHTML = "Close";


    } else {

        title.innerHTML = "💊 دوا لینے کا وقت ہو گیا";

        text.innerHTML = `
        اب وقت ہے:
        <br>
        <strong>${medicine.medicineName}</strong>
        <br><br>
        خوراک: ${medicine.dosage}
        <br><br>
        دوا لینے کے بعد "دوا لے لیں" کے بٹن پر کلک کریں۔
        <br>
        صحت مند رہیں! 💙
        `;

        takenBtn.innerHTML = "دوا لے لیں";
        closeBtn.innerHTML = "بند کریں";

    }


    popup.style.display = "flex";
popup.classList.add("show");

    reminderSound.currentTime = 0;
    reminderSound.play().catch(function(error) {
    console.log("Sound could not play:", error);
    });


    if ("vibrate" in navigator) {
        navigator.vibrate([500, 200, 500]);
    }


    takenBtn.onclick = function() {

    medicine.taken = true;

    localStorage.setItem(
        "medicines",
        JSON.stringify(medicines)
    );

remindedMedicines = remindedMedicines.filter(function(id) {
    return id !== medicine.id;
});

    popup.style.display = "none";
popup.classList.remove("show");

    renderMedicines();

};

    closeBtn.onclick = function() {

        popup.style.display = "none";
        popup.classList.remove("show");

    };

}

function checkMedicineReminders() {
    
    const now = new Date();
    
    const currentTime =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");
    
    medicines.forEach(function(medicine) {
        
        if (
            medicine.time === currentTime &&
            !medicine.taken &&
            !remindedMedicines.includes(medicine.id)
        ) {
        
            showReminderPopup(medicine);
            
            remindedMedicines.push(medicine.id);
            
        }
        
    });
    
}

requestNotificationPermission();
checkMedicineReminders();

setInterval(checkMedicineReminders, 60000);