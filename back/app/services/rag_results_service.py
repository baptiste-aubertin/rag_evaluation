from ..utils.semantic_analys import semantic_documents_similarity
from ..utils.syntaxic_analys import fuzzy_documents_similarity
from ..utils.llm_as_a_judge import evaluate_instruction_response
from ..schemas.rag_results_schema import DocumentSchema, RagResultsSchema
import time
import numpy as np
from typing import List


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


def compute_scores(rag_results: RagResultsSchema) -> List[dict]:
    """
    Compute evaluation metrics for a set of RAG samples.

    For each sample:
    - Fuzzy scores are computed between the retrieved documents and the gold standard documents.
    - Semantic scores are computed similarly to fuzzy scores, but based on embedding similarity or other semantic metrics.
    - An LLM-based "judge" score and feedback are computed by comparing the generated answer to the gold standard answer.

    The final result is a list of dictionaries, where each dictionary corresponds to a single sample
    and includes:
        - llm_as_judge_score: Contains an overall LLM evaluation score and textual feedback.
        - fuzzy_score: Contains the averaged fuzzy score (based on highest matches) and per-doc scores.
        - semantic_score: Contains the averaged semantic score (based on highest matches) and per-doc scores.

    Args:
        rag_results (RagResultsSchema): Contains multiple samples with:
            - query
            - answer
            - goldstandard_answer
            - top5docs (list of documents retrieved)
            - goldstandard_docs (list of reference documents)

    Returns:
        List[dict]: A list of result dictionaries for each sample.
    """
    start_time = time.time()  # Track computation time
    results = []  # List to hold computed scores for each sample

    for sample in rag_results.samples:
        # Calculate fuzzy scores between retrieved docs and gold standard docs.
        fuzzy_score_matrix = _compute_fuzzy_score(
            sample.top5docs, sample.goldstandard_docs
        )

        # Calculate semantic scores between retrieved docs and gold standard docs.
        semantic_score_matrix = _compute_semantic_score(
            sample.top5docs, sample.goldstandard_docs
        )

        # Use an LLM to evaluate the generated answer against the gold standard.
        llm_feedback, llm_judge_score = _compute_llm_as_judge_score(
            sample.query, sample.answer, sample.goldstandard_answer
        )

        # Identify which docs were actually used for generation.
        used_for_gen_mask = [doc.used_for_generation for doc in sample.top5docs]

        # Compute the aggregated fuzzy score:
        # Take the highest fuzzy score for each doc used in generation, then average them.
        fuzzy_scores_for_used_docs = [
            max(fuzzy_score_matrix[i])
            for i, used in enumerate(used_for_gen_mask)
            if used
        ]
        avg_fuzzy_score = sum(fuzzy_scores_for_used_docs) / len(
            fuzzy_scores_for_used_docs
        )

        # Compute the aggregated semantic score similarly to fuzzy scores.
        semantic_scores_for_used_docs = [
            max(semantic_score_matrix[i])
            for i, used in enumerate(used_for_gen_mask)
            if used
        ]
        avg_semantic_score = sum(semantic_scores_for_used_docs) / len(
            semantic_scores_for_used_docs
        )

        # Prepare per-doc fuzzy scores: For each retrieved doc, get the best matching gold doc score and index.
        fuzzy_doc_details = [
            {"score": max(scores), "gold_doc_index": int(np.argmax(scores))}
            for scores in fuzzy_score_matrix
        ]

        # Prepare per-doc semantic scores similarly.
        semantic_doc_details = [
            {"score": max(scores), "gold_doc_index": int(np.argmax(scores))}
            for scores in semantic_score_matrix
        ]

        # Construct the result dictionary for this sample.
        sample_result = {
            "llm_as_judge_score": {
                "sample_score": llm_judge_score,
                "feedback": llm_feedback,
            },
            "fuzzy_score": {
                "sample_score": avg_fuzzy_score,
                "top5doc_scores": fuzzy_doc_details,
            },
            "semantic_score": {
                "sample_score": avg_semantic_score,
                "top5doc_scores": semantic_doc_details,
            },
        }

        # Add this sample's result to the overall results list.
        results.append(sample_result)

    # Print total computation time for debugging or performance tracking.
    print("Time taken:", time.time() - start_time)

    return results
