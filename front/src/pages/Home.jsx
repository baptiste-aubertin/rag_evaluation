import FileUploader from '../components/FileUploader';
import Header from '../components/Header';

import RagResults from '../components/Results/RagResults';
import DetailsSidebar from '../components/Results/SideBar';
import React from 'react';
import { useState } from 'react';
import logo from '../assets/logo_rag_eval.png';

const Home = () => {
    const [ragResults, setRagResults] = useState(null);
    const [globalScore, setGlobalScore] = useState(null);
    
    const [openedResult, setOpenedResult] = useState(null);

    const handleBack = () => {
        setRagResults(null);
        setGlobalScore(null);
        setOpenedResult(null);
    };

    const showUploadScreen = !ragResults;

    return (
        
        <div className="w-full h-screen bg-[#1D232A] flex relative">
            

            <div className="w-full h-full">
                {showUploadScreen ? (
                    <div className="flex flex-col items-center text-center justify-center w-full h-full">
                        <h1 className="text-2xl font-bold mb-4 text-white">RAG Evaluation Tool</h1>
                        <img src={logo} alt="RAG Evaluation Tool" className="w-64 mb-4 rounded-full" />
                        <FileUploader setData={setRagResults} />
                    </div>
                ) : (
                    <div className="w-full h-full">
                        <Header
                            onBack={() => handleBack()}
                            ragResults={ragResults}
                            setRagResults={setRagResults}
                            globalScore={globalScore}
                            setGlobalScore={setGlobalScore}
                        />
                        <div className="w-full h-[85%] flex relative px-20 pb-3">
                            <div className="h-full flex-1 transition-all duration-300 ease-in-out ">
                                <RagResults
                                    ragResults={ragResults}
                                    setRagResults={setRagResults}
                                    setOpenedResult={setOpenedResult}
                                />
                            </div>
                            <DetailsSidebar
                                openedResult={openedResult}
                                closeSidebar={() => setOpenedResult(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;