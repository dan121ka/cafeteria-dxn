-- Base de datos para Cafetería DXN CoffeeHouse
CREATE DATABASE IF NOT EXISTS cafeteria_dxn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafeteria_dxn;

-- 1. Configuración General del Sitio (Hero, Contacto, Redes, etc.)
CREATE TABLE IF NOT EXISTS configuracion (
  id INT NOT NULL AUTO_INCREMENT,
  clave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'texto',
  descripcion VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Servicios de la Cafetería
CREATE TABLE IF NOT EXISTS servicios (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  subtitulo VARCHAR(200) DEFAULT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(100) DEFAULT 'coffee',
  imagen VARCHAR(255) DEFAULT NULL,
  orden INT DEFAULT 0,
  activo TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Especialidades y Productos DXN
CREATE TABLE IF NOT EXISTS especialidades (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  beneficios TEXT DEFAULT NULL,
  precio DECIMAL(10,2) NOT NULL,
  precio_caja DECIMAL(10,2) DEFAULT NULL,
  imagen VARCHAR(255) NOT NULL,
  badge VARCHAR(100) DEFAULT NULL,
  orden INT DEFAULT 0,
  destacado TINYINT(1) DEFAULT 0,
  disponible TINYINT(1) DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Sección Nosotros (Historia, Misión, Ganoderma, etc.)
CREATE TABLE IF NOT EXISTS nosotros (
  id INT NOT NULL AUTO_INCREMENT,
  seccion VARCHAR(100) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  subtitulo VARCHAR(255) DEFAULT NULL,
  contenido LONGTEXT NOT NULL,
  imagen VARCHAR(255) DEFAULT NULL,
  icono VARCHAR(100) DEFAULT NULL,
  orden INT DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Planes de Precios y Combos
CREATE TABLE IF NOT EXISTS precios (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  categoria VARCHAR(100) DEFAULT 'Menu',
  precio DECIMAL(10,2) NOT NULL,
  periodo VARCHAR(50) DEFAULT 'por taza',
  descripcion TEXT DEFAULT NULL,
  caracteristicas JSON DEFAULT NULL,
  destacado TINYINT(1) DEFAULT 0,
  boton_texto VARCHAR(100) DEFAULT 'Pedir Ahora',
  orden INT DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Galería de Fotos de la Tienda y Cafetería
CREATE TABLE IF NOT EXISTS galeria (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  descripcion VARCHAR(255) DEFAULT NULL,
  categoria VARCHAR(100) DEFAULT 'Ambiente',
  imagen VARCHAR(255) NOT NULL,
  orden INT DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Mensajes del Formulario de Contactos
CREATE TABLE IF NOT EXISTS contactos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono VARCHAR(50) DEFAULT NULL,
  asunto VARCHAR(200) DEFAULT 'Consulta general',
  mensaje TEXT NOT NULL,
  leido TINYINT(1) DEFAULT 0,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'admin',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERCIÓN DE DATOS INICIALES (EDITABLES EN MYSQL)

-- Configuración
INSERT INTO configuracion (clave, valor, tipo, descripcion) VALUES
('sitio_nombre', 'DXN CoffeeHouse', 'texto', 'Nombre de la cafetería'),
('hero_subtitulo', 'COCHABAMBA · BOLIVIA', 'texto', 'Subtítulo superior en Hero'),
('hero_titulo', 'El Mejor Café Saludable de la Ciudad', 'texto', 'Título principal en sección Inicio'),
('hero_descripcion', 'Calidad, sabor y bienestar en cada taza. Disfruta de una experiencia gourmet única infusionada con los extractos naturales de Ganoderma Lucidum (Hongo Lingzhi).', 'texto', 'Descripción en sección Inicio'),
('hero_video_url', '/videos/hero-cafeteria.mp4', 'url', 'Video en bucle de Pexels para el fondo de inicio'),
('hero_video_backup_url', 'https://videos.pexels.com/video-files/2909914/2909914-hd_1920_1080_24fps.mp4', 'url', 'Video alternativo de Pexels'),
('hero_poster', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1920', 'url', 'Imagen de póster de carga para el video'),
('direccion', 'Av. Heroínas #456 entre San Martín y 25 de Mayo, Cochabamba, Bolivia', 'texto', 'Dirección física de la cafetería'),
('telefono', '+591 4 456-7890', 'texto', 'Teléfono fijo de contacto'),
('whatsapp', '+591 71234567', 'texto', 'Número de WhatsApp de pedidos y soporte'),
('email', 'contacto@dxncoffeehouse.bo', 'texto', 'Correo electrónico de contacto'),
('horario', 'Lunes a Sábado: 07:30 - 21:30 | Domingos: 09:00 - 20:00', 'texto', 'Horario de atención al público'),
('facebook_url', 'https://facebook.com/dxncoffeehouse', 'url', 'Página oficial de Facebook'),
('instagram_url', 'https://instagram.com/dxncoffeehouse', 'url', 'Cuenta de Instagram');

-- Servicios
INSERT INTO servicios (titulo, subtitulo, descripcion, icono, imagen, orden) VALUES
('Barismo & Cafetería Gourmet', 'Preparación al momento', 'Disfruta de espressos, cappuccinos, lattes y preparados fríos elaborados con los mejores granos y Ganoderma 100% orgánico certificado.', 'bi-cup-hot', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Venta y Distribución DXN', 'Por mayor y menor', 'Adquiere productos originales DXN en cajas y paquetes para tu hogar o negocio con asesoramiento personalizado y precios de distribuidor.', 'bi-box-seam', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('Degustaciones y Catas de Café', 'Descubre nuevos sabores', 'Participa en sesiones semanales guiadas donde aprenderás a identificar notas de sabor y conocer las variedades de Lingzhi, Mocha y Cocozhi.', 'bi-stars', 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
('Asesoría Nutricional y Salud', 'Vive con energía natural', 'Nuestros especialistas te orientan sobre los increíbles beneficios antioxidantes, desintoxicantes y de refuerzo inmune de los productos Ganoderma.', 'bi-heart-pulse', 'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800', 4),
('Espacio Coworking & WiFi', 'Trabaja con la mejor vibra', 'Ambiente cómodo, enchufes en cada mesa, música acústica relajante y conexión de fibra óptica de alta velocidad mientras saboreas tu café preferido.', 'bi-laptop', 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=800', 5),
('Membresías y Afiliaciones', 'Gana consumiendo y recomendando', 'Regístrate como socio DXN para obtener descuentos de por vida de hasta el 40% y generar ingresos pasivos a través de la red global de bienestar.', 'bi-award', 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', 6);

-- Especialidades
INSERT INTO especialidades (nombre, categoria, descripcion, beneficios, precio, precio_caja, imagen, badge, orden, destacado) VALUES
('Café Lingzhi 2 en 1 (Black Coffee)', 'Café Negro', 'Café negro brasileño puro de tueste medio, libre de azúcar y enriquecido con extracto puro de Ganoderma Lucidum. Sabor intenso con notas tostadas.', 'Desintoxica el organismo, acelera el metabolismo, no produce acidez estomacal ni taquicardia.', 15.00, 140.00, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800', 'Top Ventas', 1, 1),
('Café Lingzhi 3 en 1', 'Café con Leche', 'La combinación perfecta de granos selectos de café, crema vegetal no láctea de fácil digestión y extracto de hongo Lingzhi con un toque justo de dulzor.', 'Aporte energético sostenido, refuerza defensas inmunológicas y equilibra los niveles de estrés.', 18.00, 155.00, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', 'Favorito del Público', 2, 1),
('Zhi Mocha Gourmet', 'Especialidad', 'Deliciosa fusión entre café aromático, cacao natural premium y Ganoderma. Coronada con espuma aterciopelada y lluvia de chocolate amargo.', 'Potente antioxidante, estimula la concentración mental y mejora el estado de ánimo naturalmente.', 22.00, 175.00, 'https://images.pexels.com/photos/230588/pexels-photo-230588.jpeg?auto=compress&cs=tinysrgb&w=800', 'Recomendación Barista', 3, 1),
('Cocozhi Chocolate Caliente', 'Chocolates & Malteadas', 'Bebida reconfortante de cacao de primera calidad y extracto de Ganoderma joven (micelio). Apto para niños, jóvenes y adultos.', 'Promueve un sueño reparador, nutre el sistema nervioso y fortalece la memoria y concentración.', 20.00, 160.00, 'https://images.pexels.com/photos/373888/pexels-photo-373888.jpeg?auto=compress&cs=tinysrgb&w=800', 'Para toda la familia', 4, 1),
('Spica Tea (Té Herbal)', 'Tés e Infusiones', 'Infusión milenaria con cinco hierbas tradicionales chinas incluyendo Spica Prunellae, cáscara de mandarina y Ganoderma.', 'Refresca el sistema digestivo, calma dolores de garganta y ayuda a regular la temperatura corporal.', 14.00, 130.00, 'https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&cs=tinysrgb&w=800', '100% Natural', 5, 0),
('Café con Cordyceps', 'Bebidas Energéticas', 'Café de aroma seductor formulado con extracto de Cordyceps Sinensis. Diseñado para deportistas y jornadas exigentes.', 'Aumenta la oxigenación celular, resistencia física, vigor y protección renal y pulmonar.', 24.00, 190.00, 'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&w=800', 'Energía Pura', 6, 1);

-- Nosotros
INSERT INTO nosotros (seccion, titulo, subtitulo, contenido, imagen, icono, orden) VALUES
('historia', 'Nuestra Historia & Pasión', 'De la naturaleza a tu taza en Cochabamba', 'DXN CoffeeHouse nació con el sueño de ofrecer un espacio acogedor donde el placer de tomar un café delicioso se una a la salud integral. Fundada bajo la filosofía de DXN International —líder mundial en el cultivo biológico de Ganoderma Lucidum— nuestra cafetería en Cochabamba selecciona los mejores granos y los fusiona con hierbas milenarias para entregarte bienestar en cada sorbo. Nos enorgullece ser un punto de encuentro para familias, emprendedores y amantes del buen café.', 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1200', 'bi-compass', 1),
('ganoderma', 'El Rey de las Hierbas: Ganoderma Lucidum', 'Milenios de sabiduría oriental aplicados a tu salud', 'Conocido en Asia como "El Hongo de la Inmortalidad" o Lingzhi, el Ganoderma Lucidum contiene más de 400 nutrientes activos y 150 antioxidantes. A diferencia del café común que puede irritar el estómago o provocar taquicardia, el café DXN neutraliza la acidez y ayuda a desintoxicar las células, regular la presión arterial y vigorizar el sistema inmunológico.', 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1200', 'bi-shield-check', 2),
('mision_vision', 'Nuestra Misión y Visión', 'Bienestar, calidad y calidez humana', 'Nuestra misión es transformar la rutina diaria del café en un hábito de nutrición y bienestar preventivo, brindando un servicio cálido en un ambiente inspirador. Aspiramos a ser el referente número uno de cafeterías saludables en Bolivia, cultivando una comunidad apasionada por la vida activa y consciente.', 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=1200', 'bi-eye', 3),
('tienda', 'Nuestra Tienda & Experiencia en Cochabamba', 'Un espacio diseñado para tus mejores momentos', 'Ubicados en el corazón de Cochabamba, contamos con instalaciones modernas diseñadas para desconectar del ritmo acelerado de la ciudad. Podrás saborear tu bebida en barra o cómodos sillones, explorar nuestro anaquel con la línea completa de productos DXN y recibir el asesoramiento de nuestros baristas certificados.', 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1200', 'bi-shop', 4);

-- Precios y Combos
INSERT INTO precios (titulo, categoria, precio, periodo, descripcion, caracteristicas, destacado, boton_texto, orden) VALUES
('Taza Individual Barista', 'Cafetería', 15.00, 'por taza', 'Ideal para tu dosis diaria de energía saludable preparada fresca al instante.', '["1 Taza de Café Lingzhi o Té a elección", "Preparación en barra con leche vegetal opcional", "Galleta artesanal de cortesía", "Acceso libre a WiFi de alta velocidad"]', 0, 'Pedir en Barra', 1),
('Combo Degustación DXN', 'Promoción Especial', 35.00, 'por combo', 'La mejor forma de probar y comparar nuestras variedades más queridas.', '["2 Tazas Gourmet (Lingzhi 3 en 1 + Zhi Mocha)", "1 Porción de repostería saludable", "Muestra informativa sobre beneficios del Ganoderma", "Asesoría personalizada con nuestro barista"]', 1, 'Ordenar Combo', 2),
('Pack Familiar Bienestar', 'Para Llevar', 180.00, 'por paquete', 'Llévate tus productos favoritos a casa con un descuento exclusivo por paquete.', '["1 Caja completa de Café Lingzhi 2 en 1 o 3 en 1", "1 Caja de Cocozhi o Spica Tea", "1 Taza térmica exclusiva DXN CoffeeHouse", "Guía de preparación y recetas saludables"]', 0, 'Llevar Pack', 3),
('Membresía Socio DXN', 'Membresía Vitalicia', 250.00, 'pago único', 'Únete a la familia global DXN con código internacional y precios mayoristas.', '["Descuento de por vida de hasta el 40% en toda la línea", "Kit de bienvenida con muestras y catálogo oficial", "Código internacional de distribuidor independiente", "Acceso a capacitaciones gratuitas de salud y negocio"]', 1, 'Afiliarme Ahora', 4);

-- Galería de Fotos del Local y Productos
INSERT INTO galeria (titulo, descripcion, categoria, imagen, orden) VALUES
('Barra de Café y Baristas', 'Nuestros baristas preparando un espresso Lingzhi perfecto', 'Cafetería', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800', 1),
('Ambiente Acogedor y Cómodo', 'Salón principal con iluminación cálida y música relajante', 'Local', 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800', 2),
('Variedad de Bebidas DXN', 'Presentación de bebidas frías y calientes con Ganoderma', 'Productos', 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=800', 3),
('Espacio de Lectura y Coworking', 'Mesas equipadas para concentrarte y disfrutar', 'Local', 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=800', 4),
('Cuidado en los Detalles', 'Tostado artesanal y emulsión suave en cada taza', 'Cafetería', 'https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg?auto=compress&cs=tinysrgb&w=800', 5),
('Área de Tienda DXN', 'Estanterías con toda la línea oficial de nutrición y bienestar', 'Tienda', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=800', 6);

-- Contacto de muestra
INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES
('Carlos Mendoza', 'carlos.mendoza@gmail.com', '+591 76543210', 'Consulta sobre Membresía', 'Hola, me gustaría saber cómo puedo afiliarme como distribuidor de café DXN y si tienen catálogo de precios para provincia.');
