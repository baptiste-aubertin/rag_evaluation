import os
from typing import List
from sentence_transformers import SentenceTransformer


model_name = os.getenv("TEXT_EMBEDDING_MODEL")

model = SentenceTransformer(
    model_name,
    trust_remote_code=True,
    device="mps",
    config_kwargs={"use_memory_efficient_attention": False, "unpad_inputs": False},
)


def compute_document_embeddings(documents):
    return model.encode(documents)


def compute_query_embedding(query):
    return model.encode(query, prompt_name="s2p_query")


def semantic_documents_similarity(
    documents1: List[str], documents2: List[str]
) -> List[List[float]]:
    embeddings1 = compute_document_embeddings(documents1)
    embeddings2 = compute_document_embeddings(documents2)
    sim_matrix = model.similarity(embeddings1, embeddings2)

    return sim_matrix.tolist()
