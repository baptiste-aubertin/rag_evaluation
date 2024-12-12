from rapidfuzz import fuzz
from typing import List


def fuzzy_inclusion_score(a, b):
    """
    Calculate the inclusion score of string `a` in string `b`.
    Returns 100 if `a` is a perfect substring of `b`.

    Args:
        a (str): The smaller string to check for inclusion.
        b (str): The larger string to search in.

    Returns:
        float: The score of inclusion (0 to 1).
    """
    a = " ".join(a.lower().split())
    b = " ".join(b.lower().split())

    # Direct substring check
    if a in b:
        return 1.0

    # Compute the partial ratio (fuzzy substring matching)
    score = fuzz.partial_ratio(a, b) / 100

    # Emphasize consecutive matches by computing the token set ratio
    consecutive_score = fuzz.ratio(a, b) / 100

    # Combine the scores with a weight towards consecutive matches
    combined_score = (0.7 * score) + (0.3 * consecutive_score)
    return combined_score


def fuzzy_documents_similarity(
    documents1: List[str], documents2: List[str]
) -> List[List[float]]:
    """
    documents1 (list): The first list of documents to compare. Each element in the list is a document.
    documents2 (list): The second list of documents to compare. Each element in the list is a document.
          between documents1[i] and documents2[j]. The score is calculated using the
          fuzzy_inclusion_score function.
    Computes a similarity matrix between two lists of documents using a fuzzy inclusion score.
    Args:
        documents1 (list): The first list of documents to compare.
        documents2 (list): The second list of documents to compare.
    Returns:
        list: A 2D list (matrix) where each element [i][j] represents the similarity score
              between documents1[i] and documents2[j].
    """

    sim_matrix = []
    for d1 in documents1:
        row = []
        for d2 in documents2:
            score = fuzzy_inclusion_score(d1, d2)
            row.append(score)
        sim_matrix.append(row)

    return sim_matrix
