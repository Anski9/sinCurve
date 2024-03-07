document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("functionForm").addEventListener("submit", function(event) {
        event.preventDefault();
        inputs();
    });
});

//Haetaan ja tallennetaan käyttäjän syötteet muuttujiin
function inputs() {
    const functionInput = document.getElementById("functionInput").value;
    const startX = parseFloat(document.getElementById("startX").value);
    const endX = parseFloat(document.getElementById("endX").value);
    const xStep = parseFloat(document.getElementById("xStep").value);
    const yFactor = parseFloat(document.getElementById("yFactor").value);

    //Tarkistetaan, että xstep on positiivinen
    if (xStep <= 0) {
        alert("x step must be a positive number");
        return;
    }
    //Tarkistetaan ettei aloituspiste ole suurempi kuin lopetuspiste
    if (startX > endX) {
        alert("Start of x range must be smaller than end of x range");
        return;
    }
    
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
        //Näytetään lasketut arvot sivulla
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

//Kuvaajan päivittäminen
function updateChart(data, functionLabel) {
    const chartContext = document.getElementById("sinChart").getContext("2d");
    if (window.myChart) {
        window.myChart.data.labels = data.map(d => d.x);
        window.myChart.data.datasets[0].data = data;
        window.myChart.data.datasets[0].label = `f(x) =${functionLabel}`;
        window.myChart.update();
    } else {   //Luodaan uusi kuvaaja mikäli sitä ei vielä ole
        window.myChart = new Chart(chartContext, {
            type: "line",
            data: {
                labels: data.map(d => d.x),
                datasets: [{
                    label: `f(x) = ${functionLabel}`,
                    data: data,
                    borderColor: "magenta",
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            stepSize: 0.1 //Asetetaan x-akselin arvot 0.1 välein
                        }
                    },
                    y: {
                        ticks: {
                            stepSize: 0.1 //Asetetaan y-akselin arvot 0.1 välein
                        }
                    }
                }
            }
        });
    }
}