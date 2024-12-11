import React, { useState } from 'react';
import FileUploader from '../components/FileUploader';
import { useEffect } from 'react';

const Home = () => {
    const [ragResults, setRagResults] = useState(null);
    

    useEffect(() => {
        console.log(ragResults);
    }, [ragResults]);


    return (
        <div>
            <h1>RAG Evaluation Tool</h1>
            <FileUploader setData={setRagResults} />
        </div>
    );
};

export default Home;
