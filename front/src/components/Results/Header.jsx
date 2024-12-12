import logo from '../../assets/logo_rag_eval.png';

const Header = ({ showBackButton, onBack }) => {
    return (
        <div className="flex items-center justify-between h-[15%] px-20">
            <img src={logo} alt="RAG Evaluation Tool" className="h-3/4" />
            {showBackButton && (
                
                <button
                    onClick={onBack}
                    className="btn btn-outline btn-primary"
                >
                    Back
                </button>
            )}
        </div>
    );
};

export default Header;