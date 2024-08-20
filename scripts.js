// Submit video path
async function submitVideoPath() {
    const url = 'http://localhost:8000/crowd_analysis/';
    const videoPath = document.getElementById("videoPath").value; // Get the video path from the input field
    const customBody = JSON.stringify({ video_path: videoPath });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: customBody
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result); // Handle the response data here
}
// Submit image
async function submitImage() {
    const url = 'http://localhost:8000/describe_image/';
    const imageInput = document.getElementById("imageInput").files[0];
    const reader = new FileReader();

    reader.onload = async function() {
        const base64Image = reader.result.split(',')[1]; // Get Base64 string
        const customBody = JSON.stringify({ base64_image: base64Image });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: customBody
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result); // Handle the response data here
    };

    if (imageInput) {
        reader.readAsDataURL(imageInput);
    } else {
        alert("Please select an image file.");
    }
}

// Insert person
async function insertPerson() {
    const url = 'http://localhost:8000/insert_person/';
    const personName = document.getElementById("personName").value;
    const personImage = document.getElementById("personImage").files[0];

    const formData = new FormData();
    formData.append("name", personName);
    formData.append("file", personImage);

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result); // Handle the response data here
}

// Perform face recognition
async function performFaceRecognition() {
    const url = 'http://localhost:8000/perform_face_recognition/';
    const recognitionName = document.getElementById("recognitionName").value; // User input
    const customBody = JSON.stringify({ name: recognitionName });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: customBody
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result); // Handle the response data here
}

// Fetch data from the FastAPI endpoint for matched people statistics
async function fetchMatchedPeopleData() {
    const response = await fetch('http://127.0.0.1:8000/get_matched_people/');
    const data = await response.json();
    return data.matched_people;
}

// Process and visualize the data with charts
async function displayCharts() {
    const matchedPeople = await fetchMatchedPeopleData();

    // Extract data for the charts
    const ages = matchedPeople.map(person => person.age);
    const genders = matchedPeople.map(person => person.gender);
    const races = matchedPeople.map(person => person.race);
    const emotions = matchedPeople.map(person => person.emotion);

    // Age Chart
    new Chart(document.getElementById('ageChart'), {
        type: 'bar',
        data: {
            labels: ages,
            datasets: [{
                label: 'Age Distribution',
                data: ages,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Gender Chart
    const genderCounts = genders.reduce((acc, gender) => {
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});
    new Chart(document.getElementById('genderChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(genderCounts),
            datasets: [{
                label: 'Gender Distribution',
                data: Object.values(genderCounts),
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                borderWidth: 1
            }]
        }
    });

    // Race Chart
    const raceCounts = races.reduce((acc, race) => {
        acc[race] = (acc[race] || 0) + 1;
        return acc;
    }, {});
    new Chart(document.getElementById('raceChart'), {
        type: 'pie',
        data: {
            labels: Object.keys(raceCounts),
            datasets: [{
                label: 'Race Distribution',
                data: Object.values(raceCounts),
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        }
    });

    // Emotion Chart
    const emotionCounts = emotions.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
    }, {});
    new Chart(document.getElementById('emotionChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(emotionCounts),
            datasets: [{
                label: 'Emotion Distribution',
                data: Object.values(emotionCounts),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Display the charts on page load
displayCharts();
