import React from 'react';
import { useDropzone } from 'react-dropzone';
import sample_server_response from '../assets/sample_server_response.json';

/**
 * FileUploader component:
 * Allows users to upload a JSONL file, processes the file to integrate additional scores from a sample server response,
 * and passes the processed data to the parent component.
 * 
 * Props:
 * - setData: function - Callback to pass processed data to the parent component.
 */
const FileUploader = ({ setData }) => {

    /**
     * Handles file drop event:
     * - Reads the uploaded file.
     * - Parses the JSONL content.
     * - Integrates additional scores from the sample server response.
     * - Sends the processed data to the parent component.
     * 
     * @param {File[]} acceptedFiles - List of files dropped into the uploader.
     */
    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Read file line by line and parse JSON
            const lines = reader.result.split('\n').filter(line => line.trim());
            const jsonlData = lines.map(line => JSON.parse(line));
            
            // Add additional scores to each JSONL entry
            for (let i = 0; i < jsonlData.length; i++) {
                jsonlData[i].fuzzy_score = sample_server_response[i].fuzzy_score.sample_score;
                jsonlData[i].semantic_score = sample_server_response[i].semantic_score.sample_score;
                jsonlData[i].llm_as_judge_score = sample_server_response[i].llm_as_judge_score.sample_score;

                // Add scores for each document in the top 5
                for (let j = 0; j < jsonlData[i].top5docs.length; j++) {
                    jsonlData[i].top5docs[j].scores = {
                        "fuzzy": sample_server_response[i].fuzzy_score.top5doc_scores[j],
                        "semantic": sample_server_response[i].semantic_score.top5doc_scores[j]
                    };
                }
            }

            console.log(jsonlData); // Debugging: log the processed data

            // Pass processed data to parent component
            setData(jsonlData);
        };
        reader.readAsText(acceptedFiles[0]); // Read the first file as text
    };

    // Set up Dropzone hooks for drag-and-drop file upload
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className='border border-gray-400 cursor-pointer p-4'>
            <input {...getInputProps()} />
            <p>Drag & drop a JSONL file here, or click to select one</p>
        </div>
    );
};

export default FileUploader;
