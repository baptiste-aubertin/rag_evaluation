from ..utils.semantic_analys import semantic_documents_similarity
from ..utils.syntaxic_analys import fuzzy_documents_similarity
from ..utils.llm_as_a_judge import evaluate_instruction_response
from ..schemas.rag_results_schema import DocumentSchema, RagResultsSchema
import time
import numpy as np


def _compute_fuzzy_score(
    documents: list[DocumentSchema], gold_documents: list[DocumentSchema]
):
    """
    Compute the fuzzy similarity score between two lists of documents.

    This function checks if the gold standard documents are included in the top 5 documents
    by computing a fuzzy similarity matrix between the provided documents and the gold standard documents.
    """

    documents = [doc.text for doc in documents]
    gold_documents = [doc.text for doc in gold_documents]
    sim_matrix = fuzzy_documents_similarity(documents, gold_documents)

    return sim_matrix


def _compute_semantic_score(
    documents1: list[DocumentSchema], documents2: list[DocumentSchema]
):
    """
    Compute the semantic score between the top5 documents and the gold standard documents.
    """
    documents1 = [doc.text for doc in documents1]
    documents2 = [doc.text for doc in documents2]
    sim_matrix = semantic_documents_similarity(documents1, documents2)

    return sim_matrix


def _compute_llm_as_judge_score(
    query: str, answer: str, goldstandard_answer: str
) -> tuple[str, int]:
    """
    Evaluates the response to an instruction against a reference answer using a language model.
    """
    feedback, score = evaluate_instruction_response(query, answer, goldstandard_answer)

    return feedback, score


def compute_scores(rag_results: RagResultsSchema):
    t = time.time()
    res = []

    for sample in rag_results.samples:
        fuzzy_score = _compute_fuzzy_score(sample.top5docs, sample.goldstandard_docs)
        semantic_score = _compute_semantic_score(
            sample.top5docs, sample.goldstandard_docs
        )
        llm_as_judge_feedback, llm_as_judge_score = _compute_llm_as_judge_score(
            sample.query, sample.answer, sample.goldstandard_answer
        )

        res.append(
            {
                "llm_as_judge_score": {
                    "score": llm_as_judge_score,
                    "feedback": llm_as_judge_feedback,
                },
                "fuzzy_score": {
                    "sample_score": sum([max(scores) for scores in fuzzy_score])
                    / len(fuzzy_score),
                    "top5doc_scores": [
                        {"score": max(scores), "gold_doc_index": int(np.argmax(scores))}
                        for scores in fuzzy_score
                    ],
                },
                "semantic_score": {
                    "sample_score": sum([max(scores) for scores in semantic_score])
                    / len(semantic_score),
                    "top5doc_scores": [
                        {"score": max(scores), "gold_doc_index": int(np.argmax(scores))}
                        for scores in semantic_score
                    ],
                },
            }
        )

    print("Time taken:", time.time() - t)
    return res
