document.addEventListener('DOMContentLoaded', async function () {
    const canvas = document.getElementById('creditChart');
    const ctx = canvas.getContext('2d');

    const size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;

    async function fetchCreditData() {
        const email = localStorage.getItem('signedInEmail');
        if (!email) {
            console.error("Email is not available.");
            return { percentage: 0, money: 0, creditUsed: 0 };
        }

        try {
            const percentageResponse = await fetch(`/api/credit-percentage?email=${email}`);
            const percentageData = await percentageResponse.json();
            const creditUsedResponse = await fetch(`/api/credit-used?email=${email}`);
            const creditUsedData = await creditUsedResponse.json();

            return {
                percentage: parseFloat(percentageData.percentage) || 0,
                money: parseFloat(percentageData.money) || 0, 
                creditUsed: parseFloat(creditUsedData.credit_used) || 0
            };
        } catch (error) {
            console.error("Error fetching data:", error);
            return { percentage: 0, money: 0, creditUsed: 0 };
        }
    }

    const { percentage, money, creditUsed } = await fetchCreditData();
    const remaining = 100 - percentage;

    const data = [percentage, remaining]; 
    const colors = ['#d15441', '#bb918b']; 
    const sliceSpeeds = [0.08, 0.08];
    const currentAngle = [-0.5 * Math.PI, -0.5 * Math.PI];
    const total = data.reduce((sum, value) => sum + value, 0);

    function drawPieChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        let startAngle = -0.5 * Math.PI;
        const radius = canvas.width / 1.9 - 10; 
        const innerRadius = radius / 1.5; 
    
        let sliceAnimationComplete = true;
    
        data.forEach((slice, index) => {
            const sliceAngle = (slice / total) * 2 * Math.PI;
    
            if (currentAngle[index] < startAngle + sliceAngle) {
                sliceAnimationComplete = false;
                currentAngle[index] += sliceSpeeds[index];
                if (currentAngle[index] > startAngle + sliceAngle) {
                    currentAngle[index] = startAngle + sliceAngle;
                }
            }
    
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, radius, startAngle, currentAngle[index]);
            ctx.closePath();
            ctx.fill();
    
            startAngle = currentAngle[index];
        });
    
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, innerRadius, 0, 2 * Math.PI); 
        ctx.fillStyle = '#141414'; 
        ctx.fill();
        ctx.closePath();

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.fillStyle = '#ffffff'; 

        ctx.font = `${innerRadius / 2}px Aileron`; 
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle'; 
        ctx.fillText(`${percentage.toFixed(0)}%`, centerX, centerY - 10); 

        ctx.font = `${innerRadius / 4}px Aileron`; 
        ctx.fillText(`$${creditUsed}`, centerX, centerY + 100); 

        if (!sliceAnimationComplete) {
            requestAnimationFrame(drawPieChart);
        }
    }

    drawPieChart();
});
