import { useState } from 'react';
import { LlmAsJudgeScore } from './Scores';
/**
 * ExpandableText component:
 * Displays text with a "Read more"/"Show less" toggle if it exceeds the specified maximum length.
 * Props:
 * - text: string - The full text to display.
 * - maxLength: number (default 100) - Maximum number of characters before truncating.
 */
const ExpandableText = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Toggles the expanded/collapsed state of the text
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Truncates the text if it exceeds the specified maximum length
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return `${text.slice(0, maxLength)}...`;
    };

    return (
        <p className="text-justify text-sm" onClick={toggleExpand}>
            {isExpanded ? text : truncateText(text, maxLength)}
            {text.length > maxLength && (
                <button
                    className="text-blue-500 ml-2"
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            )}
        </p>
    );
};

/**
 * DetailsSidebar component:
 * Displays detailed information about a selected result, including query, answer, top documents, 
 * evaluation scores, goldstandard answer, and keywords.
 * Props:
 * - openedResult: object - The currently selected result to display.
 * - closeSidebar: function - Function to close the sidebar.
 */
const DetailsSidebar = ({ openedResult, closeSidebar }) => {
    // Dynamically sets the sidebar width based on whether a result is opened
    const sidebarWidth = openedResult ? 'w-1/3 ml-3' : 'w-0 overflow-hidden';

    return (
        <div
            className={`bg-neutral rounded-lg shadow-lg transition-all duration-300 ease-in-out ${sidebarWidth} flex flex-col h-full`}
        >
            {/* Header with query title and close button */}
            <div className="px-4 py-2 flex justify-between items-center border-b border-gray-700">
                <h3 className="font-bold">{openedResult && openedResult.query}</h3>
                <button
                    onClick={closeSidebar}
                    className="text-gray-400 hover:text-gray-200"
                >
                    ✕
                </button>
            </div>

            {openedResult && (
                <div className="flex-1 px-4 overflow-y-auto">
                    {/* Display answer */}
                    <h2 className="underline font-bold text-md mt-4">Answer</h2>
                    <ExpandableText text={openedResult.answer} />

                    {/* Display top 5 documents */}
                    <h2 className="underline font-bold text-md mt-4">Top 5 documents</h2>
                    <ul>
                        {openedResult.top5docs.map((doc, index) => (
                            <li key={index} className="text-sm mb-2">
                                <div className='w-full'>
                                    <h1>Doc {index + 1}</h1>
                                </div>
                                <ExpandableText text={doc.text} />
                            </li>
                        ))}
                    </ul>

                    {/* Display document scores in a table */}
                    <div className='my-4'>
                        <table className="table w-full text-xs">
                            <thead>
                                <tr className="bg-base-200">
                                    <th className="">Doc</th>
                                    <th className="">Fuzzy</th>
                                    <th className="">Gold Doc</th>
                                    <th className="">Semantic</th>
                                    <th className="">Gold Doc</th>
                                </tr>
                            </thead>
                            <tbody>
                                {openedResult.top5docs.map((doc, index) => (
                                    <tr key={index} className="">
                                        <td className="">{index + 1}</td>
                                        <td className="">{doc.scores.fuzzy.score.toFixed(2)}</td>
                                        <td className="">{doc.scores.fuzzy.gold_doc_index + 1}</td>
                                        <td className="">{doc.scores.semantic.score.toFixed(2)}</td>
                                        <td className="">{doc.scores.semantic.gold_doc_index + 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Display llm as judge score and feedback */}
                    <h1 className="font-bold text-sm mt-4">LLM as Judge score : <LlmAsJudgeScore score={openedResult.llm_as_judge_score}/></h1>
                    <ExpandableText text={openedResult.llm_as_judge_feedback} maxLength={200} />

                    {/* Display goldstandard answer */}
                    <h2 className="underline font-bold text-md mt-4">Goldstandard answer</h2>
                    <ExpandableText text={openedResult.goldstandard_answer}  />

                    {/* Display goldstandard documents */}
                    <h2 className="underline font-bold text-md mt-4">Goldstandard docs</h2>
                    <ol>
                        {openedResult.goldstandard_docs.map((doc, index) => (
                            <li key={index} className="text-sm mb-2">
                                <div><h1>Doc {index + 1}</h1></div>
                                <ExpandableText text={doc.text} />
                            </li>
                        ))}
                    </ol>

                    {/* Display goldstandard keywords */}
                    <h2 className="underline font-bold text-md mt-4">Goldstandard keywords</h2>
                    <p className="text-sm">
                        <ExpandableText
                            text={openedResult.goldstandard_keywords
                                .map((doc, index) =>
                                    `${doc}${index < openedResult.goldstandard_keywords.length - 1 ? ", " : ""}`
                                )
                                .join("")}
                        />
                    </p>
                </div>
            )}
        </div>
    );
};

export default DetailsSidebar;
