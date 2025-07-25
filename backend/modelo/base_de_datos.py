import psycopg2
import psycopg2.extras
import pytz
import json
import os
import urllib.parse as up

# Leer URL de Render
url = os.environ.get("DATABASE_URL")

# Descomponer URL para psycopg2
if url:
    up.uses_netloc.append("postgres")
    db_url = up.urlparse(url)
    DB_HOST = db_url.hostname
    DB_NAME = db_url.path[1:]
    DB_USER = db_url.username
    DB_PASSWORD = db_url.password
    DB_PORT = db_url.port
else:
    raise Exception("DATABASE_URL no está definida en el entorno")

def obtener_conexion():
    try:
        return psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
    except psycopg2.Error as e:
        print("Error al conectar a la base de datos:", e)
        raise

def crear_tabla_usuarios():
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            nombres TEXT NOT NULL,
            apellido_paterno TEXT NOT NULL,
            apellido_materno TEXT NOT NULL,
            codigo_estudiantil TEXT NOT NULL,
            correo_institucional TEXT NOT NULL,
            facultad TEXT NOT NULL,
            escuela TEXT NOT NULL,
            edad INTEGER NOT NULL,
            anio_estudio INTEGER NOT NULL,
            ciclo TEXT NOT NULL,
            genero TEXT NOT NULL
        );
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def crear_tabla_admin():
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS administrador (
            id SERIAL PRIMARY KEY,
            admin TEXT UNIQUE NOT NULL,
            passwordAdmin TEXT NOT NULL
        );
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def crear_tabla_resultados():
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resultados (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL,
            respuestas TEXT NOT NULL,
            resultado TEXT NOT NULL,
            fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (username) REFERENCES usuarios(username) ON DELETE CASCADE
        );
    ''')
    conn.commit()
    cursor.close()
    conn.close()

def crear_tablas():
    """Función para crear todas las tablas necesarias"""
    crear_tabla_usuarios()
    crear_tabla_admin()
    crear_tabla_resultados()
    print("Tablas creadas exitosamente")

def insertar_usuario(data):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO usuarios (
            nombres, apellido_paterno, apellido_materno,
            edad, email, codigo_estudiantil, correo_institucional,
            anio_estudio, facultad, escuela, genero, ciclo,
            username, password
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ''', data)
    conn.commit()
    cursor.close()
    conn.close()

def verificar_usuario(username):
    conexion = obtener_conexion()
    cursor = conexion.cursor()

    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (username,)) 

    usuario = cursor.fetchone()

    cursor.close()
    conexion.close()

    return usuario is not None

def obtener_todos_los_usuarios():
    conn = obtener_conexion()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute('''
        SELECT nombres, apellido_paterno, apellido_materno, edad, email, codigo_estudiantil,
               correo_institucional, anio_estudio, facultad, escuela, genero, ciclo
        FROM usuarios
    ''')
    datos = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # Convertir cada fila a diccionario
    return [dict(fila) for fila in datos]

def obtener_datos_usuario(username):
    conn = obtener_conexion()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute('''
        SELECT nombres, apellido_paterno, apellido_materno, edad, email, codigo_estudiantil,
               correo_institucional, anio_estudio, facultad, escuela, genero, ciclo
        FROM usuarios WHERE username = %s
    ''', (username,))
    datos = cursor.fetchone()
    cursor.close()
    conn.close()
    return dict(datos) if datos else None

def eliminar_usuario(username):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM usuarios WHERE username = %s', (username,))
    conn.commit()
    cursor.close()
    conn.close()

def guardar_resultado(username, respuestas, resultado):
    conn = obtener_conexion()
    cursor = conn.cursor()

    respuestas_json = json.dumps(respuestas)  # ✅ Convertir lista a texto JSON

    cursor.execute('''
        INSERT INTO resultados (username, respuestas, resultado)
        VALUES (%s, %s, %s)
    ''', (username, respuestas_json, resultado))

    conn.commit()
    cursor.close()
    conn.close()

def obtener_resultados_usuario(username):
    lima = pytz.timezone("America/Lima")

    conn = obtener_conexion()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute('''
        SELECT id, resultado, fecha, respuestas
        FROM resultados
        WHERE username = %s
        ORDER BY fecha DESC
    ''', (username,))
    resultados_raw = cursor.fetchall()
    cursor.close()
    conn.close()

    resultados = []
    for r in resultados_raw:
        fecha_utc = r["fecha"]
        fecha_lima = fecha_utc.astimezone(lima)
        resultados.append({
            "id": r["id"],
            "resultado": r["resultado"],
            "fecha": fecha_lima.strftime("%d/%m/%Y"),
            "hora": fecha_lima.strftime("%H:%M"),
            "respuestas": r["respuestas"]
        })

    return resultados

def verificar_usuario_login(username: str, password: str):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("SELECT username FROM usuarios WHERE username = %s AND password = %s", (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user  # user será None si no encontró coincidencia

def verificar_usuario_admin(admin: str, passwordAdmin: str):
    conn = obtener_conexion()
    cursor = conn.cursor()
    cursor.execute("SELECT admin FROM administrador WHERE admin = %s AND passwordAdmin = %s", (admin, passwordAdmin))
    admin = cursor.fetchone()
    cursor.close()
    conn.close()
    return admin

def obtener_resultado_por_id(id_resultado):
    conn = obtener_conexion()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute("SELECT id, resultado, fecha, respuestas FROM resultados WHERE id = %s", (id_resultado,))
    r = cursor.fetchone()
    cursor.close()
    conn.close()

    if r:
        return {
            "id": r["id"],
            "resultado": r["resultado"],
            "fecha": r["fecha"],
            "respuestas": r["respuestas"]
        }
    else:
        return None

