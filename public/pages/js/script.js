document.addEventListener("DOMContentLoaded", async () => {
    const email = localStorage.getItem('signedInEmail');
    if (!email) {
        console.error("Email is not available.");
        return;
    }

    // FETCH THE TOTAL MONEY
    try {
        const response = await fetch(`/api/total-money?email=${email}`);
        const data = await response.json();

        if (data.total_money !== undefined) {
            const total_money = document.getElementById('available-quantity');
            total_money.textContent = `$${data.total_money}`;
        } else {
            console.error("Total money not found.");
        }
    } catch (error) {
        console.error("Error loading total money:", error);
    }

    // FETCH THE PROFILE PIC
    try {
        const response = await fetch(`/api/profile-pic?email=${email}`);
        const data = await response.json();

        if (data.profile_pic) {
            const profilePicElement = document.getElementById('profile-pic');
            profilePicElement.src = `${data.profile_pic}`;
        } else {
            console.error("Profile picture URL not found.");
        }
    } catch (error) {
        console.error("Error loading profile picture:", error);
    }

    // FETCH THE USERNAME
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

    // FETCH THE CREDIT LIMIT
    try {
        const response = await fetch(`/api/credit-limit?email=${email}`);
        const data = await response.json();

        if (data.credit_limit !== undefined) {
            const motivationPanel = document.querySelector('#credit-panel-info .motivation-panel');
            motivationPanel.textContent = `Tu limite de credito es de $${data.credit_limit}`;
        } else {
            console.error("Credit limit not found.");
            const motivationPanel = document.querySelector('#credit-panel-info .motivation-panel');
            motivationPanel.textContent = "Credit limit not available";
        }
    } catch (error) {
        console.error("Error fetching credit limit:", error);
        const motivationPanel = document.querySelector('#credit-panel-info .motivation-panel');
        motivationPanel.textContent = "Error loading credit limit";
    }

    // FETCH THE SAVINGS GOAL
    try {
        const response = await fetch(`/api/savings-goal?email=${email}`);
        const data = await response.json();

        if (data.savings_goal !== undefined) {
            const motivationPanel = document.querySelector('#savings-panel-info .motivation-panel');
            motivationPanel.textContent = `Sigue ahorrando para alcanzar tu meta de $${data.savings_goal}`;
        } else {
            console.error("Savings goal not found.");
            const motivationPanel = document.querySelector('#savings-panel-info .motivation-panel');
            motivationPanel.textContent = "Savings goal not available";
        }
    } catch (error) {
        console.error("Error fetching savings goal:", error);
        const motivationPanel = document.querySelector('#savings-panel-info .motivation-panel');
        motivationPanel.textContent = "Error loading savings goal";
    }

    try {
        const response = await fetch(`/api/get-user-limits?email=${encodeURIComponent(email)}`);
        if (response.ok) {
            const { credit_limit, total_money, savings_goal } = await response.json();

            if (credit_limit === 0 || savings_goal === 0) {
                document.getElementById("credit-limit").value = credit_limit || 0;
                document.getElementById("cash").value = total_money || 0;
                document.getElementById("savings-goal").value = savings_goal || 0;

                // Show the popup
                document.getElementById("popup").style.display = "block";
            }

        }
    } catch (error) {
        console.error("Error fetching user limits:", error);
    }
});

document.getElementById("movements-section-button-right").addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementById("main-panel").style.display = "none";
    document.getElementById("movements-panel").style.display = "block";
});

document.getElementById("movements-section-button-left").addEventListener("click", function (e) {
    e.preventDefault();
    location.reload();
});

document.getElementById("scroll-right-arrow").addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementById("main-panel").style.transform = "translateX(-100vw)";
    document.getElementById("movements-panel").style.transform = "translateX(-100vw)";
});

document.querySelector("#scroll-left-arrow").addEventListener("click", (e) => {
    e.preventDefault();

    const movementsPanel = document.querySelector("#movements-panel");
    const mainPanel = document.querySelector("#main-panel");

    movementsPanel.style.transition = "transform 0.5s ease";
    movementsPanel.style.transform = "translateX(100%)";

    mainPanel.style.transition = "transform 0.5s ease";
    mainPanel.style.transform = "translateX(0)";
});

document.getElementById("settings-section").addEventListener("click", async () => {
    const email = localStorage.getItem('signedInEmail');

    if (!email) {
        console.error("No email found in localStorage.");
        return;
    }

    try {
        const response = await fetch(`/api/get-user-limits?email=${encodeURIComponent(email)}`);
        if (response.ok) {
            const { credit_limit, total_money, savings_goal } = await response.json();

            document.getElementById("credit-limit").value = credit_limit || 0;
            document.getElementById("cash").value = total_money || 0;
            document.getElementById("savings-goal").value = savings_goal || 0;

            document.getElementById("overlay").style.display = "block";
            document.getElementById("popup").style.display = "block";
        }
    } catch (error) {
        console.error("Error fetching user limits:", error);
    }
});

document.getElementById("close-popup").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
});

document.getElementById("register").addEventListener("click", async () => {
    const creditLimit = document.getElementById("credit-limit").value;
    const savingsGoal = document.getElementById("savings-goal").value;
    const cash = document.getElementById("cash").value;

    const email = localStorage.getItem('signedInEmail');

    if (!email || !creditLimit || !savingsGoal) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch("/api/register-limits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                creditLimit: parseFloat(creditLimit),
                savingsGoal: parseFloat(savingsGoal),
                cash: parseFloat(cash)
            }),
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById("overlay").style.display = "none";
            document.getElementById("popup").style.display = "none";
            location.reload();
        } else {
            const errorText = await response.text();
            console.error("Error: " + errorText);
            alert("Error: " + errorText);
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Ocurrió un error. Intenta nuevamente.");
    }
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

    function filterCurrentMonthMovements(movements) {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        return movements.filter(movement => {
            const movementDate = new Date(movement.date);
            return (
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

    function groupMovementsByDate(movements) {
        const groupedMovements = {};

        movements.forEach((movement) => {
            const date = movement.date.split('T')[0];

            if (!groupedMovements[date]) {
                groupedMovements[date] = {
                    movements: [],
                    totalAmount: 0
                };
            }

            groupedMovements[date].movements.push(movement);

            if (movement.type === 'income') {
                groupedMovements[date].totalAmount += movement.amount;
            } else if (movement.type === 'outcome') {
                groupedMovements[date].totalAmount -= movement.amount;
            }
        });

        return groupedMovements;
    }

    function renderGroupedMovements(groupedMovements) {
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

            const totalAmountCell = document.createElement('div');
            totalAmountCell.classList.add('movement-cell');
            const totalAmount = groupedMovements[date].totalAmount;
            const formattedTotalAmount = (totalAmount >= 0 ? '+' : '') + `$${Math.abs(totalAmount)}`;
            totalAmountCell.textContent = formattedTotalAmount;
            totalAmountCell.style.color = '#999693';

            dateRow.appendChild(dateCell);
            dateRow.appendChild(totalAmountCell);
            table.appendChild(dateRow);

            groupedMovements[date].movements.forEach((movement) => {
                const sign = movement.type === 'income' ? '+' : '';
                const movementAmount = Math.abs(movement.amount);

                const row = document.createElement('div');
                row.classList.add('movement-row');

                const areaCell = document.createElement('div');
                areaCell.classList.add('movement-cell');
                areaCell.textContent = movement.area;

                const amountCell = document.createElement('div');
                amountCell.classList.add('movement-cell');
                amountCell.textContent = `${sign}$${movementAmount}`;

                amountCell.style.color = movement.type === 'income' ? '#c4ffa7' : '#999693';
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
            .then(filterCurrentMonthMovements)
            .then(groupMovementsByDate)
            .then(renderGroupedMovements);
    } else {
        console.error("No user is signed in");
    }
});

document.addEventListener('DOMContentLoaded', async function () {
    const canvas = document.getElementById('movements-graph-canvas');
    const ctx = canvas.getContext('2d');
    const infoContainer = document.getElementById('movements-graph-info');

    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;

    async function fetchMovementsAndAreas() {
        const email = localStorage.getItem('signedInEmail');
        if (!email) {
            console.error("Email is not available.");
            return { movements: [], areas: [] };
        }

        try {
            const movementsResponse = await fetch(`/api/movements/${email}`);
            const movementsData = await movementsResponse.json();

            const areasResponse = await fetch(`/api/areas/${email}`);
            const areasData = await areasResponse.json();

            return {
                movements: movementsData.movements || [],
                areas: areasData || [],
            };
        } catch (error) {
            console.error("Error fetching movements and areas:", error);
            return { movements: [], areas: [] };
        }
    }

    function getAreaColor(areaName, areas) {
        const area = areas.find(a => a.name === areaName);
        return area ? area.background : '#000000';
    }

    async function processMovementsData() {
        const { movements, areas } = await fetchMovementsAndAreas();
        const outcomeData = {};

        movements.forEach(movement => {
            if (movement.type === "outcome") {
                const area = movement.area;
                const amount = movement.amount;

                if (!outcomeData[area]) {
                    outcomeData[area] = 0;
                }
                outcomeData[area] += amount;
            }
        });

        return { outcomeData, areas };
    }

    async function drawPieChart() {
        const { outcomeData, areas } = await processMovementsData();

        const areasList = Object.keys(outcomeData);
        const data = areasList.map(area => outcomeData[area]);
        const total = data.reduce((sum, value) => sum + value, 0);
        const colors = areasList.map(area => getAreaColor(area, areas));

        const radius = canvas.width / 2 - 10;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        let startAngle = -0.5 * Math.PI;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        data.forEach((value, index) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = startAngle + sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = colors[index];
            ctx.fill();

            startAngle = endAngle;
        });

        const innerRadius = radius / 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#141414';
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = `${innerRadius / 3}px Aileron`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`$${total.toFixed(2)}`, centerX, centerY);

        updateInfoSection(areasList, colors);
    }

    function updateInfoSection(areasList, colors) {
        infoContainer.innerHTML = '';

        areasList.forEach((area, index) => {
            const color = colors[index];

            const labelDiv = document.createElement('div');
            labelDiv.style.display = 'flex';
            labelDiv.style.alignItems = 'center';
            labelDiv.style.marginBottom = '8px';

            const colorCircle = document.createElement('div');
            colorCircle.style.width = '12px';
            colorCircle.style.height = '12px';
            colorCircle.style.borderRadius = '50%';
            colorCircle.style.backgroundColor = color;
            colorCircle.style.marginRight = '8px';

            const areaText = document.createTextNode(area);

            labelDiv.appendChild(colorCircle);
            labelDiv.appendChild(areaText);

            infoContainer.appendChild(labelDiv);
        });
    }

    drawPieChart();
});
