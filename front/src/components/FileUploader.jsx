import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import sample_server_response from '../assets/sample_server_response.json';

/**
 * Read and parse JSONL file content.
 * @param {File} file - The file to read and parse.
 * @returns {Promise<Array>} The parsed JSON array from the JSONL file.
 */
async function readJsonlFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const lines = reader.result
                    .split('\n')
                    .filter(line => line.trim());
                const jsonlData = lines.map(line => JSON.parse(line));
                resolve(jsonlData);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
}

/**
 * Merge the server response data with the parsed JSONL data.
 * @param {Array} jsonlData - The data parsed from the uploaded JSONL file.
 * @param {Array} responseData - The response data from the server or sample.
 * @returns {Array} The merged data array.
 */
function mergeResponseWithJsonl(jsonlData, responseData) {
    for (let i = 0; i < jsonlData.length; i++) {
        jsonlData[i].fuzzy_score = responseData[i].fuzzy_score.sample_score;
        jsonlData[i].semantic_score = responseData[i].semantic_score.sample_score;
        jsonlData[i].llm_as_judge_score = responseData[i].llm_as_judge_score.sample_score;
        jsonlData[i].llm_as_judge_feedback = responseData[i].llm_as_judge_score.feedback;

        // Add scores for each document in the top 5
        for (let j = 0; j < jsonlData[i].top5docs.length; j++) {
            jsonlData[i].top5docs[j].scores = {
                "fuzzy": responseData[i].fuzzy_score.top5doc_scores[j],
                "semantic": responseData[i].semantic_score.top5doc_scores[j]
            };
        }
    }
    return jsonlData;
}

/**
 * FileUploader component:
 * Allows users to upload a JSONL file, processes it, and merges additional scores from either a sample response or a server response.
 *
 * Props:
 * - setData: function - Callback to pass processed data to the parent component.
 * - useSampleResponse: boolean - If true, use the sample response; if false, fetch from server.
 */
const FileUploader = ({ setData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Request server response data for the uploaded file.
     * This is just an example. Adjust the endpoint and payload according to your needs.
     * @param {Array} jsonlData - The data parsed from the uploaded file.
     * @returns {Promise<Array>} The server response data.
     */
    async function requestServerResponse(jsonlData) {
        // Example: you might send the entire jsonlData, or just the file, depending on your API.
        // Here we assume you need to send the jsonlData.
        console.log(import.meta.env.VITE_API_URL)

        const endpoint = new URL('/rag_results/evaluate', import.meta.env.VITE_API_URL).toString();

        const response = await axios.post(endpoint, { samples: jsonlData });
        return response.data;
    }

    /**
     * Fetch user sample input from assets/rag_results.jsonl.
     * @returns {Promise<Array>} The parsed data from the file.
     */
    async function fetchSampleInput() {
        try {
            const response = await axios.get('/rag_results.jsonl');
            const jsonlData = await readJsonlFile(new Blob([response.data]));
            return jsonlData;
        } catch (error) {
            setError('Failed to fetch sample input');
            console.error(error);
        }
    }


    /**
     * Handles file drop event:
     * - Reads the uploaded file.
     * - Parses the JSONL content.
     * - Either uses the sample response or requests the server response.
     * - Merges the response data with the uploaded file data.
     * - Passes the processed data to the parent component.
     *
     * @param {File[]} acceptedFiles - List of files dropped into the uploader.
     */
    const onDrop = async (acceptedFiles) => {
        setLoading(true);
        setError(null);
        try {
            const jsonlData = await readJsonlFile(acceptedFiles[0]);

            let responseData;
            
                // Request the server for response
            responseData = await requestServerResponse(jsonlData);


            const mergedData = mergeResponseWithJsonl(jsonlData, responseData);
            setData(mergedData);
        } catch (err) {
            setError('Failed to process file');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchSample = async () => {
        setLoading(true);
        setError(null);
        try {
            const jsonlData = await fetchSampleInput();
            const mergedData = mergeResponseWithJsonl(jsonlData, sample_server_response);
            setData(mergedData);
        } catch (err) {
            setError('Failed to fetch sample data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Set up Dropzone hooks for drag-and-drop file upload
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>

            {
                loading ? <span className="loading loading-ring loading-lg"></span>
                    : <div>
                        <div {...getRootProps()} className='border border-gray-400 cursor-pointer p-4'>
                            <input {...getInputProps()} />
                            <p>Drag & drop a JSONL file here, or click to select one</p>
                        </div>
                        <button onClick={handleFetchSample} className="btn btn-ghost mt-3">
                            Use Sample Input and Output
                        </button>
                    </div>


            }
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileUploader;
