import pandas as pd
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

CLEAN_PATH = "data/clean"

CONSULTAS = {

    # ─────────────────────────────────────────
    # DASHBOARD 1 — Prestadores Turísticos
    # ─────────────────────────────────────────
    "d1_prestadores_por_departamento": """
        SELECT departamento,
               COUNT(*) as total_prestadores
        FROM registro_nacional_turismo
        WHERE estado_rnt = 'ACTIVO'
        GROUP BY departamento
        ORDER BY total_prestadores DESC
    """,

    "d1_categorias_turismo": """
        SELECT categoria,
               COUNT(*) as total
        FROM registro_nacional_turismo
        WHERE estado_rnt = 'ACTIVO'
        GROUP BY categoria
        ORDER BY total DESC
    """,

    "d1_empleos_por_departamento": """
        SELECT departamento,
               SUM(num_emp1) as total_empleos
        FROM registro_nacional_turismo
        WHERE estado_rnt = 'ACTIVO'
        GROUP BY departamento
        ORDER BY total_empleos DESC
    """,

    "d1_estado_rnt": """
        SELECT estado_rnt,
               COUNT(*) as total
        FROM registro_nacional_turismo
        GROUP BY estado_rnt
        ORDER BY total DESC
    """,

    "d1_prestadores_por_año": """
        SELECT ano,
               COUNT(*) as total_prestadores
        FROM registro_nacional_turismo
        GROUP BY ano
        ORDER BY ano ASC
    """,

    # ─────────────────────────────────────────
    # DASHBOARD 2 — Sitios y Patrimonio
    # ─────────────────────────────────────────
    "d2_sitios_arqueologicos_por_departamento": """
        SELECT departamento,
               COUNT(*) as total_sitios
        FROM sitios_arqueologicos
        GROUP BY departamento
        ORDER BY total_sitios DESC
    """,

    "d2_sitios_arqueologicos_mapa": """
        SELECT nombre_arqueol_gico,
               departamento,
               municipio,
               latitud,
               longitud
        FROM sitios_arqueologicos
        WHERE latitud IS NOT NULL
          AND longitud IS NOT NULL
    """,

    "d2_sitios_turisticos_patrimonio": """
        SELECT tipo_de_patrimonio,
               COUNT(*) as total
        FROM sitios_turisticos
        GROUP BY tipo_de_patrimonio
        ORDER BY total DESC
    """,

    "d2_sitios_turisticos_grupo": """
        SELECT grupo,
               COUNT(*) as total
        FROM sitios_turisticos
        GROUP BY grupo
        ORDER BY total DESC
    """,

    # ─────────────────────────────────────────
    # DASHBOARD 3 — Espacios Culturales
    # ─────────────────────────────────────────
    "d3_espacios_por_tipo": """
        SELECT tipo_lugar,
               COUNT(*) as total
        FROM espacios_cultura
        GROUP BY tipo_lugar
        ORDER BY total DESC
    """,

    "d3_espacios_por_departamento": """
        SELECT departamento,
               COUNT(*) as total_espacios
        FROM espacios_cultura
        GROUP BY departamento
        ORDER BY total_espacios DESC
    """,

    "d3_espacios_mapa": """
        SELECT nombre_del_lugar,
               tipo_lugar,
               departamento,
               municipio,
               latitud,
               longitud
        FROM espacios_cultura
        WHERE latitud IS NOT NULL
          AND longitud IS NOT NULL
    """,

    # ─────────────────────────────────────────
    # DASHBOARD 4 — Organizaciones Culturales
    # ─────────────────────────────────────────
    "d4_organizaciones_por_tipo": """
        SELECT tipo,
               COUNT(*) as total
        FROM organizaciones_cultura
        GROUP BY tipo
        ORDER BY total DESC
    """,

    "d4_organizaciones_por_departamento": """
        SELECT departamento,
               COUNT(*) as total_organizaciones
        FROM organizaciones_cultura
        GROUP BY departamento
        ORDER BY total_organizaciones DESC
    """,

    "d4_naturaleza_juridica": """
        SELECT naturaleza_juridica,
               COUNT(*) as total
        FROM organizaciones_cultura
        GROUP BY naturaleza_juridica
        ORDER BY total DESC
    """,
}

def ejecutar_consultas():
    print("=== EJECUTANDO CONSULTAS PARA DASHBOARDS ===")
    os.makedirs(CLEAN_PATH, exist_ok=True)

    for nombre, consulta in CONSULTAS.items():
        try:
            df = pd.read_sql(text(consulta), engine)
            ruta = os.path.join(CLEAN_PATH, f"{nombre}.csv")
            df.to_csv(ruta, index=False, encoding="utf-8")
            print(f"✅ {nombre} — {len(df)} filas")
        except Exception as e:
            print(f"❌ Error en {nombre}: {e}")

    print("\n=== CONSULTAS FINALIZADAS ===")

if __name__ == "__main__":
    ejecutar_consultas()
