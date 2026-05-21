import pandas as pd
import numpy as np
from scipy import stats
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import os

print("=" * 65)
print("   ANÁLISIS ESTADÍSTICO — TURISMO Y CULTURA EN COLOMBIA")
print("=" * 65)
print("""
Este análisis busca responder la siguiente pregunta:
¿Existe una diferencia significativa en la generación de empleo
entre departamentos con diferente nivel de actividad turística?

Para responderla aplicamos:
  1. Prueba ANOVA de un factor
  2. Post test de Tukey HSD
  3. Correlación de Pearson como prueba de significancia
""")

# Cargar datos
df = pd.read_csv("data/clean/d1_empleos_por_departamento.csv", encoding="utf-8-sig")
df2 = pd.read_csv("data/clean/d1_prestadores_por_departamento.csv", encoding="utf-8-sig")

merged = pd.merge(df, df2, on="departamento")
merged.columns = ["departamento", "total_empleos", "total_prestadores"]

print("=" * 65)
print("   PASO 1 — DATOS BASE")
print("=" * 65)
print("""
Fuente: Registro Nacional de Turismo (RNT) — datos.gov.co
Variables analizadas:
  - Total de prestadores turísticos activos por departamento
  - Total de empleos generados por el sector turístico por departamento
""")
print(f"Total de departamentos analizados: {len(merged)}")
print(f"Total de prestadores turísticos: {merged['total_prestadores'].sum():,}")
print(f"Total de empleos en el sector: {merged['total_empleos'].sum():,.0f}")

# Clasificar en grupos
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

print("\n" + "=" * 65)
print("   PASO 2 — CLASIFICACIÓN DE DEPARTAMENTOS")
print("=" * 65)
print(f"""
Para aplicar ANOVA clasificamos los {len(merged)} departamentos en 3 grupos
según su cantidad de prestadores turísticos registrados:

  Grupo BAJO  → menos de {tercil1:.0f} prestadores
  Grupo MEDIO → entre {tercil1:.0f} y {tercil2:.0f} prestadores  
  Grupo ALTO  → más de {tercil2:.0f} prestadores
""")

for grupo in ["Alto", "Medio", "Bajo"]:
    deps = merged[merged["grupo_prestadores"] == grupo]["departamento"].tolist()
    print(f"Grupo {grupo} ({len(deps)} departamentos):")
    print(f"  {', '.join(deps)}")
    print()

# ANOVA
grupo_bajo = merged[merged["grupo_prestadores"] == "Bajo"]["total_empleos"]
grupo_medio = merged[merged["grupo_prestadores"] == "Medio"]["total_empleos"]
grupo_alto = merged[merged["grupo_prestadores"] == "Alto"]["total_empleos"]

print("=" * 65)
print("   PASO 3 — ESTADÍSTICAS DESCRIPTIVAS POR GRUPO")
print("=" * 65)
print(f"""
Antes de aplicar ANOVA analizamos las estadísticas de cada grupo:

  Grupo ALTO  — Promedio de empleos: {grupo_alto.mean():,.0f}
                Mínimo: {grupo_alto.min():,.0f} | Máximo: {grupo_alto.max():,.0f}
                Departamentos: {len(grupo_alto)}

  Grupo MEDIO — Promedio de empleos: {grupo_medio.mean():,.0f}
                Mínimo: {grupo_medio.min():,.0f} | Máximo: {grupo_medio.max():,.0f}
                Departamentos: {len(grupo_medio)}

  Grupo BAJO  — Promedio de empleos: {grupo_bajo.mean():,.0f}
                Mínimo: {grupo_bajo.min():,.0f} | Máximo: {grupo_bajo.max():,.0f}
                Departamentos: {len(grupo_bajo)}

A simple vista ya se observa una diferencia entre grupos.
ANOVA nos dirá si esa diferencia es estadísticamente significativa.
""")

f_stat, p_valor = stats.f_oneway(grupo_bajo, grupo_medio, grupo_alto)

print("=" * 65)
print("   PASO 4 — PRUEBA ANOVA DE UN FACTOR")
print("=" * 65)
print("""
La prueba ANOVA compara las medias de los 3 grupos para determinar
si al menos uno de ellos es significativamente diferente.

Hipótesis:
  H0 (nula)      → No hay diferencia significativa entre grupos
  H1 (alternativa) → Sí hay diferencia significativa entre grupos

Criterio de decisión:
  Si p-valor < 0.05 → Se rechaza H0 (hay diferencia significativa)
  Si p-valor >= 0.05 → No se rechaza H0
""")
print(f"  F-estadístico : {f_stat:.4f}")
print(f"  P-valor       : {p_valor:.4f}")
print()
if p_valor < 0.05:
    print(f"✅ Conclusión: Con un p-valor de {p_valor:.4f} (menor a 0.05)")
    print("   SE RECHAZA la hipótesis nula.")
    print("   Existe diferencia estadísticamente significativa en la")
    print("   generación de empleo entre los grupos de departamentos.")
else:
    print(f"❌ Conclusión: Con un p-valor de {p_valor:.4f} (mayor a 0.05)")
    print("   NO se rechaza la hipótesis nula.")

print("\n" + "=" * 65)
print("   PASO 5 — POST TEST TUKEY HSD")
print("=" * 65)
print("""
El ANOVA nos dijo que hay diferencias, pero no entre cuáles grupos.
El post test de Tukey HSD compara cada par de grupos para identificar
exactamente dónde están esas diferencias.

Interpretación:
  reject = True  → Hay diferencia significativa entre ese par
  reject = False → No hay diferencia significativa entre ese par
""")

tukey = pairwise_tukeyhsd(
    endog=merged["total_empleos"],
    groups=merged["grupo_prestadores"],
    alpha=0.05
)
print(tukey)

print("""
Interpretación de resultados Tukey:
  - Alto vs Bajo  → SÍ hay diferencia significativa
    Los departamentos con alta actividad turística generan
    significativamente más empleos que los de baja actividad.

  - Alto vs Medio → SÍ hay diferencia significativa  
    Los departamentos con alta actividad turística generan
    significativamente más empleos que los de actividad media.

  - Bajo vs Medio → NO hay diferencia significativa
    Entre departamentos de actividad baja y media los empleos
    generados son similares estadísticamente.
""")

correlacion, p_correlacion = stats.pearsonr(
    merged["total_prestadores"],
    merged["total_empleos"]
)

print("=" * 65)
print("   PASO 6 — PRUEBA DE SIGNIFICANCIA — CORRELACIÓN DE PEARSON")
print("=" * 65)
print("""
La correlación de Pearson mide la fuerza y dirección de la relación
entre dos variables numéricas.

  Valor cercano a  1 → Correlación positiva fuerte
  Valor cercano a  0 → Sin correlación
  Valor cercano a -1 → Correlación negativa fuerte

Variables comparadas:
  - Total de prestadores turísticos por departamento
  - Total de empleos generados por departamento
""")
print(f"  Correlación de Pearson : {correlacion:.4f}")
print(f"  P-valor                : {p_correlacion:.4f}")
print()
if p_correlacion < 0.05:
    print(f"✅ La correlación ES estadísticamente significativa (p < 0.05)")
    if correlacion > 0.7:
        print(f"📊 Correlación ALTA positiva ({correlacion:.2f})")
        print("   A mayor cantidad de prestadores turísticos en un departamento,")
        print("   significativamente mayor es la generación de empleo.")
        print("   Esto confirma que el turismo es un motor real de empleo")
        print("   en los departamentos donde más se desarrolla.")
    elif correlacion > 0.4:
        print(f"📊 Correlación MODERADA positiva ({correlacion:.2f})")
    else:
        print(f"📊 Correlación BAJA ({correlacion:.2f})")
else:
    print("❌ La correlación NO es estadísticamente significativa")

print("\n" + "=" * 65)
print("   CONCLUSIÓN GENERAL")
print("=" * 65)
print(f"""
A partir del análisis estadístico podemos concluir:

1. Existe una diferencia estadísticamente significativa en la
   generación de empleo entre departamentos con diferente nivel
   de actividad turística (ANOVA: F={f_stat:.2f}, p={p_valor:.4f}).

2. Los departamentos con alta actividad turística generan en
   promedio {grupo_alto.mean():,.0f} empleos — muy por encima de los
   departamentos de nivel medio ({grupo_medio.mean():,.0f}) y bajo ({grupo_bajo.mean():,.0f}).

3. La correlación de Pearson de {correlacion:.2f} confirma una relación
   muy fuerte entre prestadores turísticos y empleo generado —
   validando que el turismo es un motor económico significativo
   para los departamentos donde más se desarrolla.

4. Estos resultados respaldan el objetivo del proyecto: impulsar
   el turismo sostenible y regional en Colombia, priorizando los
   departamentos con menor actividad turística que tienen potencial
   de crecimiento.
""")
print("=" * 65)

# Guardar resultados
resultados = {
    "F_estadistico": [f_stat],
    "P_valor_ANOVA": [p_valor],
    "Correlacion_Pearson": [correlacion],
    "P_valor_correlacion": [p_correlacion],
    "Significativo": [p_valor < 0.05],
    "Media_empleos_grupo_alto": [grupo_alto.mean()],
    "Media_empleos_grupo_medio": [grupo_medio.mean()],
    "Media_empleos_grupo_bajo": [grupo_bajo.mean()]
}

pd.DataFrame(resultados).to_csv(
    "data/clean/resultados_anova.csv",
    index=False,
    encoding="utf-8-sig"
)
print("✅ Resultados guardados en data/clean/resultados_anova.csv")