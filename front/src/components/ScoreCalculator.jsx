import React, { useState, useEffect } from 'react';

const ScoreCalculator = ({ ragResults, setRagResults, globalScore, setGlobalScore }) => {
    const [scores, setScores] = useState({
        "fuzzy_score": 0.25,
        "semantic_score": 0.25,
        "llm_score": 0.5,
    });

    const [computing, setComputing] = useState(false);

    const updateWeight = (score, value) => {
        const parsedValue = parseFloat(value) || 0;
        setScores({
            ...scores,
            [score]: parsedValue,
        });
    };

    const handleCompute = () => {
        const totalWeight = Object.values(scores).reduce((sum, weight) => sum + weight, 0);

        if (totalWeight !== 1) {
            alert('The sum of all weights must be equal to 1.');
            return;
        }

        if (computing) return;

        setComputing(true);
        
        const newRagResults = ragResults.map((ragResult) => {
            const fuzzyScore = ragResult.fuzzy_score * scores.fuzzy_score;
            const semanticScore = ragResult.semantic_score * scores.semantic_score;
            return {
                ...ragResult,
                global_score: fuzzyScore + semanticScore,
            };
        });

        setRagResults(newRagResults);

        const new_global_score = newRagResults.reduce((sum, ragResult) => sum + ragResult.global_score, 0) / newRagResults.length;

        setGlobalScore(new_global_score);

        setComputing(false);
        
    };

    useEffect(() => {
        if (ragResults && globalScore == null) {
            handleCompute();
        }
    }, [ragResults]);

    return (
        <div className="flex items-center flex-wrap w-full gap-1 justify-center">
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