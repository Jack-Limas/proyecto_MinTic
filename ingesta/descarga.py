import requests
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

RAW_PATH = "data/raw"

DATASETS = {
    "sitios_turisticos": "https://www.datos.gov.co/resource/ic3a-dm3e.csv?$limit=50000",
    "registro_nacional_turismo": "https://www.datos.gov.co/resource/thwd-ivmp.csv?$limit=50000",
    "sitios_arqueologicos": "https://www.datos.gov.co/resource/3kq2-tnay.csv?$limit=50000",
    "espacios_cultura": "https://www.datos.gov.co/resource/te39-v28f.csv?$limit=50000",
    "organizaciones_cultura": "https://www.datos.gov.co/resource/eenq-ga7s.csv?$limit=50000",
}

def descargar_dataset(nombre, url):
    print(f"Descargando {nombre}...")
    try:
        response = requests.get(url, timeout=60)
        response.raise_for_status()
        
        ruta = os.path.join(RAW_PATH, f"{nombre}.csv")
        with open(ruta, "wb") as f:
            f.write(response.content)
        
        df = pd.read_csv(ruta)
        print(f"✅ {nombre} descargado — {len(df)} filas, {len(df.columns)} columnas")
    
    except Exception as e:
        print(f"❌ Error descargando {nombre}: {e}")

def main():
    os.makedirs(RAW_PATH, exist_ok=True)
    print("=== Iniciando descarga de datasets ===\n")
    
    for nombre, url in DATASETS.items():
        descargar_dataset(nombre, url)
    
    print("\n=== Descarga finalizada ===")

if __name__ == "__main__":
    main()