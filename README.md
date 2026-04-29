# Flavor Arena MVP

MVP para gestionar competencias, catas y degustaciones comparativas de productos o preparaciones. La app es generica y funciona para eventos como vinos, helados, cafes, empanadas, aceites de oliva, productos artesanales o cualquier item evaluable por jurados.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Postgres + Prisma
- Vitest

## Funcionalidades cubiertas

- Home/admin para crear eventos y listar eventos existentes
- Edicion de evento con categoria, prefijo, estado, texto del item y modo cata a ciegas
- Gestion de participantes con codigos publicos y nombre interno
- Gestion de criterios con rangos configurables, peso y criterio principal
- Plantillas rapidas para comida, bebidas y producto artesanal
- Menciones especiales configurables
- Votacion publica mobile-first en `/event/[slug]/vote`
- Resultados admin en `/event/[slug]/results`
- Resultados publicos en `/event/[slug]/public-results`
- Ranking automatico con desempate por criterio principal y luego menciones especiales
- QR del link publico de votacion

## Instalacion

```bash
npm install
```

## Base de datos

Define `DATABASE_URL` en `.env` con una conexion Postgres valida.

Ejemplo:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/festival_mvp?sslmode=verify-full"
```

Crear la migracion inicial:

```bash
npm run db:migrate -- --name init
```

Generar cliente Prisma:

```bash
npm run db:generate
```

Cargar datos demo:

```bash
npm run db:seed
```

Aplicar migraciones en un entorno remoto:

```bash
npm run db:deploy
```

## Ejecutar local

```bash
npm run dev
```

Abrir:

- `http://localhost:3000`

## Despliegue en Vercel

Este proyecto ya queda preparado para desplegar en Vercel usando Postgres.

Requisitos:

1. Crear una base Postgres remota.
2. Copiar su `DATABASE_URL`.
3. Crear un proyecto en Vercel e importar este repo.
4. En `Settings -> Environment Variables`, cargar `DATABASE_URL`.
5. Desplegar.

El repo incluye:

- `vercel.json` con `buildCommand: npm run build:vercel`
- `build:vercel` que ejecuta `prisma generate`, `prisma migrate deploy` y `next build`

Si quieres seguir desarrollando localmente con la misma base remota, usa esa misma `DATABASE_URL` en tu `.env`.

## Login

No hace falta crear login para esta primera version ni para el despliegue en Vercel. El login de usuarios finales puede agregarse mas adelante sin rehacer la base principal del producto.

## Eventos demo incluidos

El seed crea:

1. `Berenjenas al Escabeche` con 10 participantes y criterios de comida.
2. `Cata de Vinos` con 6 participantes y criterios de bebidas.
3. `Batalla de Helados` con 8 participantes y criterios de producto/postre.

Cada evento demo incluye votos precargados para que la pantalla de resultados ya muestre ranking y menciones.

## Como crear un evento nuevo

1. Ir a la home.
2. Completar nombre, categoria, descripcion, prefijo y texto del item.
3. Crear el evento.
4. Entrar a `Participantes` para cargar productos o participantes.
5. Entrar a `Criterios` para agregar criterios manuales o aplicar una plantilla.
6. Entrar a `Menciones` si queres categorias extra.
7. Desde el resumen del evento copiar el link publico o compartir el QR.
8. Abrir o cerrar votacion desde el panel del evento.

## Como modificar plantillas de criterios

Editar:

- `src/lib/event-templates.ts`

Cada plantilla define:

- `name`
- `minScore`
- `maxScore`
- `weight`
- `required`
- `mainCriterion`

Cuando aplicas una plantilla desde la UI, la lista actual de criterios del evento se reemplaza por la plantilla elegida.

## Tests

Ejecutar:

```bash
npm test
```

Los tests cubren:

- calculo de puntaje ponderado
- ranking
- desempate por criterio principal
- menciones especiales

## Extension futura

La estructura queda preparada para sumar luego:

- login
- multiples organizadores
- pagos
- exportacion CSV
- modo festival
- branding por evento
