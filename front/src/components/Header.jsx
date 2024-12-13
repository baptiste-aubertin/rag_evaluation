import logo from '../assets/logo_rag_eval.png';
import ScoreCalculator from './ScoreCalculator';

const Header = ({ onBack, ragResults, setRagResults, globalScore, setGlobalScore }) => {
    return (
        <div className="flex items-center h-[15%] px-20">
            {/* Left: Logo */}
            <div className="w-1/5 h-full flex justify-start items-center">
                <img src={logo} alt="RAG Evaluation Tool" className="h-3/4 rounded-full" />
            </div>

            {/* Center: Score Selector */}
            <div className="w-3/5 h-full flex justify-center">
                <ScoreCalculator ragResults={ragResults} setRagResults={setRagResults} globalScore={globalScore} setGlobalScore={setGlobalScore} />
            </div>

            {/* Right: Back Button */}
            <div className="w-1/5 flex justify-end items-center font-bold text-accent">
                {globalScore &&<p className='mr-2'>Global score : {globalScore.toFixed(2)}</p>}
                <button
                    onClick={onBack}
                    className="btn btn-outline btn-primary"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default Header;
