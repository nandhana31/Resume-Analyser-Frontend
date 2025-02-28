import React, { useState } from "react";

function App() {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleAnalyze = async () => {
        if (!file || !jobDescription) {
            setError("Please upload a resume and enter a job description.");
            return;
        }

        setError("");
        setLoading(true);

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("job_description", jobDescription);

        try {
            const response = await fetch("http://127.0.0.1:5000/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to fetch");
            }

            const data = await response.json();
            setAnalysis(data);
        } catch (error) {
            setError("Error analyzing resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Resume Analyzer</h1>

            <div className="input-group">
                <label>Upload Resume:</label>
                <input type="file" accept=".pdf" onChange={handleFileChange} />
            </div>

            <div className="input-group">
                <label>Job Description:</label>
                <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Enter job description..."
                />
            </div>

            <button className="analyze-button" onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : "Analyze Resume"}
            </button>

            {error && <p className="error-message">{error}</p>}

            {analysis && (
                <div className="results">
                    <h2>Analysis Result</h2>
                    <p><strong>Match Score:</strong> {analysis.match_score}%</p>
                    <p><strong>Matching Skills:</strong> {analysis.matching_skills.length > 0 ? analysis.matching_skills.join(", ") : "None"}</p>
                    <p><strong>Missing Skills:</strong> {analysis.missing_skills.length > 0 ? analysis.missing_skills.join(", ") : "None"}</p>
                    <p><strong>Extracted Skills:</strong> {analysis.skills.join(", ")}</p>
                </div>
            )}
        </div>
    );
}

export default App;
