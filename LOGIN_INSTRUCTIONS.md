# Instrucciones de Login Temporal

El sistema está configurado con usuarios temporales para pruebas. Use las siguientes credenciales:

## Usuarios Disponibles:

### Administrador
- **Email:** admin@healthcenter.com
- **Password:** 123456
- **Acceso:** Todas las secciones

### Médico
- **Email:** medico@healthcenter.com
- **Password:** 123456
- **Acceso:** Dashboard, Pacientes, Detalles de pacientes, Mensajes, Calendario, Pagos, Configuración

### Enfermera
- **Email:** enfermera@healthcenter.com
- **Password:** 123456
- **Acceso:** Dashboard, Pacientes, Detalles de pacientes, Anuncios, Calendario, Requisiciones, Configuración

### Familiar
- **Email:** familiar@healthcenter.com
- **Password:** 123456
- **Acceso:** Dashboard, Detalles de pacientes (solo su familiar asignado), Mensajes, Calendario, Pagos, Configuración

## Notas:
- Los datos se guardan temporalmente en localStorage
- Para cerrar sesión, use el botón correspondiente en la interfaz
- Los pacientes ya están cargados en la base de datos de Supabase
- Las enfermeras y médicos pueden ver todos los pacientes
- Los administradores tienen acceso completo al sistema