from pyspark.sql import SparkSession
from pyspark.sql.functions import col, trim, upper, regexp_replace, when
import os

# Iniciar Spark
spark = SparkSession.builder \
    .appName("ObservatorioTurismoCultura") \
    .config("spark.sql.legacy.timeParserPolicy", "LEGACY") \
    .getOrCreate()

spark.sparkContext.setLogLevel("ERROR")

RAW_PATH = "data/raw"
CLEAN_PATH = "data/clean"

os.makedirs(CLEAN_PATH, exist_ok=True)

# ─────────────────────────────────────────
# 1. REGISTRO NACIONAL DE TURISMO
# ─────────────────────────────────────────
def limpiar_registro_turismo():
    print("\n🔄 Limpiando registro_nacional_turismo...")
    df = spark.read.csv(f"{RAW_PATH}/registro_nacional_turismo.csv",
                        header=True, inferSchema=True)

    df = df.dropDuplicates()
    df = df.filter(col("estado_rnt").isNotNull())
    df = df.filter(col("departamento").isNotNull())
    df = df.withColumn("departamento", upper(trim(col("departamento"))))
    df = df.withColumn("municipio", upper(trim(col("municipio"))))
    df = df.withColumn("categoria", upper(trim(col("categoria"))))
    df = df.withColumn("sub_categoria", upper(trim(col("sub_categoria"))))
    df = df.withColumn("estado_rnt", upper(trim(col("estado_rnt"))))

    df.toPandas().to_csv(f"{CLEAN_PATH}/registro_nacional_turismo.csv",
                         index=False, encoding="utf-8")
    print(f"✅ registro_nacional_turismo limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 2. SITIOS ARQUEOLÓGICOS
# ─────────────────────────────────────────
def limpiar_sitios_arqueologicos():
    print("\n🔄 Limpiando sitios_arqueologicos...")
    df = spark.read.csv(f"{RAW_PATH}/sitios_arqueologicos.csv",
                        header=True, inferSchema=True)

    df = df.dropDuplicates()
    df = df.dropna(subset=["latitud", "longitud"])
    df = df.withColumn("departamento", upper(trim(col("departamento"))))
    df = df.withColumn("municipio", upper(trim(col("municipio"))))

    df.toPandas().to_csv(f"{CLEAN_PATH}/sitios_arqueologicos.csv",
                         index=False, encoding="utf-8")
    print(f"✅ sitios_arqueologicos limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 3. ESPACIOS DE CULTURA
# ─────────────────────────────────────────
def limpiar_espacios_cultura():
    print("\n🔄 Limpiando espacios_cultura...")
    df = spark.read.csv(f"{RAW_PATH}/espacios_cultura.csv",
                        header=True, inferSchema=True)

    df = df.dropDuplicates()
    # Eliminar columnas con demasiados nulos
    df = df.drop("descripci_n", "direcci_n_f_sica", "fuente")
    df = df.dropna(subset=["nombre_del_lugar", "departamento", "municipio"])
    df = df.withColumn("departamento", upper(trim(col("departamento"))))
    df = df.withColumn("municipio", upper(trim(col("municipio"))))
    df = df.withColumn("tipo_lugar", upper(trim(col("tipo_lugar"))))

    df.toPandas().to_csv(f"{CLEAN_PATH}/espacios_cultura.csv",
                         index=False, encoding="utf-8")
    print(f"✅ espacios_cultura limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 4. ORGANIZACIONES DE CULTURA
# ─────────────────────────────────────────
def limpiar_organizaciones_cultura():
    print("\n🔄 Limpiando organizaciones_cultura...")
    df = spark.read.csv(f"{RAW_PATH}/organizaciones_cultura.csv",
                        header=True, inferSchema=True)

    df = df.dropDuplicates()
    df = df.dropna(subset=["nombre", "departamento", "municipio"])
    df = df.withColumn("departamento", upper(trim(col("departamento"))))
    df = df.withColumn("municipio", upper(trim(col("municipio"))))
    df = df.withColumn("tipo", upper(trim(col("tipo"))))
    df = df.withColumn("naturaleza_juridica",
                       upper(trim(col("naturaleza_juridica"))))

    df.toPandas().to_csv(f"{CLEAN_PATH}/organizaciones_cultura.csv",
                         index=False, encoding="utf-8")
    print(f"✅ organizaciones_cultura limpio — {df.count()} filas")

# ─────────────────────────────────────────
# 5. SITIOS TURÍSTICOS
# ─────────────────────────────────────────
def limpiar_sitios_turisticos():
    print("\n🔄 Limpiando sitios_turisticos...")
    df = spark.read.csv(f"{RAW_PATH}/sitios_turisticos.csv",
                        header=True, inferSchema=True)

    df = df.dropDuplicates()
    df = df.dropna(subset=["nombre"])
    df = df.withColumn("nombre", upper(trim(col("nombre"))))
    df = df.withColumn("tipo_de_patrimonio",
                       upper(trim(col("tipo_de_patrimonio"))))
    df = df.withColumn("grupo", upper(trim(col("grupo"))))

    df.toPandas().to_csv(f"{CLEAN_PATH}/sitios_turisticos.csv",
                         index=False, encoding="utf-8")
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
