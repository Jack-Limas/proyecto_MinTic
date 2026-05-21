# 🏛️ Observatorio de Datos — Cultura y Turismo Colombia

> Sistema de análisis y visualización de datos sobre turismo y cultura en Colombia, construido sobre un pipeline automatizado de ingesta, limpieza y transformación de datos oficiales del gobierno colombiano.

---

## 👥 Grupo de Desarrollo

| Nombre | Rol |
|---|---|
| **David Fernando Ramírez de la Parra** | Desarrollador — Pipeline de datos, análisis estadístico |
| **Juan David Maya Benavides** | Analista de datos — Dashboards y visualización |
| **Jack Anderson Limas Solarte** | Ingeniero de datos — Infraestructura y despliegue |

**Materia:** Proyecto de Analítica de Datos — TIC  
**Institución:** Universidad Cooperativa de Colombia  
**Semestre:** VI — 2026

---

## 🎯 Objetivo

Desarrollar un Observatorio de Datos web con dashboards interactivos para el análisis del turismo y cultura en Colombia, integrando datos de datos.gov.co mediante un pipeline automatizado de ingesta, limpieza con Spark/PostgreSQL y visualización en Power BI.

---

## 🔍 Problema que resuelve

En Colombia existe una gran riqueza turística y cultural, pero esa información está dispersa en diferentes páginas del gobierno en formatos técnicos difíciles de interpretar — con inconsistencias, registros duplicados, caracteres corruptos y sin ninguna visualización.

Este observatorio centraliza, limpia y visualiza esa información en un solo lugar, de forma que cualquier persona pueda consultar el panorama del turismo y la cultura en Colombia sin necesidad de ser un experto en datos.

---

## 🏗️ Arquitectura del Pipeline

```
datos.gov.co (API)
       ↓
descarga.py (requests — Python)
       ↓
data/raw/          ← DATA LAKE (datos crudos)
       ↓
limpieza.py (Apache Spark)
       ↓
data/clean/        ← datos limpios
       ↓
cargar_postgres.py
       ↓
PostgreSQL 17      ← base de datos estructurada
       ↓
consultas.py (SQL)
       ↓
Power BI Dashboards + App Web
```

---

## 📦 Datasets Utilizados

Todos los datasets provienen del portal de datos abiertos del gobierno colombiano **[datos.gov.co](https://www.datos.gov.co)** y cubren el territorio nacional completo.

### 1. Registro Nacional de Turismo (RNT)
| Atributo | Detalle |
|---|---|
| **Fuente** | Ministerio de Comercio, Industria y Turismo |
| **URL** | https://www.datos.gov.co/resource/thwd-ivmp.csv |
| **Filas** | 50,000 registros |
| **Columnas** | 14 |
| **Descripción** | Catálogo oficial de todos los prestadores de servicios turísticos registrados en Colombia — hoteles, agencias de viajes, restaurantes turísticos, transportadores, guías de turismo, entre otros. |
| **Columnas clave** | `codigo_rnt`, `estado_rnt`, `departamento`, `municipio`, `categoria`, `sub_categoria`, `habitaciones`, `camas`, `num_emp1`, `ano` |

### 2. Sitios Arqueológicos de Colombia
| Atributo | Detalle |
|---|---|
| **Fuente** | Instituto Colombiano de Antropología e Historia (ICANH) |
| **URL** | https://www.datos.gov.co/resource/3kq2-tnay.csv |
| **Filas** | 22,296 registros |
| **Columnas** | 12 |
| **Descripción** | Inventario nacional de sitios arqueológicos con ubicación geográfica exacta, departamento, municipio y referencias bibliográficas. |
| **Columnas clave** | `nombre_arqueol_gico`, `departamento`, `municipio`, `latitud`, `longitud` |

### 3. Espacios de las Artes, las Culturas y los Saberes
| Atributo | Detalle |
|---|---|
| **Fuente** | Ministerio de las Culturas, las Artes y los Saberes |
| **URL** | https://www.datos.gov.co/resource/te39-v28f.csv |
| **Filas** | 29,162 registros |
| **Columnas** | 11 |
| **Descripción** | Inventario de espacios físicos donde se desarrolla la cultura en Colombia — teatros, bibliotecas, museos, librerías, galerías de arte, centros culturales, entre otros. |
| **Columnas clave** | `tipo_lugar`, `departamento`, `municipio`, `nombre_del_lugar`, `latitud`, `longitud` |

### 4. Organizaciones y Entidades del Sector Cultura
| Atributo | Detalle |
|---|---|
| **Fuente** | Ministerio de las Culturas, las Artes y los Saberes |
| **URL** | https://www.datos.gov.co/resource/eenq-ga7s.csv |
| **Filas** | 33,512 registros |
| **Columnas** | 7 |
| **Descripción** | Directorio de organizaciones culturales registradas en Colombia — productores de espectáculos, entidades sin ánimo de lucro, consejos de cultura, operadores de boletería, entre otros. |
| **Columnas clave** | `nombre`, `tipo`, `naturaleza_juridica`, `departamento`, `municipio` |

### 5. Sitios Turísticos de Colombia
| Atributo | Detalle |
|---|---|
| **Fuente** | Ministerio de Comercio, Industria y Turismo |
| **URL** | https://www.datos.gov.co/resource/ic3a-dm3e.csv |
| **Filas** | 50 registros |
| **Columnas** | 10 |
| **Descripción** | Sitios de patrimonio cultural material e inmueble declarados oficialmente — arquitectura habitacional, obras en espacio público, grupos arquitectónicos coloniales. |
| **Columnas clave** | `nombre`, `tipo_de_patrimonio`, `grupo`, `componente`, `elemento`, `georefenciacion` |

---

## 🔧 Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Python 3** | Lenguaje principal del pipeline |
| **requests** | Descarga automática desde la API de datos.gov.co |
| **pandas** | Manipulación y exploración de datos |
| **Apache Spark (PySpark)** | Limpieza y transformación de datos |
| **PostgreSQL 17** | Almacenamiento de datos limpios |
| **SQLAlchemy + psycopg2** | Conexión Python → PostgreSQL |
| **Power BI Desktop** | Visualización y dashboards |
| **scipy + statsmodels** | Análisis estadístico ANOVA |
| **Git + GitHub** | Control de versiones |

---

## 📁 Estructura del Proyecto

```
observatorio-cultura-turismo/
│
├── app/
│   └── observatorio-web/     ← Aplicación web del observatorio
│
├── dashboard/
│   ├── dashboard1_prestadores.pbix
│   ├── dashboard2_sitios_pratrimonio.pbix
│   ├── dashboard_d4_organizaciones.pbix
│   └── dashboard1_prestadores_plantilla.pbix
│
├── data/
│   ├── raw/                  ← DATA LAKE (no subido a Git)
│   │   ├── registro_nacional_turismo.csv
│   │   ├── sitios_arqueologicos.csv
│   │   ├── espacios_cultura.csv
│   │   ├── organizaciones_cultura.csv
│   │   └── sitios_turisticos.csv
│   └── clean/                ← Datos limpios (no subido a Git)
│       ├── d1_prestadores_por_departamento.csv
│       ├── d1_empleos_por_departamento.csv
│       ├── d1_categorias_turismo.csv
│       ├── d1_estado_rnt.csv
│       ├── d1_prestadores_por_año.csv
│       ├── d2_sitios_arqueologicos_por_departamento.csv
│       ├── d2_sitios_arqueologicos_mapa.csv
│       ├── d2_sitios_turisticos_patrimonio.csv
│       ├── d2_sitios_turisticos_grupo.csv
│       ├── d3_espacios_por_tipo.csv
│       ├── d3_espacios_por_departamento.csv
│       ├── d3_espacios_mapa.csv
│       ├── d4_organizaciones_por_tipo.csv
│       ├── d4_organizaciones_por_departamento.csv
│       ├── d4_naturaleza_juridica.csv
│       └── resultados_anova.csv
│
├── ingesta/
│   ├── descarga.py           ← Descarga automática desde datos.gov.co
│   └── explorar.py           ← Exploración y diagnóstico de datasets
│
├── transformacion/
│   ├── limpieza.py           ← Limpieza con Apache Spark
│   ├── cargar_postgres.py    ← Carga a PostgreSQL
│   ├── consultas.py          ← Consultas SQL para dashboards
│   └── anova.py              ← Análisis estadístico ANOVA
│
├── .env                      ← Credenciales PostgreSQL (no subido a Git)
├── .gitignore
└── README.md
```

---

## ⚙️ Instalación y Ejecución

### Requisitos previos
- Python 3.10+
- PostgreSQL 17
- Java 8+ (requerido por PySpark)
- Power BI Desktop

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jack-Limas/proyecto_MinTic.git
cd observatorio-cultura-turismo
```

### 2. Crear entorno virtual
```bash
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux
```

### 3. Instalar dependencias
```bash
pip install requests pandas psycopg2-binary python-dotenv pyspark sqlalchemy scipy statsmodels
```

### 4. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=observatorio
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

### 5. Crear la base de datos en PostgreSQL
```sql
CREATE DATABASE observatorio;
```

### 6. Ejecutar el pipeline completo
```bash
# Paso 1 — Descargar datos
python ingesta/descarga.py

# Paso 2 — Explorar datos (opcional)
python ingesta/explorar.py

# Paso 3 — Limpiar con Spark
python transformacion/limpieza.py

# Paso 4 — Cargar a PostgreSQL
python transformacion/cargar_postgres.py

# Paso 5 — Generar consultas para dashboards
python transformacion/consultas.py

# Paso 6 — Análisis estadístico ANOVA
python transformacion/anova.py
```

---

## 🧹 Proceso de Limpieza de Datos

El script `transformacion/limpieza.py` aplica los siguientes procesos con Apache Spark:

- **Eliminación de duplicados** — `dropDuplicates()`
- **Eliminación de nulos** en columnas críticas — `dropna(subset=[...])`
- **Corrección de encoding** — caracteres especiales del español (ñ, tildes)
- **Normalización de texto** — mayúsculas y espacios extra — `upper(trim(col(...)))`
- **Eliminación de comillas** en valores de texto — `regexp_replace`
- **Filtrado por departamentos válidos** — lista oficial de los 32 departamentos de Colombia
- **Eliminación de columnas con alto porcentaje de nulos** — `descripcion` (73.8%), `direccion` (69.7%)

---

## 📊 Dashboards

### Dashboard 1 — Prestadores Turísticos
**Datos:** `registro_nacional_turismo`  
**Indicadores:**
- Total de prestadores activos por departamento
- Categorías de servicios turísticos
- Empleos generados por departamento
- Estado activo vs inactivo en el RNT
- Evolución de registros por año

### Dashboard 2 — Sitios y Patrimonio
**Datos:** `sitios_arqueologicos` + `sitios_turisticos`  
**Indicadores:**
- Mapa de sitios arqueológicos con coordenadas reales
- Sitios arqueológicos por departamento
- Tipos de patrimonio turístico
- Grupos de sitios turísticos

### Dashboard 3 — Espacios Culturales
**Datos:** `espacios_cultura`  
**Indicadores:**
- Tipos de espacios culturales en Colombia
- Espacios culturales por departamento
- Mapa de Colombia con ubicaciones reales

### Dashboard 4 — Organizaciones Culturales
**Datos:** `organizaciones_cultura`  
**Indicadores:**
- Total de organizaciones por departamento
- Tipos de organizaciones culturales
- Distribución por naturaleza jurídica

---

## 📈 Análisis Estadístico — ANOVA

### Objetivo
Determinar si existe una diferencia estadísticamente significativa en la generación de empleo entre departamentos con diferente nivel de actividad turística.

### Datasets comparados

**Dataset 1 — Empleos por departamento** (`d1_empleos_por_departamento.csv`)
- Generado a partir del Registro Nacional de Turismo
- Columna `num_emp1`: número de empleados de cada prestador turístico
- Se sumaron los empleos de todos los prestadores activos por departamento
- Resultado: total de empleos que genera el sector turístico en cada uno de los 32 departamentos

**Dataset 2 — Prestadores por departamento** (`d1_prestadores_por_departamento.csv`)
- Generado a partir del Registro Nacional de Turismo
- Conteo de prestadores turísticos activos por departamento
- Usado como variable independiente para clasificar los departamentos en grupos
- Resultado: cantidad de empresas y personas que ofrecen servicios turísticos en cada departamento

### Metodología
Los 32 departamentos se clasificaron en 3 grupos según su cantidad de prestadores:
- **Grupo Alto** — más de 1,700 prestadores (11 departamentos)
- **Grupo Medio** — entre 600 y 1,700 prestadores (10 departamentos)
- **Grupo Bajo** — menos de 600 prestadores (11 departamentos)

### Resultados

#### ANOVA de un factor
| Estadístico | Valor |
|---|---|
| F-estadístico | 7.7896 |
| P-valor | 0.0020 |
| Conclusión | ✅ Se rechaza H0 — hay diferencia significativa |

#### Post Test Tukey HSD
| Comparación | P-valor | Diferencia significativa |
|---|---|---|
| Alto vs Bajo | 0.002 | ✅ Sí |
| Alto vs Medio | 0.022 | ✅ Sí |
| Bajo vs Medio | 0.667 | ❌ No |

#### Correlación de Pearson
| Estadístico | Valor |
|---|---|
| Correlación | 0.8707 |
| P-valor | 0.0000 |
| Interpretación | Correlación alta positiva — estadísticamente significativa |

### Conclusiones del análisis
1. Existe diferencia estadísticamente significativa en la generación de empleo entre grupos de departamentos (p = 0.002 < 0.05)
2. Los departamentos con alta actividad turística generan en promedio **18,606 empleos** — muy por encima de los de nivel medio (5,386) y bajo (1,349)
3. La correlación de 0.87 confirma una relación muy fuerte entre cantidad de prestadores y empleos generados
4. Estos resultados respaldan el objetivo del proyecto: identificar dónde priorizar el impulso al turismo sostenible y regional

---

## 🎯 Indicadores del Observatorio

| # | Indicador | Dashboard | Fuente |
|---|---|---|---|
| 1 | Prestadores turísticos activos por departamento | D1 | RNT |
| 2 | Categorías de servicios turísticos | D1 | RNT |
| 3 | Empleos generados por departamento | D1 | RNT |
| 4 | Estado activo vs inactivo RNT | D1 | RNT |
| 5 | Evolución de registros por año | D1 | RNT |
| 6 | Sitios arqueológicos por departamento | D2 | ICANH |
| 7 | Mapa de sitios arqueológicos | D2 | ICANH |
| 8 | Tipos de patrimonio turístico | D2 | MinCIT |
| 9 | Grupos de sitios turísticos | D2 | MinCIT |
| 10 | Tipos de espacios culturales | D3 | MinCulturas |
| 11 | Espacios culturales por departamento | D3 | MinCulturas |
| 12 | Mapa de espacios culturales | D3 | MinCulturas |
| 13 | Tipos de organizaciones culturales | D4 | MinCulturas |
| 14 | Organizaciones por departamento | D4 | MinCulturas |
| 15 | Distribución por naturaleza jurídica | D4 | MinCulturas |

---

## 🌐 Aplicación Web

La aplicación web del observatorio está desarrollada en la carpeta `app/observatorio-web/` y desplegada en **Vercel**.

Funciona como el punto de entrada del observatorio — el usuario puede navegar entre los 4 dashboards y consultar la información de forma interactiva.

---

## 📌 Impacto

Este observatorio permite:
- Identificar qué departamentos tienen mayor y menor actividad turística
- Evidenciar brechas regionales en infraestructura cultural
- Apoyar decisiones de política pública en turismo y cultura
- Impulsar el turismo sostenible y regional en Colombia

---

## 📄 Licencia

Proyecto académico — Universidad Cooperativa de Colombia 2026.  
Datos utilizados bajo licencia abierta de [datos.gov.co](https://www.datos.gov.co).