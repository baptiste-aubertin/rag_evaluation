import React, { useState, useEffect } from 'react';
import FileUploader from '../components/FileUploader';
import logo from '../assets/logo_rag_eval.png';
import RagResults from '../components/Datas/RagResults';
import sample_server_response from '../assets/sample_server_response.json';

const Home = () => {
    const [ragResults, setRagResults] = useState(null);

    useEffect(() => {
        console.log(ragResults);
        // Open json file in ../assets/rag_results.json



        if (ragResults) {
            console.log(sample_server_response);
            sample_server_response.forEach((value, i) => {
                ragResults[i].top5docs.forEach((doc, j) => {
                    doc.fuzzy_score = value.fuzzy_score[i]
                    doc.semantic_score = value.semantic_score[i]
                });
            });
            console.log(ragResults);





        }
    }, [ragResults]);

    return (
        <div className="w-full min-h-screen bg-[#F3F7F0]">
            {!ragResults ? (
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold mb-4">RAG Evaluation Tool</h1>
                    <img src={logo} alt="RAG Evaluation Tool" className="w-64 mb-4" />
                    <FileUploader setData={setRagResults} />
                </div>
            ) : (
                <div className="w-full h-screen">
                    <div className="flex items-center justify-center justify-between h-[15%] px-4">
                        <img src={logo} alt="RAG Evaluation Tool" className="h-3/4" />
                        <button onClick={() => setRagResults(null)} className="bg-[#5EE4FE] hover:bg-blue-700 font-bold py-2 px-4 rounded">Back</button>
                    </div>
                    <div className='w-full h-[85%]'>
                        <RagResults ragResults={ragResults} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
