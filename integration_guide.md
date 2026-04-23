# PhishGuard Backend Integration Guide (Flask)

To connect this React frontend with a Flask backend, follow these steps:

## 1. Setup Flask API
Create a `app.py` in your Flask project:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
# Import your ML model here
# import phishing_model

app = Flask(__name__)
CORS(app) # Enable CORS for cross-origin requests from React

@app.route('/api/check-url', methods=['POST'])
def check_url():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
        
    # Placeholder for ML Logic
    # prediction = phishing_model.predict(url)
    # result = "PHISHING" if prediction > 0.5 else "SAFE"
    # confidence = float(prediction * 100)
    
    # Mock Response
    return jsonify({
        "status": "SAFE",
        "confidence": 98.5,
        "url": url
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
```

## 2. Connect React Frontend
In `App.tsx`, update the `handleCheck` function:

```typescript
const handleCheck = async (e?: React.FormEvent) => {
  if (e) e.preventDefault();
  if (!url) return;

  setResultState('analyzing');
  
  try {
    const response = await fetch('http://localhost:5000/api/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    
    const data = await response.json();
    
    setResultData(data);
    setResultState(data.status.toLowerCase());
  } catch (error) {
    console.error("Error checking URL:", error);
    setResultState('idle');
    alert("Backend connection failed. Is the Flask server running?");
  }
};
```

## 3. Production Deployment
- Build React app: `npm run build`
- Serve the `dist/` folder via Flask (using `send_from_directory`) or use a reverse proxy like Nginx.
