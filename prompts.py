MESSAGE_TYPES = [
    "Professional Email",
    "Student Message",
    "Leave Application",
    "Formal Request",
]

TONES = ["Professional", "Polite", "Friendly"]


def build_prompt(message_type: str, tone: str, rough_message: str) -> str:
    """Build clear instructions for the selected message type and tone."""
    return f"""
Improve the user's rough text as a {message_type.lower()}.

Writing tone: {tone.lower()}.

Instructions:
- Correct spelling, grammar, and punctuation.
- Improve clarity and sentence structure.
- Preserve the original meaning and all provided facts.
- Do not invent names, dates, reasons, deadlines, or other details.
- Use formatting appropriate for the selected message type.
- If it is a professional email and enough context exists, include a concise subject line.
- Return only the improved message. Do not explain your edits.

User's rough text:
{rough_message}
""".strip()
