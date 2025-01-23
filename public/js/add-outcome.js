document.addEventListener("DOMContentLoaded", async () => {
    const email = localStorage.getItem('signedInEmail');
    if (!email) {
        console.error("Email is not available.");
        return;
    }

    try {
        const response = await fetch(`/api/profile-pic?email=${email}`);
        const data = await response.json();

        if (data.profile_pic) {
            const profilePicElement = document.getElementById('profile-pic');
            profilePicElement.src = `${data.profile_pic}`;
            console.log("URL: " + data.profile_pic);
        } else {
            console.error("Profile picture URL not found.");
        }
    } catch (error) {
        console.error("Error loading profile picture:", error);
    }

    if (!email) {
        console.error("Email is not available.");
        return;
    }

    try {
        const response = await fetch(`/api/username?email=${email}`);
        const data = await response.json();

        if (data.username !== undefined) {
            const usernameElement = document.getElementById('username-name');
            usernameElement.textContent = `${data.username}`;
        } else {
            console.error("Username not found.");
            document.getElementById('username-name').textContent = "Not available";
        }
    } catch (error) {
        console.error("Error fetching username:", error);
        document.getElementById('username-name').textContent = "Error loading data";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const addoutcomeButton = document.getElementById("add-outcome-button");
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("close-popup");
    const addedoutcomeButton = document.getElementById("add");
    const radioContainer = document.querySelector(".radio-container");

    const showPopup = () => {
        document.getElementById('Entrada').checked = true;
        popup.style.visibility = "visible";
        popup.style.opacity = "1";
    };

    const hidePopup = () => {
        popup.style.opacity = "0";
        setTimeout(() => {
            popup.style.visibility = "hidden";
        }, 300);
    };

    addoutcomeButton.addEventListener("click", showPopup);
    closePopupButton.addEventListener("click", hidePopup);
    addedoutcomeButton.addEventListener("click", hidePopup);

    const userEmail = localStorage.getItem("signedInEmail");

    if (!userEmail) {
        alert("User not logged in! Please log in first.");
        return;
    }

    // Fetch areas and dynamically populate radio buttons
    fetch(`/api/areas/${userEmail}`)
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch areas data");
            return response.json();
        })
        .then((areas) => {
            if (!Array.isArray(areas)) {
                throw new Error("Invalid areas data received");
            }

            // Clear existing radio buttons
            radioContainer.innerHTML = "";

            // Create radio buttons for each area
            areas.forEach((area) => {
                const radioItem = document.createElement("div");
                radioItem.className = "radio-item";
                radioItem.style.width = "5.1vw";
                radioItem.style.height = "5vw";

                const input = document.createElement("input");
                input.type = "radio";
                input.id = area.name;
                input.name = "areaGroup";
                input.className = "custom-area";

                const labelIcon = document.createElement("label");
                labelIcon.htmlFor = area.name;
                labelIcon.className = "area-label";
                labelIcon.style.backgroundColor = area.background || "#ccc"; // Fallback color
                labelIcon.style.backgroundImage = `url('${area.icon}')`; // Set icon
                labelIcon.style.backgroundSize = "cover";
                labelIcon.style.borderRadius = "50%";

                const labelText = document.createElement("label");
                labelText.htmlFor = area.name;
                labelText.className = "text-label";
                labelText.textContent = area.name;

                radioItem.appendChild(input);
                radioItem.appendChild(labelIcon);
                radioItem.appendChild(labelText);

                radioContainer.appendChild(radioItem);
            });
        })
        .catch((error) => {
            console.error("Error loading areas:", error.message);
        });

    // Auto-fill outcome date field with the current date and time
    const outcomeDateField = document.getElementById("outcome-date");
    if (outcomeDateField) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const date = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${date}T${hours}:${minutes}`;
        outcomeDateField.value = formattedDate;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const addoutcomeButton = document.getElementById("add-outcome-button");
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("close-popup");
    const addedoutcomeButton = document.getElementById("add");

    const showPopup = () => {
        popup.style.visibility = "visible";
        popup.style.opacity = "1";
    };

    const hidePopup = () => {
        popup.style.opacity = "0";
        setTimeout(() => {
            popup.style.visibility = "hidden";
        }, 300);
    };

    addoutcomeButton.addEventListener("click", showPopup);
    closePopupButton.addEventListener("click", hidePopup);
    addedoutcomeButton.addEventListener("click", hidePopup);

    const userEmail = localStorage.getItem("signedInEmail");

    if (!userEmail) {
        alert("User not logged in! Please log in first.");
        return;
    }

    fetch(`/api/areas/${userEmail}`)
    .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch areas data");
        return response.json();
    })
    .then((areas) => {
        areas.forEach((area) => {
            const radioButton = document.querySelector(`input#${area.name}`);
            const label = document.querySelector(`label[for="${area.name}"]`);

            if (label) {
                let iconUrl;

                // If the icon starts with "http", treat it as a direct URL (GitHub icon)
                iconUrl = area.icon;
                label.style.backgroundImage = `url('${iconUrl}')`; // Set GitHub icon as background

                // Set other label styles for appearance
                label.style.backgroundSize = "cover";
                label.style.backgroundPosition = "center";
                label.style.borderRadius = "50%";
                label.style.backgroundColor = area.background; // Set background color for the area
            }

            if (radioButton) {
                radioButton.style.display = "none";
            }
        });

        // Add the custom area functionality
        const addCustomAreaButton = document.querySelector('input#Añadir');
        addCustomAreaButton.addEventListener("change", () => {
            if (addCustomAreaButton.checked) {
                hidePopup();
                showCustomAreaPopup(userEmail);
            }
        });
    })
    .catch((error) => {
        console.error("Error loading areas:", error.message);
    });

    const outcomeDateField = document.getElementById("outcome-date");
    if (outcomeDateField) {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const date = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${date}T${hours}:${minutes}`;
        outcomeDateField.value = formattedDate;
    }

    // Function to show the custom area popup and handle form submission
    function showCustomAreaPopup(userEmail) {
        const customAreaPopup = document.getElementById("custom-area-popup");
        const closeCustomAreaPopupButton = document.getElementById("close-custom-area-popup");
        const addCustomAreaButton = document.getElementById("add-custom-area-popup");
        const customAreaForm = document.getElementById("custom-area-form");

        const showPopup = () => {
            customAreaPopup.style.visibility = "visible";
            customAreaPopup.style.opacity = "1";
        };

        const hidePopup = () => {
            customAreaPopup.style.opacity = "0";
            setTimeout(() => {
                customAreaPopup.style.visibility = "hidden";
            }, 300);
        };

        closeCustomAreaPopupButton.addEventListener("click", hidePopup);

        addCustomAreaButton.addEventListener("click", (event) => {
            event.preventDefault();
        
            const customAreaNameInput = document.getElementById("custom-area-name");
            const customAreaBackgroundInput = document.getElementById("custom-area-background");
        
            const customAreaName = customAreaNameInput.value.trim();
            const customAreaBackground = customAreaBackgroundInput.value;
        
            // Debugging logs
            console.log("Custom Area Name:", customAreaName);
            console.log("Custom Area Background:", customAreaBackground);
            console.log("Selected Icon:", selectedIcon);
        
            if (!customAreaName || !customAreaBackground || !selectedIcon) {
                alert("Please fill out all fields and select an icon before adding the custom area.");
                return;
            }
        
            const payload = {
                name: customAreaName,
                background: customAreaBackground,
                icon: selectedIcon,
            };
        
            // Debugging logs
            console.log("Payload to be sent:", payload);
        
            fetch("/api/user/areas/add/" + userEmail, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Custom area added:", data);
        
                    if (data.message === "All fields are required") {
                        alert("Server received an incomplete payload. Please try again.");
                    } else {
                        hidePopup();
                        // Optionally refresh the areas list
                    }
                })
                .catch((error) => {
                    console.error("Error adding custom area:", error);
                });
        });

        showPopup();
    }
});


document.getElementById("add").addEventListener("click", () => {
    const selectedAccount = document.getElementById("outcome-account").value;
    const enteredAmount = parseFloat(document.getElementById("outcome-amount").value);
    const enteredDate = document.getElementById("outcome-date").value;
    const selectedRadio = document.querySelector('input[name="areaGroup"]:checked');

    let selectedArea;
    if (selectedRadio) {
        selectedArea = selectedRadio.id;
    } else {
        alert("Please select an area!");
        return;
    }

    if (!enteredAmount || isNaN(enteredAmount)) {
        alert("Please enter a valid amount!");
        return;
    }

    if (!enteredDate) {
        alert("Please select a date!");
        return;
    }

    const userEmail = localStorage.getItem("signedInEmail");

    if (!userEmail) {
        alert("User not logged in! Please log in first.");
        return;
    }

    const newMovement = {
        type: "outcome",
        account: selectedAccount,
        amount: enteredAmount,
        area: selectedArea,
        date: enteredDate,
        email: userEmail,
    };

    fetch("/api/add-movement-outcome", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovement),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("outcome updated:", data);

            // Now update the total_money for the user
            fetch(`/api/update-total-money/${userEmail}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount: enteredAmount,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Total money updated:", data);
                })
                .catch((error) => {
                    console.error("Error updating total money:", error);
                });
            location.reload();
        })
        .catch((error) => {
            console.error("Error updating outcome:", error);
            alert("Failed to update outcome.");
        });
});

document.addEventListener('DOMContentLoaded', () => {
    const movementsList = document.getElementById('movements-list');

    async function fetchMovements(email) {
        try {
            const response = await fetch(`/api/movements/${email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movements');
            }
            const data = await response.json();
            return data.movements;
        } catch (error) {
            console.error('Error fetching movements:', error);
            return [];
        }
    }

    function filterOutcomeMovementsForCurrentMonth(movements) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return movements.filter(movement => {
            const movementDate = new Date(movement.date);
            return (
                movement.type === 'outcome' &&
                movementDate.getMonth() === currentMonth &&
                movementDate.getFullYear() === currentYear
            );
        });
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('T')[0].split('-');
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(new Date(year, month - 1, day));

        const dateParts = formattedDate.split(', ');
        const weekday = dateParts[0].charAt(0).toUpperCase() + dateParts[0].slice(1);
        return `${weekday}, ${dateParts[1]}`;
    }

    function groupOutcomeMovementsByDate(movements) {
        const groupedMovements = {};

        movements.forEach((movement) => {
            const date = movement.date.split('T')[0];

            if (!groupedMovements[date]) {
                groupedMovements[date] = {
                    movements: [],
                    totalOutcome: 0
                };
            }

            groupedMovements[date].movements.push(movement);
            groupedMovements[date].totalOutcome += movement.amount;
        });

        return groupedMovements;
    }

    function renderGroupedOutcomeMovements(groupedMovements) {
        const sortedDates = Object.keys(groupedMovements).sort((a, b) => new Date(b) - new Date(a));

        sortedDates.forEach((date) => {
            const formattedDate = formatDate(date);

            let dateDiv = document.querySelector(`#date-${date}`);
            if (!dateDiv) {
                dateDiv = document.createElement('div');
                dateDiv.id = `date-${date}`;
                dateDiv.classList.add('date-item');
                movementsList.appendChild(dateDiv);
            }

            const table = document.createElement('div');
            table.classList.add('movement-table');

            const dateRow = document.createElement('div');
            dateRow.classList.add('movement-row');

            const dateCell = document.createElement('div');
            dateCell.classList.add('movement-cell');
            dateCell.textContent = formattedDate;

            const totalOutcomeCell = document.createElement('div');
            totalOutcomeCell.classList.add('movement-cell');
            const totalOutcome = groupedMovements[date].totalOutcome;
            const formattedTotalOutcome = `-$${totalOutcome}`;
            totalOutcomeCell.textContent = formattedTotalOutcome;
            totalOutcomeCell.style.color = '#999693';

            dateRow.appendChild(dateCell);
            dateRow.appendChild(totalOutcomeCell);
            table.appendChild(dateRow);

            groupedMovements[date].movements.forEach((movement) => {
                const row = document.createElement('div');
                row.classList.add('movement-row');

                const areaCell = document.createElement('div');
                areaCell.classList.add('movement-cell');
                areaCell.textContent = movement.area;

                const amountCell = document.createElement('div');
                amountCell.classList.add('movement-cell');
                amountCell.textContent = `$${movement.amount}`;
                amountCell.style.color = '#999693';

                row.appendChild(areaCell);
                row.appendChild(amountCell);
                table.appendChild(row);
            });

            let movementInfoDiv = dateDiv.querySelector('.movement-info');
            if (!movementInfoDiv) {
                movementInfoDiv = document.createElement('div');
                movementInfoDiv.classList.add('movement-info');
                dateDiv.appendChild(movementInfoDiv);
            }

            movementInfoDiv.appendChild(table);
        });
    }

    const email = localStorage.getItem('signedInEmail');
    if (email) {
        fetchMovements(email)
            .then(filterOutcomeMovementsForCurrentMonth)
            .then(groupOutcomeMovementsByDate)
            .then(renderGroupedOutcomeMovements);
    } else {
        console.error("No user is signed in");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    document.getElementById("monthly-outcome").textContent = `Egresos de ${monthNames[currentMonth]}`;

    async function fetchMovements(email) {
        try {
            const response = await fetch(`/api/movements/${email}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();

            const currentMonthoutcomes = data.movements.filter(movement => {
                const movementDate = new Date(movement.date);
                return (
                    movementDate.getMonth() === currentMonth &&
                    movementDate.getFullYear() === currentYear &&
                    movement.type === "outcome"
                );
            });

            const totaloutcome = currentMonthoutcomes.reduce((sum, movement) => sum + movement.amount, 0);

            document.getElementById("quantity").textContent = `$${totaloutcome.toLocaleString()}`;
        } catch (error) {
            console.error("Error fetching movements:", error);
            document.getElementById("quantity").textContent = "Error fetching data.";
        }
    }

    const email = localStorage.getItem('signedInEmail');
    fetchMovements(email);
});

const iconGrid = document.getElementById("icon-grid");
let selectedIcon = null; // Track the selected icon
const iconRepoBaseURL = "https://raw.githubusercontent.com/FPSamu/IMAGES/refs/heads/main/";

// List of icon file names to fetch (update this array based on available icons in the repo)
const icons = [
    "accessibility_new_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "account_circle_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "add_circle_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "apartment_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "bed_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "book_2_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "calendar_month_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "calendar_today_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "call_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "cardio_load_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "car_rental_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "celebration_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "check_circle_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "close_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "credit_card_heart_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "delete_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "description_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "directions_car_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "edit_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "error_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "favorite_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "fitness_center_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "flight_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "flight_takeoff_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "groups_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "group_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "health_and_safety_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "home_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "hotel_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "info_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "joystick_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "key_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "local_cafe_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "local_dining_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "local_laundry_service_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "location_on_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "lock_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "lock_open_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "luggage_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "mail_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "mark_email_unread_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "medical_services_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "menu_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "menu_book_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "navigation_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "person_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "phone_android_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "photo_camera_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "pin_drop_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "public_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "rice_bowl_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "room_service_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "school_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "search_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "self_improvement_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "sentiment_satisfied_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "sentiment_very_satisfied_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "shopping_bag_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "shopping_cart_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "sports_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "stars_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "star_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "storefront_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "today_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "train_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "travel_explore_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "videocam_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "visibility_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "warning_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "wc_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "wifi_password_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp",
    "work_24dp_FFFFFF_FILL0_wght400_GRAD0_opsz24.webp"
];
// Populate the icon grid with images
icons.forEach(icon => {
    const iconElement = document.createElement("img");
    iconElement.src = `${iconRepoBaseURL}${icon}`;
    iconElement.alt = icon;
    iconElement.className = "icon-image";
    iconElement.dataset.iconUrl = `${iconRepoBaseURL}${icon}`;

    // Add click event to select the icon
    iconElement.addEventListener("click", () => {
        // Remove selection from previously selected icon
        document.querySelectorAll(".icon-grid img").forEach(el => el.classList.remove("selected"));
        // Mark the clicked icon as selected
        iconElement.classList.add("selected");
        // Update the selected icon URL
        selectedIcon = iconElement.dataset.iconUrl;
    });

    iconGrid.appendChild(iconElement);
});

// Handle form submission
document.getElementById("add-custom-area-popup").addEventListener("click", (e) => {
    e.preventDefault();

    const selectedIconElement = document.querySelector(".icon-grid img.selected");
    if (!selectedIconElement) {
        alert("Por favor selecciona un icono.");
        return;
    }

    const areaName = document.getElementById("custom-area-name").value;
    const backgroundColor = document.getElementById("custom-area-background").value;
    const iconUrl = selectedIconElement.dataset.iconUrl;

    console.log({ areaName, backgroundColor, iconUrl });

    // Submit the data to your server or handle it as needed
});