document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("functionForm").addEventListener("submit", function(event) {
        event.preventDefault();
        inputs();
    });
});

//Luetaan syötteet
function inputs() {
    const functionInput = document.getElementById("functionInput").value;
    const startX = parseFloat(document.getElementById("startX").value);
    const endX = parseFloat(document.getElementById("endX").value);
    const xStep = parseFloat(document.getElementById("xStep").value);
    const yFactor = parseFloat(document.getElementById("yFactor").value);
    
    //Lasketaan tulokset
    try {
        const calculatedFunction = new Function("x",`with(Math) {return ${functionInput};}`);
    
        let data = [];
        for (let x = startX; x <= endX; x += xStep) {
            let y = calculatedFunction(x) * yFactor;
            if (!isNaN(y)) {
                data.push({x: x, y: y});
            }
        }
        const resultsElement = document.getElementById("results");
        let funktionResults = "";
        data.forEach(point => {
            funktionResults += `f(${point.x}) = ${point.y}<br>`;
        });
    
        resultsElement.innerHTML = funktionResults;
        updateChart(data, functionInput);
    } catch (error) {
        alert("SyntaxError: Unexpected end of imput");
    }
}

function updateChart(data, functionLabel) {
    const chartContext = document.getElementById("sinChart").getContext("2d");
    if (window.myChart) {
        window.myChart.data.labels = data.map(d => d.x);
        window.myChart.data.datasets[0].data = data;
        window.myChart.data.datasets[0].label = `f(x) =${functionLabel}`;
        window.myChart.update();
    } else {
        window.myChart = new Chart(chartContext, {
            type: "line",
            data: {
                labels: data.map(d => d.x),
                datasets: [{
                    label: `f(x) = ${functionLabel}`,
                    data: data,
                    borderColor: "magenta",
                    fill: false
                }]
            },
            options: {
                responsive: true
            }
        });
    }
}