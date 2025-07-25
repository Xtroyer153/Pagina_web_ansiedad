from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from controlador.controlador_api import router
from modelo.base_de_datos import crear_tablas


app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key="una_clave_secreta_muy_segura")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

crear_tablas()

app.include_router(router)