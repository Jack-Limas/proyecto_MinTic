import pandas as pd
import numpy as np
from scipy import stats
import os

# Cargar datos
df = pd.read_csv("data/clean/d1_empleos_por_departamento.csv", encoding="utf-8-sig")
df2 = pd.read_csv("data/clean/d1_prestadores_por_departamento.csv", encoding="utf-8-sig")

# Unir los dos datasets por departamento
merged = pd.merge(df, df2, on="departamento")
merged.columns = ["departamento", "total_empleos", "total_prestadores"]

print("=== DATOS COMBINADOS ===")
print(merged.head(10).to_string())
print(f"\nTotal departamentos: {len(merged)}")

# ─────────────────────────────────────────
# CLASIFICAR DEPARTAMENTOS EN 3 GRUPOS
# según cantidad de prestadores
# ─────────────────────────────────────────
tercil1 = merged["total_prestadores"].quantile(0.33)
tercil2 = merged["total_prestadores"].quantile(0.66)

def clasificar(valor):
    if valor <= tercil1:
        return "Bajo"
    elif valor <= tercil2:
        return "Medio"
    else:
        return "Alto"

merged["grupo_prestadores"] = merged["total_prestadores"].apply(clasificar)

print("\n=== GRUPOS DE DEPARTAMENTOS ===")
print(merged[["departamento", "total_prestadores", 
              "total_empleos", "grupo_prestadores"]].to_string())

# ─────────────────────────────────────────
# ANOVA
# ─────────────────────────────────────────
grupo_bajo = merged[merged["grupo_prestadores"] == "Bajo"]["total_empleos"]
grupo_medio = merged[merged["grupo_prestadores"] == "Medio"]["total_empleos"]
grupo_alto = merged[merged["grupo_prestadores"] == "Alto"]["total_empleos"]

print("\n=== ESTADÍSTICAS POR GRUPO ===")
print(f"Grupo Bajo   — Media empleos: {grupo_bajo.mean():.0f} | n={len(grupo_bajo)}")
print(f"Grupo Medio  — Media empleos: {grupo_medio.mean():.0f} | n={len(grupo_medio)}")
print(f"Grupo Alto   — Media empleos: {grupo_alto.mean():.0f} | n={len(grupo_alto)}")

f_stat, p_valor = stats.f_oneway(grupo_bajo, grupo_medio, grupo_alto)

print("\n=== RESULTADO ANOVA ===")
print(f"F-estadístico: {f_stat:.4f}")
print(f"P-valor: {p_valor:.4f}")

if p_valor < 0.05:
    print("✅ Resultado: HAY diferencia significativa entre grupos (p < 0.05)")
else:
    print("❌ Resultado: NO hay diferencia significativa entre grupos (p >= 0.05)")

# ─────────────────────────────────────────
# POST TEST — Tukey HSD
# ─────────────────────────────────────────
from statsmodels.stats.multicomp import pairwise_tukeyhsd

print("\n=== POST TEST TUKEY HSD ===")
tukey = pairwise_tukeyhsd(
    endog=merged["total_empleos"],
    groups=merged["grupo_prestadores"],
    alpha=0.05
)
print(tukey)

# ─────────────────────────────────────────
# PRUEBA DE SIGNIFICANCIA — Correlación
# ─────────────────────────────────────────
correlacion, p_correlacion = stats.pearsonr(
    merged["total_prestadores"],
    merged["total_empleos"]
)

print("\n=== PRUEBA DE SIGNIFICANCIA — Correlación de Pearson ===")
print(f"Correlación: {correlacion:.4f}")
print(f"P-valor: {p_correlacion:.4f}")

if p_correlacion < 0.05:
    print("✅ La correlación ES estadísticamente significativa (p < 0.05)")
    if correlacion > 0.7:
        print("📊 Correlación ALTA positiva — a más prestadores, más empleos")
    elif correlacion > 0.4:
        print("📊 Correlación MODERADA positiva")
    else:
        print("📊 Correlación BAJA")
else:
    print("❌ La correlación NO es estadísticamente significativa")

# Guardar resultados
resultados = {
    "F_estadistico": [f_stat],
    "P_valor_ANOVA": [p_valor],
    "Correlacion_Pearson": [correlacion],
    "P_valor_correlacion": [p_correlacion],
    "Significativo": [p_valor < 0.05]
}

pd.DataFrame(resultados).to_csv(
    "data/clean/resultados_anova.csv",
    index=False,
    encoding="utf-8-sig"
)
print("\n✅ Resultados guardados en data/clean/resultados_anova.csv")
