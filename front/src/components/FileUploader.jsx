import React from 'react';
import { useDropzone } from 'react-dropzone';


const FileUploader = ({ setData }) => {
    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = () => {
            const lines = reader.result.split('\n').filter(line => line.trim());
            const jsonlData = lines.map(line => JSON.parse(line));
            jsonlData.forEach((d, i) => {
                d.sample_id = i; // Explicitly add sample_id to the object
            });
            jsonlData.forEach(doc => {
                doc.goldstandard_docs = doc.goldstandard_docs.map((doc, i) => ({ doc_id: i, ...doc }));
                doc.top5docs = doc.top5docs.map((doc, i) => ({ doc_id: i, ...doc }));
            });
            setData(jsonlData);
        };
        reader.readAsText(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className='border border-gray-400 cursor-pointer p-4	'>
            <input {...getInputProps()} />
            <p>Drag & drop a JSONL file here, or click to select one</p>
        </div>
    );
};

export default FileUploader;
