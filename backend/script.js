const API_URL = "https://student-management-api-sriram.onrender.com";

// Test backend connection
fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        console.log("Backend connected:", data);
    })
    .catch(error => {
        console.error("Backend connection failed:", error);
    });