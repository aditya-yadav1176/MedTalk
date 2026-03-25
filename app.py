from flask import Flask, render_template, request, jsonify
import google.generativeai as genai  # Import Gemini API
import logging

# Initialize Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

# ✅ Replace with your Google Gemini API key
genai.configure(api_key="AIzaSyB3BfjFLNzEGrg_RLZ5b5UfPAFQH-KuleQ")  

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    logging.info(f"Received user message: {user_message}")

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")

        # ✅ Properly formatted prompt
        prompt = f"""
        Provide a short, simple, and easy-to-understand response in 2-3 sentences. 
        Avoid unnecessary details and complex words. Keep it beginner-friendly. 
        You are a medical assistant providing general health information.
        When a user asks about medicines, provide commonly used over-the-counter (OTC) or prescription medicines for the condition.
        Always include a disclaimer that consulting a doctor is necessary before taking any medication.

        **User's question:** {user_message}
        """

        response = model.generate_content(prompt)

        # ✅ Extract only the text response
        bot_reply = response.text if response and hasattr(response, 'text') else "Sorry, I couldn't generate a response."

        logging.info(f"Gemini API Response: {bot_reply}")
        return jsonify({"reply": bot_reply})

    except Exception as e:
        logging.error(f"Error in API call: {str(e)}")
        return jsonify({"error": "Internal Server Error: " + str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
