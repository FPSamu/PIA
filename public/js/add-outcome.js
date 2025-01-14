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
                    label.style.backgroundImage = `url('${area.icon}')`;
                    label.style.backgroundSize = "cover";
                    label.style.borderRadius = "50%";

                    label.style.backgroundColor = area.background;
                }

                if (radioButton) {
                    radioButton.style.display = "none";
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

    document.getElementById("monthly-income").textContent = `Egresos de ${monthNames[currentMonth]}`;

    async function fetchMovements(email) {
        try {
            const response = await fetch(`/api/movements/${email}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();

            const currentMonthIncomes = data.movements.filter(movement => {
                const movementDate = new Date(movement.date);
                return (
                    movementDate.getMonth() === currentMonth &&
                    movementDate.getFullYear() === currentYear &&
                    movement.type === "outcome"
                );
            });

            const totalIncome = currentMonthIncomes.reduce((sum, movement) => sum + movement.amount, 0);

            document.getElementById("quantity").textContent = `$${totalIncome.toLocaleString()}`;
        } catch (error) {
            console.error("Error fetching movements:", error);
            document.getElementById("quantity").textContent = "Error fetching data.";
        }
    }

    const email = localStorage.getItem('signedInEmail');
    fetchMovements(email);
});