import os
from groq import Groq

def generate_with_groq(prompt: str) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_groq_api_key_here":
        raise ValueError(
            "Groq API key is missing. Add your key to the .env file, then restart the app."
        )

    client = Groq(api_key=api_key)
    model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a careful writing assistant. Improve the user's message "
                    "without changing its meaning or inventing details."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.5,
        max_tokens=1200,
    )

    result = response.choices[0].message.content
    if not result or not result.strip():
        raise RuntimeError("The AI service returned an empty response.")
    return result.strip()
