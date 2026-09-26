# 🚗💥 Road Accident Prediction System

**AI-powered accident risk prediction for safer roads 🛡️✨**

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-Proprietary-red.svg)
![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)

---

## 🌟 What This Does

This intelligent system predicts road accident risks using **cutting-edge AI models** trained on comprehensive UK government data 🇬🇧. Simply provide GPS coordinates 📍 and receive **instant, accurate risk assessments** in seconds ⚡!

### ✨ Key Features
- 🎯 **High Accuracy**: 75-85% prediction accuracy
- ⚡ **Real-time Analysis**: Instant risk assessment
- 🗺️ **Interactive Map**: Visual location selection
- 📊 **Detailed Analytics**: Comprehensive risk breakdown
- 🔄 **Batch Processing**: Multiple location analysis
- 🌐 **RESTful API**: Easy integration

---

## 🚀 Quick Start Guide

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/SangramKhandagale/Road_Accident_Prediction_Model
cd Road_Accident_Prediction_Model
```

### 2️⃣ Setup Virtual Environment

> **💡 Note:** Skip this step if using **GitHub Codespaces** 🚫

<details>
<summary><strong>🪟 Windows</strong></summary>

```bash
python -m venv venv
venv\Scripts\activate
```
</details>

<details>
<summary><strong>🍎 macOS/Linux</strong></summary>

```bash
python3 -m venv venv
source venv/bin/activate
```
</details>

### 3️⃣ Install Dependencies 📦
```bash
pip install -r requirements.txt
```

### 4️⃣ Launch Application 🚀
```bash
python app.py
```

🎉 **Success!** Your application is now running at: 👉 **http://localhost:5000** 🌐

---

## 📁 Project Architecture

```
🏗️ ROAD-ACCIDENT-PREDICTION/
├── 📱 app/                    # Core Flask application
│   ├── 🎨 static/             # CSS, JavaScript, images
│   ├── 📄 templates/          # HTML templates
│   └── 🔧 utils/              # Helper functions
├── 🤖 models/                 # Trained AI models
│   ├── 📊 best_accident_model.pkl
│   ├── ⚖️ feature_scaler.pkl
│   └── 📝 feature_names.pkl
├── 📈 data/                   # Dataset files
├── 🧪 tests/                  # Unit tests
├── 🚀 app.py                  # Main application entry
├── ⚙️ config.py              # Configuration settings
├── 📋 requirements.txt       # Python dependencies
└── 📖 README.md              # You are here!
```

---

## ⚙️ Configuration

### Environment Setup (Optional)
Create a `.env` file in the root directory:

```env
# 🔧 Application Settings
FLASK_ENV=development
DEBUG=True
PORT=5000
SECRET_KEY=your_secret_key_here

# 🗃️ Database Configuration
DATABASE_URL=sqlite:///accident_prediction.db

# 📊 Model Settings
MODEL_PATH=models/
CONFIDENCE_THRESHOLD=0.75
```

### 📋 Prerequisites Checklist
- ✅ Python 3.8 or higher installed
- ✅ Virtual environment activated
- ✅ All dependencies installed
- ✅ Model files present in `/models/` directory:
  - 📊 `best_accident_model.pkl` – Primary AI model
  - ⚖️ `feature_scaler.pkl` – Data preprocessor
  - 📝 `feature_names.pkl` – Feature definitions

---

## 🌐 API Documentation

### 🎯 Single Location Prediction
```http
POST /api/predict
Content-Type: application/json

{
  "latitude": 51.5074,
  "longitude": -0.1278
}
```

**Response:**
```json
{
  "status": "success",
  "risk_level": "Medium",
  "confidence": 0.82,
  "coordinates": {
    "latitude": 51.5074,
    "longitude": -0.1278
  },
  "timestamp": "2025-09-20T15:30:00Z"
}
```

### 📦 Batch Location Analysis
```http
POST /api/batch_predict
Content-Type: application/json

{
  "locations": [
    {"lat": 51.5074, "lon": -0.1278},
    {"lat": 52.5200, "lon": 13.4050},
    {"lat": 53.4808, "lon": -2.2426}
  ]
}
```

### ❤️ Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "uptime": "2h 45m 30s",
  "models_loaded": true
}
```

---

## 🎨 Web Interface Guide

### 🏠 Homepage Features
- 🗺️ **Interactive Map**: Click anywhere to select location
- 📍 **Coordinate Input**: Manual latitude/longitude entry
- 🔍 **Address Search**: Search by location name
- 📊 **Results Dashboard**: Visual risk assessment display

### 🎯 How to Use
1. Navigate to **http://localhost:5000**
2. **Select Location** using map or coordinates
3. **Click "Predict Risk"** button
4. **View Results** with risk level and confidence score
5. **Explore Details** for comprehensive analysis

---

## 🛠️ Development

### 🐣 Development Mode
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python app.py
```

### 🧪 Testing the API

<details>
<summary><strong>📡 Using cURL</strong></summary>

```bash
# Single prediction test
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"latitude": 51.5074, "longitude": -0.1278}'

# Batch prediction test
curl -X POST http://localhost:5000/api/batch_predict \
  -H "Content-Type: application/json" \
  -d '{"locations": [{"lat": 51.5074, "lon": -0.1278}]}'

# Health check
curl http://localhost:5000/api/health
```
</details>

<details>
<summary><strong>🐍 Using Python</strong></summary>

```python
import requests

# Test single prediction
response = requests.post('http://localhost:5000/api/predict', 
                        json={'latitude': 51.5074, 'longitude': -0.1278})
print(response.json())
```
</details>

### 🏃‍♂️ Running Tests
```bash
python -m pytest tests/
```

---

## 📊 Model Information

| Metric | Value | Description |
|--------|--------|-------------|
| 🎯 **Accuracy** | 75-85% | Overall prediction accuracy |
| 🤖 **Algorithm** | Ensemble | XGBoost + LightGBM + CatBoost |
| 📈 **Training Data** | 130,000+ | UK accident records |
| 🏷️ **Output Classes** | 3 | Low, Medium, High risk |
| ⚡ **Response Time** | <100ms | Average API response |

### 🧠 Model Architecture
- **Primary Models**: XGBoost, LightGBM, CatBoost
- **Ensemble Method**: Weighted voting
- **Feature Engineering**: 25+ engineered features
- **Data Sources**: UK Department for Transport
- **Update Frequency**: Quarterly retraining

---

## 🚨 Risk Level Guide

| Risk Level | Color | Confidence | Description | Recommendation |
|------------|-------|------------|-------------|----------------|
| 🟢 **Low** | Green | 0.0 - 0.33 | Relatively safe area | Normal driving precautions |
| 🟡 **Medium** | Yellow | 0.34 - 0.66 | Moderate risk zone | Stay alert, reduce speed |
| 🔴 **High** | Red | 0.67 - 1.0 | High risk area | Extra caution required |

---

## 🔧 Troubleshooting

<details>
<summary><strong>❌ Common Issues & Solutions</strong></summary>

### Model Files Not Found
```bash
# Ensure model files exist
ls models/
# Should contain: best_accident_model.pkl, feature_scaler.pkl, feature_names.pkl
```

### Import Errors
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Port Already in Use
```bash
# Use different port
export PORT=8080
python app.py
```

### Low Prediction Accuracy
- ✅ Normal for real-world scenarios
- ✅ Consider ensemble predictions
- ✅ Check data quality and coverage

</details>

---

## 📦 Dependencies

### 🏗️ Core Framework
- 🌐 **Flask** `^2.0.0` - Web application framework
- 🔒 **Flask-CORS** `^3.0.0` - Cross-origin resource sharing

### 🤖 Machine Learning
- 🧠 **scikit-learn** `^1.0.0` - ML algorithms and tools
- 🚀 **XGBoost** `^1.6.0` - Gradient boosting framework
- ⚡ **LightGBM** `^3.3.0` - Fast gradient boosting
- 🐱 **CatBoost** `^1.0.0` - Categorical boosting

### 📊 Data Processing
- 🐼 **pandas** `^1.4.0` - Data manipulation
- 🔢 **numpy** `^1.21.0` - Numerical computing
- 📈 **matplotlib** `^3.5.0` - Data visualization
- 🎨 **seaborn** `^0.11.0` - Statistical visualization

### 🌐 Web & API
- 📡 **requests** `^2.27.0` - HTTP library
- 📋 **flask-restful** `^0.3.9` - REST API toolkit

---

## 📞 Support & Help

### 🆘 Getting Help
1. 📖 **Read Documentation**: Review this README thoroughly
2. 🔍 **Check Examples**: Examine API usage examples
3. 🧪 **Test APIs**: Use provided cURL commands
4. 📝 **Review Logs**: Check console output for errors
5. 🐛 **Report Issues**: Create GitHub issue with details

### 📧 Contact Information
- 👨‍💻 **Developer**: Sangram Khandagale
- 📧 **Email**: [Your Email Here]
- 🔗 **GitHub**: [@SangramKhandagale](https://github.com/SangramKhandagale)
- 💼 **LinkedIn**: [Your LinkedIn Profile]

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 📋 Development Setup
1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests
5. Submit pull request

---

## 📄 License

This project is proprietary software developed for road accident prediction purposes. All rights reserved.

**© 2025 Road Accident Prediction System. Unauthorized reproduction is prohibited.**

---

## 🎉 Ready to Make Roads Safer! 🚗💨💡

**Transform GPS coordinates into life-saving insights with AI**

---

*Last Updated: September 2025* | *Version 1.0.0* | *Made with ❤️ for road safety*

![Star this repo](https://img.shields.io/github/stars/SangramKhandagale/Road_Accident_Prediction_Model?style=social)
![Fork this repo](https://img.shields.io/github/forks/SangramKhandagale/Road_Accident_Prediction_Model?style=social)