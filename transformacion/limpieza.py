from pyspark.sql import SparkSession
from pyspark.sql.functions import col, trim, upper, regexp_replace
import os

spark = SparkSession.builder \
    .appName("ObservatorioTurismoCultura") \
    .config("spark.sql.legacy.timeParserPolicy", "LEGACY") \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")

RAW_PATH = "data/raw"
CLEAN_PATH = "data/clean"

os.makedirs(CLEAN_PATH, exist_ok=True)

DEPARTAMENTOS_VALIDOS = [
    "AMAZONAS", "ANTIOQUIA", "ARAUCA", "ATLANTICO", "ATLÁNTICO",
    "BOLIVAR", "BOLÍVAR", "BOYACA", "BOYACÁ", "CALDAS",
    "CAQUETA", "CAQUETÁ", "CASANARE", "CAUCA", "CESAR",
    "CHOCO", "CHOCÓ", "CORDOBA", "CÓRDOBA", "CUNDINAMARCA",
    "GUAINIA", "GUAINÍA", "GUAVIARE", "HUILA", "LA GUAJIRA",
    "MAGDALENA", "META", "NARINO", "NARIÑO",
    "NORTE DE SANTANDER", "PUTUMAYO", "QUINDIO", "QUINDÍO",
    "RISARALDA", "SANTANDER", "SUCRE", "TOLIMA",
    "VALLE DEL CAUCA", "VAUPES", "VAUPÉS", "VICHADA",
    "BOGOTA", "BOGOTÁ", "BOGOTA D. C.", "BOGOTÁ D. C.",
    "BOGOTA D.C.", "BOGOTÁ D.C.",
    "ARCHIPIELAGO DE SAN ANDRES PROVIDENCIA Y SANTA CATALINA",
    "ARCHIPIÉLAGO DE SAN ANDRÉS PROVIDENCIA Y SANTA CATALINA",
    "SAN ANDRES Y PROVIDENCIA", "SAN ANDRÉS Y PROVIDENCIA"
]

def limpiar_texto(df, columnas):
    for c in columnas:
        if c in df.columns:
            # Primero quitar comillas
            df = df.withColumn(c, regexp_replace(col(c), r'["\']', ''))
            # Luego normalizar
            df = df.withColumn(c, upper(trim(col(c))))
            # Finalmente corregir caracteres corruptos
            df = df.withColumn(c, regexp_replace(col(c), r'\?', 'Ñ'))
    return df

def filtrar_departamentos(df):
    return df.filter(col("departamento").isin(DEPARTAMENTOS_VALIDOS))

def guardar_csv(df, nombre):
    df.toPandas().to_csv(
        f"{CLEAN_PATH}/{nombre}.csv",
        index=False,
        encoding="utf-8-sig"
    )

# ─────────────────────────────────────────
# 1. REGISTRO NACIONAL DE TURISMO
# ─────────────────────────────────────────
def limpiar_registro_turismo():
    print("\n🔄 Limpiando registro_nacional_turismo...")
    df = spark.read.csv(
        f"{RAW_PATH}/registro_nacional_turismo.csv",
        header=True, inferSchema=True, encoding="UTF-8"
    )
    df = df.dropDuplicates()
    df = df.filter(col("estado_rnt").isNotNull())
    df = df.filter(col("departamento").isNotNull())
    df = limpiar_texto(df, ["departamento", "municipio", "categoria",
                             "sub_categoria", "estado_rnt",
                             "razon_social_establecimiento"])
    df = filtrar_departamentos(df)
    guardar_csv(df, "registro_nacional_turismo")
    print(f"✅ registro_nacional_turismo limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 2. SITIOS ARQUEOLÓGICOS
# ─────────────────────────────────────────
def limpiar_sitios_arqueologicos():
    print("\n🔄 Limpiando sitios_arqueologicos...")
    df = spark.read.csv(
        f"{RAW_PATH}/sitios_arqueologicos.csv",
        header=True, inferSchema=True, encoding="UTF-8"
    )
    df = df.dropDuplicates()
    df = df.dropna(subset=["latitud", "longitud", "departamento"])
    df = limpiar_texto(df, ["departamento", "municipio",
                             "nombre_arqueol_gico"])
    df = filtrar_departamentos(df)
    guardar_csv(df, "sitios_arqueologicos")
    print(f"✅ sitios_arqueologicos limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 3. ESPACIOS DE CULTURA
# ─────────────────────────────────────────
def limpiar_espacios_cultura():
    print("\n🔄 Limpiando espacios_cultura...")
    df = spark.read.csv(
        f"{RAW_PATH}/espacios_cultura.csv",
        header=True, inferSchema=True, encoding="UTF-8"
    )
    df = df.dropDuplicates()
    df = df.drop("descripci_n", "direcci_n_f_sica", "fuente")
    df = df.dropna(subset=["nombre_del_lugar", "departamento", "municipio"])
    df = limpiar_texto(df, ["departamento", "municipio",
                             "tipo_lugar", "nombre_del_lugar"])
    df = filtrar_departamentos(df)
    guardar_csv(df, "espacios_cultura")
    print(f"✅ espacios_cultura limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 4. ORGANIZACIONES DE CULTURA
# ─────────────────────────────────────────
def limpiar_organizaciones_cultura():
    print("\n🔄 Limpiando organizaciones_cultura...")
    df = spark.read.csv(
        f"{RAW_PATH}/organizaciones_cultura.csv",
        header=True, inferSchema=True, encoding="UTF-8"
    )
    df = df.dropDuplicates()
    df = df.dropna(subset=["nombre", "departamento", "municipio"])
    df = limpiar_texto(df, ["departamento", "municipio", "tipo",
                             "naturaleza_juridica", "nombre"])
    df = filtrar_departamentos(df)
    guardar_csv(df, "organizaciones_cultura")
    print(f"✅ organizaciones_cultura limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 5. SITIOS TURÍSTICOS
# ─────────────────────────────────────────
def limpiar_sitios_turisticos():
    print("\n🔄 Limpiando sitios_turisticos...")
    df = spark.read.csv(
        f"{RAW_PATH}/sitios_turisticos.csv",
        header=True, inferSchema=True, encoding="UTF-8"
    )
    df = df.dropDuplicates()
    df = df.dropna(subset=["nombre"])
    df = limpiar_texto(df, ["nombre", "tipo_de_patrimonio",
                             "grupo", "componente", "elemento",
                             "tipo_de_acceso", "tipo_propiedad"])
    guardar_csv(df, "sitios_turisticos")
    print(f"✅ sitios_turisticos limpio — {df.count()} filas")

# ─────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────
def main():
    print("=== INICIANDO LIMPIEZA CON SPARK ===")
    limpiar_registro_turismo()
    limpiar_sitios_arqueologicos()
    limpiar_espacios_cultura()
    limpiar_organizaciones_cultura()
    limpiar_sitios_turisticos()
    print("\n=== LIMPIEZA FINALIZADA ===")
    spark.stop()

if __name__ == "__main__":
    main()