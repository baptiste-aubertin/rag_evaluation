import FileUploader from '../components/FileUploader';
import Header from '../components/Results/Header';

import RagResults from '../components/Results/RagResults';
import DetailsSidebar from '../components/Results/SideBar';
import React from 'react';
import { useState } from 'react';
import logo from '../assets/logo_rag_eval.png';

const Home = () => {
    const [ragResults, setRagResults] = useState(null);
    const [openedResult, setOpenedResult] = useState(null);

    const showUploadScreen = !ragResults;
    const showResultsScreen = !!ragResults;

    return (
        <div className="w-full min-h-screen bg-[#1D232A] flex relative">
            <div className="w-full">
                {showUploadScreen && (
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-2xl font-bold mb-4 text-white">RAG Evaluation Tool</h1>
                        <img src={logo} alt="RAG Evaluation Tool" className="w-64 mb-4" />
                        <FileUploader setData={setRagResults} />
                    </div>
                )}

                {showResultsScreen && (
                    <div className="w-full h-screen">
                        <Header
                            showBackButton={true}
                            onBack={() => setRagResults(null)}
                        />
                        <div className="w-full h-[85%] flex relative px-20">
                            <div className="h-full flex-1 transition-all duration-300 ease-in-out ">
                                <RagResults
                                    ragResults={ragResults}
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