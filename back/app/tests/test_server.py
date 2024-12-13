from fastapi.testclient import TestClient
from ..server import app
from ..schemas.rag_results_schema import RagEvaluationResponse
import json

client = TestClient(app)


def test_evaluate_route():
    with open("../datas/rag_results.json", "r") as file:
        rag_results = json.load(file)

    response = client.post("/rag_results/evaluate", json=rag_results)
    # Assert the status code and response
    assert response.status_code == 200

    response_json = response.json()

    # Validate the response against the RagEvaluationResponse schema
    # If the response isn't in the correct format, this will raise a ValidationError.
    parsed_response = RagEvaluationResponse.model_validate(response_json)

    assert len(parsed_response.results) == len(rag_results["samples"])

    global_scores = []
    fuzzy_weight = 0.25
    semantic_weight = 0.25
    llm_weight = 0.5

    # COmpute an example of score like the front could do
    for result in parsed_response.results:
        global_scores.append(
            result.fuzzy_score.sample_score * fuzzy_weight
            + result.semantic_score.sample_score * semantic_weight
            + result.llm_as_judge_score.sample_score * llm_weight
        )

    # Assert that the global score is in the expected range
    global_score = sum(global_scores) / len(global_scores)

    assert 0.7 <= global_score <= 0.9
