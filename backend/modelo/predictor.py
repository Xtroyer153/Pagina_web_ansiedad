# predictor.py
import numpy as np
from tensorflow.keras.models import load_model
import joblib
from pathlib import Path

# Ruta al modelo y al codificador
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "modelo_ansiedad.h5"
ENCODER_PATH = BASE_DIR / "label_encoder.pkl"

# Cargar modelo entrenado y codificador de etiquetas
model = load_model(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

def predecir_nivel(respuestas):
    respuestas = [int(r) for r in respuestas]
    
    # Usar el puntaje total
    puntaje_total = sum(respuestas)
    entrada = np.array([[puntaje_total]])

    prediccion = model.predict(entrada)
    clase_predicha = np.argmax(prediccion)

    # Ya está en español
    nivel_ansiedad = label_encoder.inverse_transform([clase_predicha])[0]

    return nivel_ansiedad
