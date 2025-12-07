import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.services.rag_engine import RagEngine

@pytest.fixture
def mock_qdrant():
    with patch("app.services.rag_engine.get_async_qdrant_client") as mock_get:
        mock_client = AsyncMock()
        mock_get.return_value = mock_client
        yield mock_client

@pytest.fixture
def mock_embedding():
    with patch("app.services.rag_engine.get_embedding") as mock_emb:
        mock_emb.return_value = [0.1] * 768
        yield mock_emb

@pytest.fixture
def mock_genai():
    with patch("app.services.rag_engine.genai_client.aio.models.generate_content") as mock_gen:
        mock_response = AsyncMock()
        mock_response.text = "This is a test answer."
        mock_gen.return_value = mock_response
        yield mock_gen

@pytest.mark.asyncio
async def test_rag_query(mock_qdrant, mock_embedding, mock_genai):
    # Setup Qdrant search result
    mock_point = MagicMock()
    mock_point.payload = {"text": "Context text", "source_file": "doc.md"}
    mock_point.score = 0.9
    mock_qdrant.search.return_value = [mock_point]

    engine = RagEngine()
    result = await engine.query("test query")

    assert result["answer"] == "This is a test answer."
    assert len(result["citations"]) == 1
    assert result["citations"][0]["text"] == "Context text"
    assert result["citations"][0]["source"] == "doc.md"
    
    mock_embedding.assert_called_once_with("test query")
    mock_qdrant.search.assert_called_once()
    mock_genai.assert_called_once()
