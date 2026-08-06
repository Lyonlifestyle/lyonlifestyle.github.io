"""
generar_catalogo.py
--------------------
Recorre todos los archivos .html de esta carpeta, busca en cada uno
el bloque <script type="application/ld+json"> con los datos del
producto, y arma productos.js con la lista completa.

Uso:
    python3 generar_catalogo.py

Correlo cada vez que edites un precio o agregues un producto nuevo,
antes de hacer git push.
"""

import json
import re
from datetime import datetime, date
from pathlib import Path

CARPETA = Path(__file__).parent
DIAS_NOVEDAD = 30  # un producto se considera "novedad" si fue agregado hace <= 30 días

# Orden en el que se agrupan las categorías dentro de productos.js.
# Cualquier categoría que no esté en esta lista se agrega al final,
# ordenada alfabéticamente.
ORDEN_CATEGORIAS = ["futbol", "beisbol", "gorras", "perfumes", "combo", "accesorios"]

# Nombre bonito para el comentario de cada sección (si no está aquí,
# se usa la categoría tal cual, con la primera letra en mayúscula).
NOMBRES_CATEGORIAS = {
    "futbol": "FÚTBOL",
    "beisbol": "BÉISBOL",
    "gorras": "GORRAS",
    "perfumes": "PERFUMES",
    "combo": "COMBOS",
    "accesorios": "ACCESORIOS",
}

PATRON_BLOQUE = re.compile(
    r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.DOTALL | re.IGNORECASE,
)


def leer_bloque(archivo_html: Path):
    texto = archivo_html.read_text(encoding="utf-8")
    match = PATRON_BLOQUE.search(texto)
    if not match:
        return None
    contenido = match.group(1).strip()
    try:
        return json.loads(contenido)
    except json.JSONDecodeError as e:
        print(f"  ⚠️  {archivo_html.name}: el bloque no es JSON válido ({e})")
        return None


def es_novedad(producto: dict) -> bool:
    if producto.get("nuevo") is True:
        return True
    fecha_str = producto.get("fecha_agregado")
    if not fecha_str:
        return False
    try:
        fecha = datetime.strptime(fecha_str, "%Y-%m-%d").date()
    except ValueError:
        return False
    return (date.today() - fecha).days <= DIAS_NOVEDAD


def en_oferta(producto: dict) -> bool:
    anterior = producto.get("precio_anterior")
    actual = producto.get("precio")
    if anterior is None or actual is None:
        return False
    return actual < anterior


def main():
    productos = []
    ignorados = []

    for archivo in sorted(CARPETA.glob("*.html")):
        datos = leer_bloque(archivo)
        if datos is None:
            ignorados.append(archivo.name)
            continue

        faltantes = [c for c in ("id", "nombre", "categoria", "precio", "url") if c not in datos]
        if faltantes:
            print(f"  ⚠️  {archivo.name}: faltan campos {faltantes}, se omite")
            continue

        datos["es_novedad"] = es_novedad(datos)
        datos["en_oferta"] = en_oferta(datos)
        productos.append(datos)

    def clave_categoria(categoria: str):
        if categoria in ORDEN_CATEGORIAS:
            return (0, ORDEN_CATEGORIAS.index(categoria))
        return (1, categoria)

    productos.sort(key=lambda p: (clave_categoria(p["categoria"]), p["id"]))

    salida = CARPETA / "productos.js"
    lineas = [
        "// Generado automáticamente por generar_catalogo.py — no editar a mano",
        f"// Última actualización: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "// Organizado por categoría para mayor claridad",
        "const productos = [",
    ]

    categoria_actual = None
    for i, producto in enumerate(productos):
        if producto["categoria"] != categoria_actual:
            categoria_actual = producto["categoria"]
            if i > 0:
                lineas.append("")
            nombre_bonito = NOMBRES_CATEGORIAS.get(categoria_actual, categoria_actual.upper())
            lineas.append(f"  // ===== {nombre_bonito} =====")

        bloque = json.dumps(producto, ensure_ascii=False, indent=2)
        bloque_indentado = "\n".join(
            "  " + linea if linea else linea for linea in bloque.splitlines()
        )
        coma = "," if i < len(productos) - 1 else ""
        lineas.append(bloque_indentado + coma)

    lineas.append("];")
    contenido_js = "\n".join(lineas) + "\n"
    salida.write_text(contenido_js, encoding="utf-8")

    print(f"\n✅ productos.js generado con {len(productos)} producto(s).")
    novedades = [p["id"] for p in productos if p["es_novedad"]]
    ofertas = [p["id"] for p in productos if p["en_oferta"]]
    print(f"   Novedades: {novedades if novedades else '(ninguna)'}")
    print(f"   Ofertas:   {ofertas if ofertas else '(ninguna)'}")
    if ignorados:
        print(f"   Páginas sin bloque de producto (ignoradas): {ignorados}")


if __name__ == "__main__":
    main()
