import React, { useState, useEffect } from 'react';

/**
 * Component for calculating and displaying global scores based on 
 * different metrics' weights for a set of RAG results.
 */
const ScoreCalculator = ({ ragResults, setRagResults, globalScore, setGlobalScore }) => {
    // State to manage the weights of the metrics
    const [scores, setScores] = useState({
        "fuzzy_score": 0.25, // Weight for the fuzzy matching score
        "semantic_score": 0.25, // Weight for the semantic similarity score
        "llm_score": 0.5, // Weight for the LLM's judgment score
    });

    // State to indicate if a computation is in progress
    const [computing, setComputing] = useState(false);

    /**
     * Updates the weight for a given score metric.
     * @param {string} score - The name of the score metric to update.
     * @param {number} value - The new weight value.
     */
    const updateWeight = (score, value) => {
        const parsedValue = parseFloat(value) || 0; // Parse the value as a float or default to 0
        setScores({
            ...scores,
            [score]: parsedValue,
        });
    };

    /**
     * Computes the global score for each RAG result based on the provided weights.
     * It also calculates the average global score for all results.
     */
    const handleCompute = () => {
        // Ensure the total weight of the metrics equals 1
        const totalWeight = Object.values(scores).reduce((sum, weight) => sum + weight, 0);

        if (totalWeight !== 1) {
            alert('The sum of all weights must be equal to 1.');
            return;
        }

        if (computing) return; // Prevent multiple computations at the same time

        setComputing(true); // Mark computation as in progress

        // Calculate the global score for each RAG result
        const newRagResults = ragResults.map((ragResult) => {
            const fuzzyScore = ragResult.fuzzy_score * scores.fuzzy_score;
            const semanticScore = ragResult.semantic_score * scores.semantic_score;
            const llmScore = ragResult.llm_as_judge_score * scores.llm_score;
            return {
                ...ragResult,
                global_score: fuzzyScore + semanticScore + llmScore,
            };
        });

        setRagResults(newRagResults); // Update RAG results with computed global scores

        // Calculate the overall average global score
        const new_global_score = newRagResults.reduce((sum, ragResult) => sum + ragResult.global_score, 0) / newRagResults.length;

        setGlobalScore(new_global_score); // Update the global score in the parent state

        setComputing(false); // Mark computation as completed
    };

    /**
     * Automatically computes scores when `ragResults` changes and `globalScore` is null.
     */
    useEffect(() => {
        if (ragResults && globalScore == null) {
            console.log('Auto-computing scores...');
            handleCompute();
        }
    }, [ragResults]);

    return (
        <div className="flex items-center flex-wrap w-full gap-1 justify-center">
            {/* Render input fields for each score weight */}
            {Object.entries(scores).map(([score, weight], index) => (
                <div key={`${score}-${index}`} className="flex items-center gap-1">
                    <span>{score}</span>
                    <p className='font-bold'>x</p>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => updateWeight(score, parseFloat(e.target.value))}
                        className="input input-bordered input-xs w-13"
                        min="0"
                        max="1"
                        step="0.1"
                    />
                    {index < Object.entries(scores).length - 1 && <span>+</span>}
                </div>
            ))}

            {/* Button to trigger global score computation */}
            <button
                onClick={handleCompute}
                className="btn btn-primary btn-sm"
            >
                Compute Global Score
            </button>
        </div>
    );
};

export default ScoreCalculator;
