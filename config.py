import os
from datetime import datetime

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_accident_model.pkl')
    SCALER_PATH = os.path.join(os.path.dirname(__file__), 'models', 'feature_scaler.pkl')
    FEATURES_PATH = os.path.join(os.path.dirname(__file__), 'models', 'feature_names.pkl')
    
    # Default coordinates (London)
    DEFAULT_LAT = 51.5074
    DEFAULT_LON = -0.1278
    
    # API settings
    WEATHER_API_KEY = os.environ.get('36f753ce24mshd5d0f628e7126c8p10ce0ajsn936657884bed')  # Optional
    
    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}