## Descripción

<!-- Explica brevemente qué cambió y por qué. Una oración es suficiente. -->

## Qué cambió
- <!-- Enumerar -->
- <!-- Enumerar -->

## Cómo probarlo

```bash
# Comandos para verificar que funciona
```

## Historia / Tarea relacionada
<!-- Referencia a Número de historia de usuario o tarea en Trello -->
- Story Points:__ 
- Sprint: __
---
## Checklist del autor

> Marca todo lo que aplica antes de pedir revisión.

- [ ] El título sigue la convención: `tipo(alcance): descripción` — ej. `feat(egresos): registrar egreso con evidencia`
- [ ] La rama sale de `develop` y apunta a `develop` (no a `main`)
- [ ] El PR tiene **menos de 400 líneas** cambiadas
- [ ] Incluye tests para el caso feliz y al menos un caso borde (EN CASO DE APLICAR)
- [ ] Los nombres de variables, funciones y clases comunican intención
- [ ] Asignado al menos **1 reviewer** del equipo
- [ ] Agregar los labels correspondientes (`feat` / `fix` / `refactor` / `test` / `docs` · `sprint-#`)

---

## Checklist del reviewer

> Antes de aprobar, verifica:

- [ ] ¿Los tests cubren caso feliz **y** caso borde?
- [ ] ¿Los nombres comunican la intención del código?
- [ ] ¿Las funciones son pequeñas y enfocadas en una sola responsabilidad?
- [ ] ¿Se respetan los principios SOLID? ¿Hay acoplamientos innecesarios?
- [ ] ¿Hay manejo de errores explícito donde corresponde?
- [ ] ¿El PR es de tamaño razonable (< 400 líneas)?

> **Cómo dar feedback:**
> - `nit:` para comentarios opcionales — `blocker:` para cambios obligatorios antes del merge.
> - Sugiere, no impongas: *"¿Consideramos extraer este bloque al método X?"*
> - Si todo está bien: aprueba con un mensaje — *"LGTM — gracias por los tests."*

---

## Tipos de commit válidos

| Prefijo | Cuándo usarlo |
|---------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio interno sin afectar comportamiento |
| `test` | Agregar o modificar tests |
| `docs` | Solo documentación |