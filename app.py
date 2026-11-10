import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from groq_service import generate_with_groq
from prompts import build_prompt, MESSAGE_TYPES, TONES

load_dotenv()

app = Flask(__name__)

@app.get("/")
def home():
    return render_template(
        "index.html",
        message_types=MESSAGE_TYPES,
        tones=TONES
    )

@app.post("/generate")
def generate():
    data = request.get_json(silent=True) or {}
    message = str(data.get("message", "")).strip()
    message_type = str(data.get("message_type", "")).strip()
    tone = str(data.get("tone", "")).strip()

    if not message:
        return jsonify(success=False, error="Please enter your message."), 400
    if message_type not in MESSAGE_TYPES:
        return jsonify(success=False, error="Please choose a valid message category."), 400
    if tone not in TONES:
        return jsonify(success=False, error="Please choose a valid writing tone."), 400
    if len(message) > 10000:
        return jsonify(success=False, error="Please keep your message under 10,000 characters."), 400

    try:
        prompt = build_prompt(message_type, tone, message)
        generated_message = generate_with_groq(prompt)
        return jsonify(success=True, generated_message=generated_message)
    except ValueError as exc:
        return jsonify(success=False, error=str(exc)), 503
    except Exception:
        app.logger.exception("Message generation failed")
        return jsonify(
            success=False,
            error="Unable to generate your message right now. Please check your connection and try again."
        ), 502

if __name__ == "__main__":
    app.run(debug=True)
