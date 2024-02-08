// format
// variables  -> event handelers -> important functions -> helper functions -> function calls

//variables
let time = "";
let timesec = 0.0;

//Define vars to hold time values
let msec = 0;
let seconds = 0;
let minutes = 0;

//Define vars to hold "display" value
let displayMsec = 0;
let displaySeconds = 0;
let displayMinutes = 0;

//Define var to hold setInterval() function
let interval = null;

//Define var to hold stopwatch status
let stsp = 0;

//variable for displaying time
let show = true;

// moves for scramble
let moves = ["R", "U", "F", "L", "D", "B"]
let variations = ["", "'", "2"]

const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Get the chart canvas
const timeChartCanvas = document.getElementById('timeChart');

// Global variable to keep track of the Chart instance
let timeChartInstance = null;
let isModalOpen = false;

const checkbox = document.getElementById("switch");

// event handelers
// spacebar
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 32 && !isModalOpen ) {
        document.getElementById("particles").style.backgroundColor = 'rgb(30, 30, 30)';
        startStop();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 32 && !isModalOpen) {
        document.getElementById("particles").style.backgroundColor = 'black';
    }
});

// backspace
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 8 && !isModalOpen) {
        document.getElementById("particles").style.backgroundColor = 'rgb(30, 30, 30)';
        const response = confirm("Are you sure you want to delete last solve?");
        if (response) deleteslv();
    }
});
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 8 && !isModalOpen) {
        document.getElementById("particles").style.backgroundColor = 'rgb(50, 30, 30)';
    }
});

// delete
document.addEventListener("keyup", function (event) {
    if (event.keyCode == 46 && !isModalOpen) {
        document.getElementById("particles").style.backgroundColor = 'rgb(30, 30, 30)';
        const response = confirm("Are you sure you want to clear history?");
        if (response) {
            localStorage.clear();
            loadsetup();
        }
    }
});
document.addEventListener("keydown", function (event) {
    if (event.keyCode == 46 && !isModalOpen) {
        document.getElementById("particles").style.backgroundColor = 'rgb(50, 30, 50)';
    }
});

// Event listener to close the modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    isModalOpen = false;
});

// Close the modal if the user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        isModalOpen = false;
    }
});

checkbox.addEventListener("change", toggleVariable);

// important functions
//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch() {
    msec++;
    //Logic to determine when to increment next value
    if (msec / 100 === 1) {
        msec = 0;
        seconds++;

        if (seconds / 60 === 1) {
            seconds = 0;
            minutes++;
        }

    }

    //If seconds/minutes/hours are only one digit, add a leading 0 to the value
    if (msec < 10) {
        displayMsec = "0" + msec.toString();
    } else {
        displayMsec = msec;
    }

    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    } else {
        displaySeconds = seconds;
    }
    if (minutes < 10) {
        displayMinutes = "0" + minutes.toString();
    } else {
        displayMinutes = minutes;
    }


    //Display updated time values to user
    document.getElementById("display").innerHTML = displaySeconds + ":" + displayMsec;

}

//start and stop of time handeler
function startStop() {

    if (stsp === 0) {

        //Start the stopwatch (by calling the setInterval() function)

        interval = window.setInterval(stopWatch, 10);
        if (!show) {
            document.getElementById("time").style.display = 'none';
        }
        stsp = 1;

    } else {
        timesec = seconds + minutes * 60 + msec / 100;
        window.clearInterval(interval);
        msec = 0;
        seconds = 0;
        minutes = 0;
        document.getElementById("time").style.display = 'block';
        stsp = 0;
        savescr();
        genscramble();
    }

}

//save time after solve
function savescr() {
    // Retrieve slvlistsec from localStorage (if available)
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let btsec = JSON.parse(localStorage.getItem('btsec')) || Number.MAX_VALUE; // Initialize to a large value
    let time = timesec.toFixed(2);
    slvlistsec.push(time);

    // Calculate bestsec
    for (let i = 0; i < slvlistsec.length; i++) {
        if (btsec > slvlistsec[i]) {
            btsec = slvlistsec[i];
        }
    }
    localStorage.setItem('btsec', JSON.stringify(btsec));

    // Update the HTML
    document.getElementById("slv1").innerHTML = "Current solve : " + time;
    document.getElementById("btslv1").innerHTML = "today's best solve : " + btsec;

    // Update localStorage with the modified slvlistsec
    localStorage.setItem('slvlistsec', JSON.stringify(slvlistsec));

    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    let btavg5 = JSON.parse(localStorage.getItem('btavg5')) || Number.MAX_VALUE; // Initialize to a large value
    let avg5 = calculateAvg5();
    if (avg5 != "N/A") {
        avg5list.push(avg5);
        for (let i = 0; i < avg5list.length; i++) {
            if (btavg5 > avg5list[i]) {
                btavg5 = avg5list[i];
            }
        }
        localStorage.setItem('btavg5', JSON.stringify(btavg5));
        document.getElementById("avg5").innerHTML = "Current avg5 :" + avg5;
        document.getElementById("btavg5").innerHTML = "today's best avg5 :" + btavg5;
        localStorage.setItem('avg5list', JSON.stringify(avg5list));
    }

    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];
    let btavg12 = JSON.parse(localStorage.getItem('btavg12')) || Number.MAX_VALUE; // Initialize to a large value
    let avg12 = calculateAvg12();
    if (avg12 != "N/A") {
        avg12list.push(avg12);
        for (let i = 0; i < avg12list.length; i++) {
            if (btavg12 > avg12list[i]) {
                btavg12 = avg12list[i];
            }
        }
        localStorage.setItem('btavg12', JSON.stringify(btavg12));
        document.getElementById("avg12").innerHTML = "Current avg12 :" + avg12;
        document.getElementById("btavg12").innerHTML = "today's best avg12 :" + btavg12;
        localStorage.setItem('avg12list', JSON.stringify(avg12list));
    }

    let numslv = JSON.parse(localStorage.getItem('nslv')) || 0;
    numslv++;
    let tavg = calculateAvg();
    document.getElementById("tavg").innerHTML = "total avg :" + tavg;
    localStorage.setItem('nslv', JSON.stringify(numslv));
    document.getElementById("nslv").innerHTML = "total solves :" + numslv;
}

//reprocess the dtat
function loadsetup() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let slv;
    if (slvlistsec.length === 0) slv = 0;
    else slv = slvlistsec[slvlistsec.length - 1];
    document.getElementById("slv1").innerHTML = "Current solve : " + slv;

    for (let i = slvlistsec.length - 1; i >= 0; i--) {
        if (slv > slvlistsec[i]) slv = slvlistsec[i];
    }

    document.getElementById("btslv1").innerHTML = "today's best solve : " + slv;
    localStorage.setItem('btsec', JSON.stringify(slv));


    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    if (avg5list.length === 0) slv = 0
    else slv = avg5list[avg5list.length - 1];
    document.getElementById("avg5").innerHTML = "Current avg5 :" + slv;
    for (let i = avg5list.length - 1; i >= 0; i--) {
        if (slv > avg5list[i]) slv = avg5list[i];
    }
    document.getElementById("btavg5").innerHTML = "today's best avg5 :" + slv;
    localStorage.setItem('btavg5', JSON.stringify(slv));


    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];
    if (avg12list.length === 0) slv = 0
    else slv = avg12list[avg12list.length - 1];
    document.getElementById("avg12").innerHTML = "Current avg12 :" + slv;
    for (let i = avg12list.length - 1; i >= 0; i--) {
        if (slv > avg12list[i]) slv = avg12list[i];
    }
    document.getElementById("btavg12").innerHTML = "today's best avg12 :" + slv;
    localStorage.setItem('btavg12', JSON.stringify(slv));

    let numslv = JSON.parse(localStorage.getItem('nslv')) || 0;
    let tavg = calculateAvg();
    document.getElementById("tavg").innerHTML = "total avg :" + tavg;
    document.getElementById("nslv").innerHTML = "total solves :" + numslv;
    document.getElementById("display").innerHTML = "00:00";
}

//delete last solve
function deleteslv() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];
    let numslv = JSON.parse(localStorage.getItem('nslv')) || 0;
    if (slvlistsec.length > 0) {
        slvlistsec.pop();
        if (avg5list.length > 0) avg5list.pop();
        if (avg12list.length > 0) avg12list.pop();
        localStorage.setItem('slvlistsec', JSON.stringify(slvlistsec));
        localStorage.setItem('avg5list', JSON.stringify(avg5list));
        localStorage.setItem('avg12list', JSON.stringify(avg12list));
        localStorage.setItem('nslv', JSON.stringify(--numslv));
        loadsetup();
    }
}

//show stats 
function showstats() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    let avg5list = JSON.parse(localStorage.getItem('avg5list')) || [];
    let avg12list = JSON.parse(localStorage.getItem('avg12list')) || [];

    createOrUpdateChart(slvlistsec, avg5list, avg12list);
    modal.style.display = 'block';
    isModalOpen = true;
}

// Function to create or update the chart with multiple datasets
function createOrUpdateChart(slvlistsec, avg5list, avg12list) {
    if (timeChartInstance) {
        // Destroy the existing chart if it exists
        timeChartInstance.destroy();
    }

    // Create arrays for avg5 and avg12 with null values for the initial solves
    const avg5Data = Array.from({ length: slvlistsec.length }, (_, i) => (i < 4) ? null : avg5list[i - 4]);
    const avg12Data = Array.from({ length: slvlistsec.length }, (_, i) => (i < 11) ? null : avg12list[i - 11]);

    // Create a new chart with multiple datasets
    timeChartInstance = new Chart(timeChartCanvas, {
        type: 'line',
        data: {
            labels: Array.from({ length: slvlistsec.length }, (_, i) => i + 1),
            datasets: [
                {
                    label: 'Solve Times',
                    data: slvlistsec,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Avg5',
                    data: avg5Data,
                    borderColor: 'rgb(192, 75, 75)',
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Avg12',
                    data: avg12Data,
                    borderColor: 'rgb(75, 75, 192)',
                    borderWidth: 2,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Attempts',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Time (seconds)',
                    },
                },
            },
        },
    });
}

// helper functions
// scramble generator
function getscramblestring(scrambleArray) {
	s = ""
	for (let moveNum of scrambleArray) {
		s += moves[moveNum];
		s += variations[Math.floor(Math.random() * variations.length)];
		s += " ";
	}
	return s;
}
function genscramble(scrambleLength = 24) {
    if (stsp !== 0) return "";
	if (scrambleLength === 0 ) return "";
	
	//First move	
	let scramble = [];
	let moveNum = Math.floor(Math.random() * moves.length);
	scramble.push(moveNum);
	if (scrambleLength === 1) {
		document.getElementById("scramble").innerHTML = getscramblestring(scramble);
	}
	
	//Second move
	while (true) {
		moveNum = Math.floor(Math.random() * moves.length);
		if (moveNum === scramble[0]) continue;	//Same side moved
		scramble.push(moveNum);
		break;
	}
	
	//All other moves
	let i = 1;
	while (i < scrambleLength) {
		i++;
		moveNum = Math.floor(Math.random() * moves.length);
		
		//Same side moved
		if (moveNum === scramble[i-1]) {
			i--;
			continue;
		}
		
		//Moving parallel sides thice is invalid
		const newMoveType = moveNum % 3;
		const latestMoveType = scramble[i-1] % 3;
		const prevMoveType = scramble[i-2] % 3;
		if (latestMoveType === prevMoveType && newMoveType === prevMoveType) {
			i--;
			continue;
		}		
		scramble.push(moveNum);
	}
	document.getElementById("scramble").innerHTML = getscramblestring(scramble);
}

// Function to calculate the average of all the solves
function calculateAvg() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    if (slvlistsec.length > 0) {
        let sum = 0;
        for (let i = slvlistsec.length - 1; i >= 0; i--) {
            sum += parseFloat(slvlistsec[i]);
        }
        return (sum / slvlistsec.length).toFixed(2);
    } else {
        return "N/A";
    }
}

// Function to calculate the average of the last 5 solves
function calculateAvg5() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    if (slvlistsec.length >= 5) {
        let sum = 0;
        for (let i = slvlistsec.length - 1; i >= slvlistsec.length - 5; i--) {
            sum += parseFloat(slvlistsec[i]);
        }
        return (sum / 5).toFixed(2);
    } else {
        return "N/A";
    }
}

// Function to calculate the average of the last 12 solves
function calculateAvg12() {
    let slvlistsec = JSON.parse(localStorage.getItem('slvlistsec')) || [];
    if (slvlistsec.length >= 12) {
        let sum = 0;
        for (let i = slvlistsec.length - 1; i >= slvlistsec.length - 12; i--) {
            sum += parseFloat(slvlistsec[i]);
        }
        return (sum / 12).toFixed(2);
    } else {
        return "N/A";
    }
}

// Function to toggle the variable show
function toggleVariable() {
    show = !checkbox.checked;
}

// function calls
loadsetup();
