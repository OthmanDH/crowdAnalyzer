// Utility function to create the request body based on user input
function createRequestBody(year, month, day) {
    return JSON.stringify({
        year: parseInt(year) || 0,
        month: parseInt(month) || 0,
        day: day || null
    });
}

// Handle Emotion Distribution Request
async function submitEmotionDistribution() {
    const year = document.getElementById("emotionYear").value;
    const month = document.getElementById("emotionMonth").value;
    const day = document.getElementById("emotionDay").value;
    const requestBody = createRequestBody(year, month, day);

    const response = await fetch('http://localhost:8000/emotion_distribution/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
    }

    const result = await response.json();
    document.getElementById('emotionResult').innerText = JSON.stringify(result, null, 2);

    // Prepare data for the chart
    const emotionLabels = Object.keys(result.emotion_distribution);
    const emotionValues = Object.values(result.emotion_distribution);

    // Create the chart
    const ctxEmotion = document.getElementById('emotionChart').getContext('2d');
    const canvas = ctxEmotion.canvas;
    canvas.width = 100; // Adjust the width as needed 
    canvas.height = 100; // Adjust the height as needed
    new Chart(ctxEmotion, {
        type: 'pie',
        data: {
            labels: emotionLabels,
            datasets: [{
                label: 'Emotion Distribution',
                data: emotionValues,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Maintain aspect ratio
            aspectRatio: 2, // Aspect ratio of 2:1
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

// Handle Age Distribution Request
async function submitAgeDistribution() {
    const year = document.getElementById("ageYear").value;
    const month = document.getElementById("ageMonth").value;
    const day = document.getElementById("ageDay").value;
    const requestBody = createRequestBody(year, month, day);

    const response = await fetch('http://localhost:8000/age_distribution/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
    }

    const result = await response.json();
    document.getElementById('ageResult').innerText = JSON.stringify(result, null, 2);

    // Prepare data for the chart
    const ageLabels = Object.keys(result.age_distribution);
    const ageValues = Object.values(result.age_distribution);

    // Create the chart
    const ctxAge = document.getElementById('ageChart').getContext('2d');
    new Chart(ctxAge, {
        type: 'bar',
        data: {
            labels: ageLabels,
            datasets: [{
                label: 'Age Distribution',
                data: ageValues,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Maintain aspect ratio
            aspectRatio: 2, // Aspect ratio of 2:1
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

// Handle Gender Distribution Request
async function submitGenderDistribution() {
    const year = document.getElementById("genderYear").value;
    const month = document.getElementById("genderMonth").value;
    const day = document.getElementById("genderDay").value;
    const requestBody = createRequestBody(year, month, day);

    const response = await fetch('http://localhost:8000/gender_distribution/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
    }

    const result = await response.json();
    document.getElementById('genderResult').innerText = JSON.stringify(result, null, 2);

    // Prepare data for the chart
    const genderLabels = Object.keys(result.gender_distribution);
    const genderValues = Object.values(result.gender_distribution);

    // Create the chart
    const ctxGender = document.getElementById('genderChart').getContext('2d');
    new Chart(ctxGender, {
        type: 'doughnut',
        data: {
            labels: genderLabels,
            datasets: [{
                label: 'Gender Distribution',
                data: genderValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Maintain aspect ratio
            aspectRatio: 2, // Aspect ratio of 2:1
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}

// Handle Ethnicity Distribution Request
async function submitEthnicityDistribution() {
    const year = document.getElementById("ethnicityYear").value;
    const month = document.getElementById("ethnicityMonth").value;
    const day = document.getElementById("ethnicityDay").value;
    const requestBody = createRequestBody(year, month, day);

    const response = await fetch('http://localhost:8000/ethnicity_distribution/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
    }

    const result = await response.json();
    document.getElementById('ethnicityResult').innerText = JSON.stringify(result, null, 2);

    // Prepare data for the chart
    const ethnicityLabels = Object.keys(result.ethnicity_distribution);
    const ethnicityValues = Object.values(result.ethnicity_distribution);

    // Create the chart
    const ctxEthnicity = document.getElementById('ethnicityChart').getContext('2d');
    new Chart(ctxEthnicity, {
        type: 'polarArea',
        data: {
            labels: ethnicityLabels,
            datasets: [{
                label: 'Ethnicity Distribution',
                data: ethnicityValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // Maintain aspect ratio
            aspectRatio: 2, // Aspect ratio of 2:1
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });
}
// Handle Most Common Person Request
async function submitMostCommonPerson() {
    const year = document.getElementById("commonPersonYear").value;
    const month = document.getElementById("commonPersonMonth").value;
    const day = document.getElementById("commonPersonDay").value;
    const requestBody = createRequestBody(year, month, day);

    const response = await fetch('http://localhost:8000/most_common_person/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
    }

    const result = await response.json();
    const commonPerson = result.most_common_person;

    const summaryText = `<strong>The most common person</strong> is a <strong>${commonPerson.gender}</strong>, aged <strong>${commonPerson.age_interval}</strong>, ` +
                        `<strong>${commonPerson.race}</strong>, and showing <strong>${commonPerson.emotion}</strong> emotion.`;

    document.getElementById('commonPersonResult').innerHTML = summaryText;
}

// Handle Crowd Density Request
async function submitCrowdDensity() {
    const year = document.getElementById("crowdDensityYear").value;
    const month = document.getElementById("crowdDensityMonth").value;
    const day = document.getElementById("crowdDensityDay").value;
    const requestBody = createRequestBody(year, month, day);

    const response = await fetch('http://localhost:8000/crowd_density/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    });

    if (!response.ok) {
        alert(`Error: ${response.statusText}`);
        return;
    }

    const result = await response.json();
    const summaryText = `<strong>The crowd density</strong> is <strong>${result.crowd_density}</strong> people on <strong>${year}-${month}-${day}</strong>.`;

    document.getElementById('crowdDensityResult').innerHTML = summaryText;
}
// Function to convert RTSP URL to HTTP format
function convertRTSPtoHTTP(rtspUrl) {
    // Convert the RTSP URL to HTTP format
    let httpUrl = rtspUrl.replace(/^rtsp:\/\//i, 'http://');

    // Keep only the base URL if necessary
    const urlParts = httpUrl.split('/');
    if (urlParts.length > 3) {
        httpUrl = urlParts.slice(0, 3).join('/') + '/';
    }

    return httpUrl;
}

// Submit video path and update iframe
async function submitVideoPath() {
    const videoPath = document.getElementById("videoPath").value; // Get the video path from the input field
    const httpUrl = convertRTSPtoHTTP(videoPath); // Convert the RTSP URL to HTTP format

    // Update the iframe source to display the video
    const iframe = document.getElementById("videoIframe");
    iframe.src = httpUrl;

    // Send the RTSP path to the backend for further analysis
    try {
        const url = 'http://localhost:8000/crowd_analysis/';
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
    } catch (error) {
        console.error("Error sending video path to the backend:", error);
    }
}
// Submit image
async function submitImage() {
    const url = 'http://localhost:8000/describe_image/';
    const imageInput = document.getElementById("imageInput").files[0];
    const reader = new FileReader();

    reader.onload = async function() {
        const base64Image = reader.result.split(',')[1]; // Get Base64 string
        const customBody = JSON.stringify({ base64_image: base64Image });

        try {
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

            // Display the result
            document.getElementById("imageDescription").innerHTML = `
                <h3>Image Description:</h3>
                <p>${result.description || 'No description available.'}</p>
            `;
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("imageDescription").innerHTML = `
                <h3>Error:</h3>
                <p>Failed to describe the image. Please try again.</p>
            `;
        }
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
