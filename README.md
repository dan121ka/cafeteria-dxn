# ☕ DXN CoffeeHouse · App Web Multimedia (H4)

Proyecto web multimedia desarrollado para la **Evaluación Continua H4** con temática de **Cafetería Saludable DXN** (Café Gourmet infusionado con Ganoderma Lucidum / Lingzhi) en Cochabamba, Bolivia.

---

## 🌟 Características Principales

1. **Frontend en Angular 22**:
   - **Inicio / Hero**: Video en bucle de cafetería de alta definición vía **Pexels**, con overlay oscuro, tipografía elegante y botones interactivos.
   - **Servicios**: Grid dinámico con los 6 servicios de la cafetería traídos desde la API.
   - **Especialidades**: Catálogo de bebidas y cafés DXN con filtros por categoría (Café Negro, Café con Leche, Bebidas Especiales, etc.), información de beneficios del Ganoderma, precio servido y precio por caja.
   - **Nosotros**: Historia, explicación científica/tradicional del Ganoderma Lucidum, misión/visión y **Galería fotográfica de la tienda y ambiente**.
   - **Precios**: Comparador de planes, combos de degustación y membresías DXN.
   - **Contactos**: Formulario funcional que guarda los mensajes de los usuarios directamente en la base de datos MySQL mediante la API.
   - **Chatbot Flotante**: Asistente virtual conectado a **Ollama con modelo Gemma 3** adaptado como Barista y Asesor DXN (con fallback inteligente y preguntas sugeridas de un toque).
   - **Botón Flotante de WhatsApp**: Enlace directo para soporte y pedidos.

2. **Backend en Node.js + Express**:
   - Arquitectura modular siguiendo el estándar de la muestra:
     - `models/`
     - `controllers/`
     - `middlewares/` (CORS, error-handler, require-json-object)
     - `routes/`
     - `config/database.js` (conexión a MySQL de XAMPP con pool de conexiones)
     - `app.js` e `index.js`
   - **Todo 100% editable desde MySQL**: Toda la información del frontend (títulos, videos, productos, servicios, precios, fotos) se extrae mediante APIs REST.

3. **Base de Datos MySQL (XAMPP)**:
   - Base de datos: `cafeteria_dxn`
   - Tablas creadas:
     - `configuracion`: Parámetros globales del sitio (video de Pexels, poster, teléfono, dirección, horarios, etc.).
     - `servicios`: Servicios ofrecidos por la cafetería.
     - `especialidades`: Productos y cafés DXN (beneficios, precios, fotos, categorías).
     - `nosotros`: Secciones informativas (historia, Ganoderma, misión, tienda).
     - `galeria`: Fotos del local y ambiente de la cafetería.
     - `precios`: Planes, combos y paquetes de afiliación.
     - `contactos`: Registro de consultas enviadas desde el formulario.
     - `usuarios`: Gestión de usuarios.

---

## 🚀 Guía de Instalación y Ejecución

### 1. Requisitos Previos
- **XAMPP** con el módulo de **MySQL** iniciado (puerto 3306).
- **Node.js** (v18 o superior).
- *(Opcional)* **Ollama** con el modelo `gemma3` para el chatbot con IA local.

### 2. Base de Datos en MySQL (XAMPP)
La base de datos `cafeteria_dxn` ya ha sido creada e importada. Si deseas repoblarla en cualquier momento:
```bash
cd D:\cafeteria-dxn\backend
npm run seed
```
O también puedes importar el archivo `backend/database/schema.sql` directamente desde **phpMyAdmin** (`http://localhost/phpmyadmin`).

### 3. Iniciar el Backend (Node.js API)
```bash
cd D:\cafeteria-dxn\backend
npm start
```
El servidor backend se ejecutará en: `http://localhost:3000`
Rutas principales:
- `http://localhost:3000/api/configuracion`
- `http://localhost:3000/api/servicios`
- `http://localhost:3000/api/especialidades`
- `http://localhost:3000/api/nosotros`
- `http://localhost:3000/api/precios`
- `http://localhost:3000/api/galeria`
- `http://localhost:3000/api/contactos`
- `http://localhost:3000/api/chatbot`

### 4. Iniciar el Frontend (Angular)
En una nueva terminal:
```bash
cd D:\cafeteria-dxn\frontend
npm start
```
Abre tu navegador en: `http://localhost:4200`

### 5. Chatbot con Ollama (Gemma 3)
Para activar las respuestas generativas con el modelo local:
```bash
ollama run gemma3
```
*Nota: Si Ollama no está ejecutándose en ese momento, el backend activará automáticamente el modo de asesor Barista DXN para responder de forma inmediata sin caídas.*

---

## 📂 Estructura del Proyecto

```
D:\cafeteria-dxn/
├── backend/
│   ├── database/
│   │   ├── schema.sql           # Script de creación y datos iniciales de MySQL
│   │   └── seed.js              # Script automatizado de carga
│   ├── src/
│   │   ├── config/database.js   # Conexión MySQL pool
│   │   ├── controllers/         # Lógica de negocio y endpoints
│   │   ├── middlewares/         # CORS, Error handler, validaciones
│   │   ├── models/              # Modelos de consulta a MySQL
│   │   ├── routes/              # Definición de rutas REST
│   │   ├── app.js               # Configuración Express
│   │   └── index.js             # Entrada del servidor
│   ├── .env                     # Variables de entorno (puerto, BD, Ollama)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── services/
    │   │   │   ├── api.service.ts       # Consumo centralizado de APIs
    │   │   │   └── chatbot.service.ts   # Conexión al chatbot
    │   │   ├── app.ts           # Componente principal
    │   │   ├── app.html         # Plantilla interactiva
    │   │   └── app.css          # Estilos multimedia y responsive
    │   ├── index.html           # Tipografías y Bootstrap Icons
    │   └── styles.css           # Variables de diseño y tema café
    └── package.json
```
