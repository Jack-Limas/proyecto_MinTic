import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

CLEAN_PATH = "data/clean"

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

TABLAS = {
    "registro_nacional_turismo": "registro_nacional_turismo",
    "sitios_arqueologicos": "sitios_arqueologicos",
    "espacios_cultura": "espacios_cultura",
    "organizaciones_cultura": "organizaciones_cultura",
    "sitios_turisticos": "sitios_turisticos",
}

def cargar_tabla(nombre_archivo, nombre_tabla):
    print(f"\n🔄 Cargando {nombre_tabla}...")
    try:
        df = pd.read_csv(
            f"{CLEAN_PATH}/{nombre_archivo}.csv",
            low_memory=False,
            encoding="utf-8-sig"
        )
        df.to_sql(
            nombre_tabla,
            engine,
            if_exists="replace",
            index=False
        )
        print(f"✅ {nombre_tabla} cargado — {len(df)} filas")
    except Exception as e:
        print(f"❌ Error cargando {nombre_tabla}: {e}")

def main():
    print("=== CARGANDO DATOS A POSTGRESQL ===")
    for archivo, tabla in TABLAS.items():
        cargar_tabla(archivo, tabla)
    print("\n=== CARGA FINALIZADA ===")

if __name__ == "__main__":
    main()