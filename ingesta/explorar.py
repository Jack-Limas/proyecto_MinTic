import pandas as pd
import os

RAW_PATH = "data/raw"

datasets = [
    "sitios_turisticos",
    "registro_nacional_turismo",
    "sitios_arqueologicos",
    "espacios_cultura",
    "organizaciones_cultura",
]

def explorar_dataset(nombre):
    ruta = os.path.join(RAW_PATH, f"{nombre}.csv")
    df = pd.read_csv(ruta, low_memory=False)
    
    print(f"\n{'='*60}")
    print(f"📂 DATASET: {nombre}")
    print(f"{'='*60}")
    print(f"🔢 Filas: {len(df)} | Columnas: {len(df.columns)}")
    print(f"\n📋 Columnas y tipos:")
    for col in df.columns:
        nulos = df[col].isnull().sum()
        porcentaje = round((nulos / len(df)) * 100, 1)
        print(f"   - {col}: {df[col].dtype} | Nulos: {nulos} ({porcentaje}%)")
    print(f"\n👀 Primeras 2 filas:")
    print(df.head(2).to_string())

def main():
    print("=== EXPLORACIÓN DE DATASETS ===")
    for nombre in datasets:
        explorar_dataset(nombre)
    print(f"\n{'='*60}")
    print("=== EXPLORACIÓN FINALIZADA ===")

if __name__ == "__main__":
    main()
