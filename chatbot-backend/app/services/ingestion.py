import re

def clean_text(text: str) -> str:
    """Removes MDX frontmatter and normalizes whitespace."""
    # Remove frontmatter (between --- and ---)
    text = re.sub(r'^---\n.*?
---\n', '', text, flags=re.DOTALL)
    
    # Remove imports and MDX specific tags
    text = re.sub(r'import .*? from .*?;', '', text)
    
    # Remove standard HTML comments
    text = re.sub(r'<!--.*?-->', '', text, flags=re.DOTALL)
    
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Basic character-based chunking fallback if tiktoken isn't available in service layer."""
    # Note: ingest.py uses tiktoken directly, this is for service reuse if needed
    chunks = []
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunks.append(text[start:end])
        if end == text_len:
            break
        start += chunk_size - overlap
        
    return chunks
