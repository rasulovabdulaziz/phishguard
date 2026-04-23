

# PhishGuard

PhishGuard is a phishing URL detection project built with:

- Python
- Flask
- pandas
- numpy
- scikit-learn
- joblib
- React + Vite frontend

The system analyzes a submitted URL, extracts simple phishing-related features, and predicts whether the URL is likely `Safe` or `Phishing`.

## Project Features

- Machine learning phishing detection backend
- Flask API with `/predict`
- Existing frontend connected to backend
- Explanation panel showing why a URL was flagged
- Support for defanged phishing samples like `paypal-login[.]com`
- Saved trained model using `joblib`

## Project Structure

```text
project/
├── app.py
├── feature_extraction.py
├── train_model.py
├── predict.py
├── requirements.txt
├── model/
│   └── phishing_model.pkl
├── data/
│   └── phishing_urls.csv
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
├── src/
│   └── React frontend source
└── dist/
    └── built frontend served by Flask
```

## How It Works

1. The user enters a URL in the frontend.
2. The frontend sends the URL to `/predict`.
3. Flask validates and normalizes the URL.
4. Features are extracted from the URL.
5. The trained model predicts whether it is safe or phishing.
6. Extra heuristic checks help catch obvious phishing patterns.
7. The backend returns:
   - prediction
   - confidence
   - phishing type
   - explanation of how it was found

## Run Locally

### Prerequisites

- Python 3.10+
- Node.js

### Install Python dependencies

```bash
pip install -r requirements.txt
```

### Install frontend dependencies

```bash
npm install
```

### Train the model

```bash
python train_model.py
```

### Run the Flask server

```bash
python app.py
```

Then open:

[http://127.0.0.1:5000](http://127.0.0.1:5000)

## Frontend Development

If you want to work on the React frontend separately:

```bash
npm run dev
```

The Vite config proxies `/predict` to the Flask backend during development.

## Example API Request

POST `/predict`

```json
{
  "url": "http://https-paypal-login[.]com"
}
```

Example response:

```json
{
  "success": true,
  "prediction": "Phishing",
  "confidence": 85.0,
  "phishing_type": "Brand spoofing and credential harvesting phishing",
  "summary": "This URL looks suspicious because it matches common phishing patterns and heuristic checks."
}
```

## Notes

- `0 = safe`
- `1 = phishing`
- The included dataset is a simple example dataset for learning and demonstration
- For stronger accuracy in real-world use, a much larger dataset should be used
