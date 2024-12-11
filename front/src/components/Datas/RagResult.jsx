import React, { useState } from "react";

const RagResultNode = ({ label, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="pl-4">
            <div
                className="flex items-center cursor-pointer py-1"
                onClick={toggleExpand}
            >
                <span className="mr-2">{isExpanded ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                )}</span>
                <span className="font-medium text-gray-800">{label}</span>
            </div>
            {isExpanded && <div className="ml-6 border-l-2 border-gray-300 pl-4">{children}</div>}
        </div>
    );
};

const RagResult = ({ ragResult }) => {
    return (
        <div className="bg-[#E1E1E1] rounded-lg shadow-md p-4 mx-8">
            <RagResultNode label={`Query: ${ragResult.query}`}>
                <RagResultNode label="Goldstandard Answer">
                    <div className="pl-4 text-gray-700">{ragResult.goldstandard_answer}</div>
                </RagResultNode>
                <RagResultNode label="Goldstandard Keywords">
                    <ul className="pl-4 list-disc text-gray-700">
                        {ragResult.goldstandard_keywords.map((keyword, index) => (
                            <li key={index}>{keyword}</li>
                        ))}
                    </ul>
                </RagResultNode>
                <RagResultNode label="Goldstandard Docs">
                    <div className="pl-4">
                        {ragResult.goldstandard_docs.map((doc, index) => (
                            <RagResultNode key={index} label={`Doc ${index + 1}`}>
                                <div className="pl-4 text-gray-700">{doc.text}</div>
                            </RagResultNode>
                        ))}
                    </div>
                </RagResultNode>
                <RagResultNode label="Answer">
                    <div className="pl-4 text-gray-700">{ragResult.answer}</div>
                </RagResultNode>
                <RagResultNode label="Top 5 Docs">
                    <div className="pl-4">
                        {ragResult.top5docs.map((doc, index) => (
                            <RagResultNode key={index} label={`Doc ${index + 1} (Score: ${doc.score.toFixed(2)})`}>
                                <div className="pl-4 text-gray-700">{doc.text}</div>
                            </RagResultNode>
                        ))}
                    </div>
                </RagResultNode>
            </RagResultNode>
        </div>
    );
};

export default RagResult;