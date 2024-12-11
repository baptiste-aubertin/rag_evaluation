import React from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ setData }) => {
    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = () => {
            const lines = reader.result.split('\n').filter(line => line.trim());
            const jsonlData = lines.map(line => JSON.parse(line));
            setData(jsonlData);
        };
        reader.readAsText(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className='border border-gray-400 w-1/2 cursor-pointer	'>
            <input {...getInputProps()} />
            <p>Drag & drop a JSONL file here, or click to select one</p>
        </div>
    );
};

export default FileUploader;
