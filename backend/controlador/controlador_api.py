from fastapi import APIRouter, Request, HTTPException, Body, Path
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import psycopg2
import psycopg2.extras
import json
import pytz

from modelo.base_de_datos import (
    insertar_usuario,
    verificar_usuario,
    obtener_conexion,
    verificar_usuario_login,
    verificar_usuario_admin,
    obtener_todos_los_usuarios,
    obtener_datos_usuario,
    eliminar_usuario,
    guardar_resultado,
    obtener_resultados_usuario,
    obtener_resultado_por_id,
)

from modelo.predictor import predecir_nivel

router = APIRouter()

# Esquemas para recibir datos desde el frontend
class UsuarioRegistro(BaseModel):
    email: str
    username: str
    password: str
    codigo_estudiantil: str
    nombres: str
    apellido_paterno: str
    apellido_materno: str
    facultad: str
    escuela: str
    anio_estudio: int
    edad: int
    genero: str
    ciclo: str

class AdminLogin(BaseModel):
    admin: str
    passwordAdmin: str

class UsuarioLogin(BaseModel):
    username: str
    password: str

class RespuestaPregunta(BaseModel):
    numero: int
    respuesta: int

class RespuestasTest(BaseModel):
    respuestas: list[int]

# Registro de usuario
@router.post("/api/registro")
def registrar_usuario(datos: UsuarioRegistro):
    if verificar_usuario(datos.username):  # <-- llamada real al modelo
        raise HTTPException(status_code=409, detail="El username ya está en uso")
    
    correo_institucional = f"{datos.codigo_estudiantil}@unfv.edu.pe"

    datos_ordenados = (
        datos.nombres,
        datos.apellido_paterno,
        datos.apellido_materno,
        datos.edad,
        datos.email,
        datos.codigo_estudiantil,
        correo_institucional,
        datos.anio_estudio,
        datos.facultad,
        datos.escuela,
        datos.genero,
        datos.ciclo,
        datos.username,
        datos.password
    )

    insertar_usuario(datos_ordenados)
    return {"mensaje": "Registro exitoso"}

# Login
@router.post("/api/login")
def login(datos: UsuarioLogin, request: Request):
    user = verificar_usuario_login(datos.username, datos.password)
    if user:
        request.session["username"] = datos.username
        return {"mensaje": "Login exitoso", "usuario": datos.username}
    else:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
    
@router.post("/api/loginAdmin")
def login(datos: AdminLogin):
    admin = verificar_usuario_admin(datos.admin, datos.passwordAdmin)
    if admin:
        # No se guarda en sesión
        return {"mensaje": "Ingreso como admin con éxito", "usuario": datos.admin}
    else:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")


@router.get("/api/logout")
def cerrar_sesion(request: Request):
    request.session.clear()
    return {"mensaje": "Sesión cerrada"}

@router.get("/api/debug/usuarios")
def debug_usuarios():
    conexion = obtener_conexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT username FROM usuarios")
    usuarios = cursor.fetchall()
    cursor.close()
    conexion.close()
    return {"usuarios": usuarios}

# Obtener usuario actual
@router.get("/api/usuario/actual")
def obtener_usuario_actual(request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")
    return {"usuario": username}

# Perfil del usuario
@router.get("/api/usuario/perfil")
def obtener_perfil(request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    datos = obtener_datos_usuario(username)
    if datos:
        return {"perfil": datos}
    else:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
@router.get("/api/usuarios/todos")
def obtener_todos_los_usuarios():
    conn = obtener_conexion()
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute('''
        SELECT username, genero, edad, facultad, escuela, ciclo, anio_estudio
        FROM usuarios
    ''')
    usuarios = cursor.fetchall()
    cursor.close()
    conn.close()

    # Devuelve como lista de diccionarios
    return {"usuarios": [dict(u) for u in usuarios]}



# Eliminar usuario
@router.delete("/api/usuario/{username}")
def eliminar_cuenta(username: str):
    eliminar_usuario(username)
    return JSONResponse({"status": "ok", "message": "Cuenta eliminada"})

@router.post("/api/eliminar_usuario")
def eliminar_cuenta_sesion(request: Request):
    username = request.session.get("username")
    if username:
        eliminar_usuario(username)
        request.session.clear()
        return {"mensaje": "Cuenta eliminada"}
    raise HTTPException(status_code=401, detail="No autenticado")

# Obtener todas las preguntas del test
@router.get("/api/preguntas")
def obtener_preguntas():
    preguntas = [
        "¿Has sentido hormigueo o adormecimiento en manos, pies u otras partes del cuerpo al enfrentar exigencias académicas?",
        "¿Has experimentado una sensación de calor repentino durante clases, evaluaciones o presentaciones?",
        "¿Te ha costado relajarte por la carga académica o tus responsabilidades universitarias?",
        "¿Has tenido miedo intenso de que algo muy negativo ocurra con tus estudios o futuro profesional?",
        "¿Has sentido mareos o inestabilidad mientras piensas en tareas, exámenes o prácticas?",
        "¿Has notado que tu corazón late muy rápido o con fuerza al afrontar retos universitarios?",
        "¿Te has sentido inestable o como si estuvieras a punto de perder el equilibrio por presión académica?",
        "¿Has experimentado un miedo intenso o pánico antes o durante alguna situación universitaria importante?",
        "¿Te has sentido muy nervioso o inquieto al participar en actividades académicas o sociales en la universidad?",
        "¿Has tenido sensación de que te falta el aire o de asfixia durante momentos de mucho estrés en la universidad?",
        "¿Has notado temblores en tus manos, piernas u otras partes del cuerpo por situaciones académicas estresantes?",
        "¿Has sentido miedo de perder el control durante una exposición, examen o clase importante?",
        "¿Has experimentado dificultad para respirar al pensar en tus obligaciones académicas o tu rendimiento?",
        "¿Has sentido miedo intenso a morir o a que te pase algo grave debido a la presión de los estudios?",
        "¿Has sentido una opresión o nudo en la garganta cuando estás bajo mucha presión académica?",
        "¿Has tenido temblores en todo el cuerpo al enfrentar situaciones como exámenes u orales?",
        "¿Has tenido malestar estomacal, náuseas o indigestión antes o después de enfrentar demandas académicas?",
        "¿Has sentido debilidad en brazos o piernas durante momentos de tensión académica?",
        "¿Te has enrojecido o sentido calor facial cuando participas en clase o eres evaluado?",
        "¿Has sudado repentinamente sin causa física aparente, especialmente en situaciones universitarias estresantes?",
        "¿Has sentido miedo de volverte loco o hacer algo incontrolable durante momentos de ansiedad por los estudios?"
    ]
    return JSONResponse({"preguntas": preguntas})

# Obtener pregunta específica por número
@router.get("/api/test/pregunta/{numero}")
def obtener_pregunta(numero: int, request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    preguntas = [
        "¿Has sentido hormigueo o adormecimiento en manos, pies u otras partes del cuerpo al enfrentar exigencias académicas?",
        "¿Has experimentado una sensación de calor repentino durante clases, evaluaciones o presentaciones?",
        "¿Te ha costado relajarte por la carga académica o tus responsabilidades universitarias?",
        "¿Has tenido miedo intenso de que algo muy negativo ocurra con tus estudios o futuro profesional?",
        "¿Has sentido mareos o inestabilidad mientras piensas en tareas, exámenes o prácticas?",
        "¿Has notado que tu corazón late muy rápido o con fuerza al afrontar retos universitarios?",
        "¿Te has sentido inestable o como si estuvieras a punto de perder el equilibrio por presión académica?",
        "¿Has experimentado un miedo intenso o pánico antes o durante alguna situación universitaria importante?",
        "¿Te has sentido muy nervioso o inquieto al participar en actividades académicas o sociales en la universidad?",
        "¿Has tenido sensación de que te falta el aire o de asfixia durante momentos de mucho estrés en la universidad?",
        "¿Has notado temblores en tus manos, piernas u otras partes del cuerpo por situaciones académicas estresantes?",
        "¿Has sentido miedo de perder el control durante una exposición, examen o clase importante?",
        "¿Has experimentado dificultad para respirar al pensar en tus obligaciones académicas o tu rendimiento?",
        "¿Has sentido miedo intenso a morir o a que te pase algo grave debido a la presión de los estudios?",
        "¿Has sentido una opresión o nudo en la garganta cuando estás bajo mucha presión académica?",
        "¿Has tenido temblores en todo el cuerpo al enfrentar situaciones como exámenes u orales?",
        "¿Has tenido malestar estomacal, náuseas o indigestión antes o después de enfrentar demandas académicas?",
        "¿Has sentido debilidad en brazos o piernas durante momentos de tensión académica?",
        "¿Te has enrojecido o sentido calor facial cuando participas en clase o eres evaluado?",
        "¿Has sudado repentinamente sin causa física aparente, especialmente en situaciones universitarias estresantes?",
        "¿Has sentido miedo de volverte loco o hacer algo incontrolable durante momentos de ansiedad por los estudios?"
    ]

    if 1 <= numero <= len(preguntas):
        pregunta = preguntas[numero - 1]
        return JSONResponse({
            "numero": numero,
            "pregunta": pregunta,
            "total_preguntas": len(preguntas),
            "siguiente": numero + 1 if numero < len(preguntas) else None,
            "anterior": numero - 1 if numero > 1 else None
        })
    else:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

# Responder pregunta específica
@router.post("/api/test/pregunta/{numero}")
def responder_pregunta(numero: int, respuesta: RespuestaPregunta, request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    if "respuestas" not in request.session:
        request.session["respuestas"] = []

    respuestas = request.session["respuestas"]

    # Si se está modificando una respuesta anterior
    if len(respuestas) >= numero:
        respuestas[numero - 1] = respuesta.respuesta
    else:
        # Completar respuestas faltantes con 0 si es necesario
        while len(respuestas) < numero - 1:
            respuestas.append(0)
        respuestas.append(respuesta.respuesta)

    request.session["respuestas"] = respuestas

    return JSONResponse({
        "mensaje": "Respuesta guardada",
        "numero": numero,
        "respuesta": respuesta.respuesta,
        "total_respondidas": len(respuestas),
        "puede_continuar": numero < 21,
        "test_completado": numero == 21 and len(respuestas) == 21
    })

# Procesar resultado completo del test
@router.post("/api/test/resultado")
def procesar_resultado(request: Request, data: RespuestasTest):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    respuestas = data.respuestas
    if len(respuestas) != 21:
        raise HTTPException(status_code=400, detail="Se esperaban 21 respuestas")

    nivel = predecir_nivel(respuestas)
    request.session["resultado"] = nivel
    guardar_resultado(username, respuestas, nivel)

    # Limpiar respuestas de la sesión
    if "respuestas" in request.session:
        del request.session["respuestas"]

    recomendacion = generar_recomendacion(nivel)

    return JSONResponse({
        "status": "ok",
        "resultado": nivel,
        "recomendacion": recomendacion,
        "total": sum(respuestas)
    })

# Obtener resultado desde sesión
@router.get("/api/test/resultado")
def mostrar_resultado(request: Request):
    resultado = request.session.get("resultado")
    if not resultado:
        raise HTTPException(status_code=404, detail="No hay resultado en sesión")

    recomendacion = generar_recomendacion(resultado)

    return JSONResponse({
        "resultado": resultado,
        "recomendacion": recomendacion
    })

# Obtener respuestas actuales del test en progreso
@router.get("/api/test/respuestas")
def obtener_respuestas_actuales(request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    respuestas = request.session.get("respuestas", [])
    return JSONResponse({
        "respuestas": respuestas,
        "total_respondidas": len(respuestas),
        "pregunta_actual": len(respuestas) + 1 if len(respuestas) < 21 else 21
    })

# Reiniciar test
@router.delete("/api/test/respuestas")
def reiniciar_test(request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    if "respuestas" in request.session:
        del request.session["respuestas"]
    if "resultado" in request.session:
        del request.session["resultado"]

    return JSONResponse({"mensaje": "Test reiniciado"})

# Historial de resultados
@router.get("/api/historial/{username}")
def obtener_historial(request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    resultados_crudos = obtener_resultados_usuario(username)

    resultados = []
    for r in resultados_crudos:
        respuestas = json.loads(r["respuestas"])
        resultados.append({
            "id": r["id"],
            "resultado": r["resultado"],
            "fecha": r["fecha"].strftime("%d/%m/%Y") if hasattr(r["fecha"], "strftime") else str(r["fecha"]),
            "hora": r["hora"].strftime("%H:%M") if hasattr(r["hora"], "strftime") else str(r["hora"]),
            "total": sum(respuestas)
        })

    return JSONResponse({"status": "ok", "resultados": resultados})

# Progreso estadístico
@router.get("/api/progreso")
def obtener_progreso(request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    resultados = obtener_resultados_usuario(username)

    if not resultados:
        return JSONResponse({
            "promedio": "No hay resultados aún",
            "fechas": [],
            "niveles": [],
            "frecuencia": {}
        })

    nivel_a_num = {"Mínimo": 0, "Leve": 1, "Moderado": 2, "Severo": 3}
    num_a_nivel = ["Mínimo", "Leve", "Moderado", "Severo"]

    niveles = []
    fechas = []
    frecuencia = {"Mínimo": 0, "Leve": 0, "Moderado": 0, "Severo": 0}
    suma = 0

    for r in resultados:
        nivel = r["resultado"]
        fecha = str(r["fecha"])
        valor = nivel_a_num.get(nivel, 0)
        suma += valor
        niveles.append(valor)
        fechas.append(fecha)
        if nivel in frecuencia:
            frecuencia[nivel] += 1

    promedio_val = suma / len(niveles)
    promedio = num_a_nivel[round(promedio_val)]

    return JSONResponse({
        "promedio": promedio,
        "fechas": fechas,
        "niveles": niveles,
        "frecuencia": frecuencia
    })

# Progreso estadístico por usuario específico
@router.get("/api/progreso/{username}")
def progreso_usuario(username: str):
    resultados = obtener_resultados_usuario(username)

    if not resultados:
        return JSONResponse({
            "promedio": "No hay resultados aún",
            "fechas": [],
            "niveles": [],
            "frecuencia": {}
        })

    nivel_a_num = {"Mínimo": 0, "Leve": 1, "Moderado": 2, "Severo": 3}
    num_a_nivel = ["Mínimo", "Leve", "Moderado", "Severo"]

    niveles = []
    fechas = []
    frecuencia = {"Mínimo": 0, "Leve": 0, "Moderado": 0, "Severo": 0}
    suma = 0

    for r in resultados:
        nivel = r["resultado"]
        fecha = str(r["fecha"])
        valor = nivel_a_num.get(nivel, 0)
        suma += valor
        niveles.append(valor)
        fechas.append(fecha)
        if nivel in frecuencia:
            frecuencia[nivel] += 1

    promedio_val = suma / len(niveles)
    promedio = num_a_nivel[round(promedio_val)]

    return JSONResponse({
        "promedio": promedio,
        "fechas": fechas,
        "niveles": niveles,
        "frecuencia": frecuencia
    })

# Detalle de resultado
@router.get("/api/detalle/{id_resultado}")
def detalle_resultado(id_resultado: int, request: Request):
    username = request.session.get("username")
    if not username:
        raise HTTPException(status_code=401, detail="No autenticado")

    resultado = obtener_resultado_por_id(id_resultado)
    if not resultado:
        raise HTTPException(status_code=404, detail="Resultado no encontrado")

    respuestas = json.loads(resultado["respuestas"])
    lima = pytz.timezone("America/Lima")
    fecha_lima = resultado["fecha"].astimezone(lima)

    resultado_dict = {
        "resultado": resultado["resultado"],
        "fecha": fecha_lima.strftime("%d/%m/%Y"),
        "hora": fecha_lima.strftime("%H:%M"),
        "total": sum(respuestas),
    }

    preguntas = [
        "¿Has sentido hormigueo o adormecimiento en manos, pies u otras partes del cuerpo al enfrentar exigencias académicas?",
        "¿Has experimentado una sensación de calor repentino durante clases, evaluaciones o presentaciones?",
        "¿Te ha costado relajarte por la carga académica o tus responsabilidades universitarias?",
        "¿Has tenido miedo intenso de que algo muy negativo ocurra con tus estudios o futuro profesional?",
        "¿Has sentido mareos o inestabilidad mientras piensas en tareas, exámenes o prácticas?",
        "¿Has notado que tu corazón late muy rápido o con fuerza al afrontar retos universitarios?",
        "¿Te has sentido inestable o como si estuvieras a punto de perder el equilibrio por presión académica?",
        "¿Has experimentado un miedo intenso o pánico antes o durante alguna situación universitaria importante?",
        "¿Te has sentido muy nervioso o inquieto al participar en actividades académicas o sociales en la universidad?",
        "¿Has tenido sensación de que te falta el aire o de asfixia durante momentos de mucho estrés en la universidad?",
        "¿Has notado temblores en tus manos, piernas u otras partes del cuerpo por situaciones académicas estresantes?",
        "¿Has sentido miedo de perder el control durante una exposición, examen o clase importante?",
        "¿Has experimentado dificultad para respirar al pensar en tus obligaciones académicas o tu rendimiento?",
        "¿Has sentido miedo intenso a morir o a que te pase algo grave debido a la presión de los estudios?",
        "¿Has sentido una opresión o nudo en la garganta cuando estás bajo mucha presión académica?",
        "¿Has tenido temblores en todo el cuerpo al enfrentar situaciones como exámenes u orales?",
        "¿Has tenido malestar estomacal, náuseas o indigestión antes o después de enfrentar demandas académicas?",
        "¿Has sentido debilidad en brazos o piernas durante momentos de tensión académica?",
        "¿Te has enrojecido o sentido calor facial cuando participas en clase o eres evaluado?",
        "¿Has sudado repentinamente sin causa física aparente, especialmente en situaciones universitarias estresantes?",
        "¿Has sentido miedo de volverte loco o hacer algo incontrolable durante momentos de ansiedad por los estudios?"
    ]

    opciones = ["NUNCA", "CASI NUNCA", "A VECES", "CASI SIEMPRE"]

    return JSONResponse({
        "resultado": resultado_dict,
        "respuestas": respuestas,
        "preguntas": preguntas,
        "opciones": opciones
    })

def generar_recomendacion(nivel):
    recomendaciones = {
        "Severo": "Te recomendamos buscar ayuda profesional lo antes posible. Tu salud mental es prioridad.",
        "Moderado": "Muestras signos moderados de ansiedad. Considera hablar con un especialista.",
        "Leve": "Tienes síntomas leves de ansiedad. Vigila tus emociones y practica autocuidado.",
        "Mínimo": "No presentas síntomas significativos de ansiedad. ¡Sigue cuidando tu bienestar!",
    }
    return recomendaciones.get(nivel, "No se pudo determinar tu nivel de ansiedad. Intenta realizar el test nuevamente.")