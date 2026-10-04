# ============================================================
# Simple Text Similarity
# ============================================================


def text_similarity_placeholder(
    text_a: str,
    text_b: str
) -> float:
    """
    Calculate simple Jaccard similarity between
    two pieces of text.

    This is a placeholder for a future
    embedding/vector similarity system.
    """

    words_a = set(
        text_a.lower().split()
    )

    words_b = set(
        text_b.lower().split()
    )

    if not words_a or not words_b:

        return 0.0

    intersection = words_a.intersection(
        words_b
    )

    union = words_a.union(
        words_b
    )

    return len(intersection) / len(union)