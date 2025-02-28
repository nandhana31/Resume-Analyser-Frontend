document.getElementById("analyze-button").addEventListener("click", function () {
    let formData = new FormData();
    let fileInput = document.getElementById("resume");
    let jobDescription = document.getElementById("job-description").value;

    if (fileInput.files.length === 0) {
        alert("Please upload a resume.");
        return;
    }

    formData.append("resume", fileInput.files[0]);
    formData.append("job_description", jobDescription);

    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("output").innerHTML = `
            <p><strong>Match Score:</strong> ${data.match_score}%</p>
            <p><strong>Matching Skills:</strong> ${data.matching_skills.join(", ")}</p>
            <p><strong>Missing Skills:</strong> ${data.missing_skills.join(", ")}</p>
        `;
    })
    .catch(error => console.error("Error:", error));
});
