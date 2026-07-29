# YINtrack

Sistema de tickets de servicio técnico con notificaciones automáticas por medio de correo electrónico y Whatsapp

## Integrantes

- Noel López Herrera
- Yhudiel Mendoza Sánchez

## Descripción del proyecto

Elegimos este proyecto porque tanto mi compañero como yo brindamos servicios técnicos (reparación de equipos), y en el día a día nos dimos cuenta de que no llevamos un control ordenado de los pedidos: se nos complica saber en qué estado va cada equipo y mantener informado al cliente sin tener que estar respondiendo mensajes uno por uno.

Por eso decidimos desarrollar YINtrack, una aplicación web para llevar el control de los pedidos de servicio técnico. Antes de poder generar un folio para un equipo, es necesario que exista un cliente registrado como dueño de ese equipo. El registro del cliente puede hacerse de dos formas: de manera presencial (cuando el técnico registra el equipo nuevo en el taller) o en línea, de forma autónoma por el propio cliente.

Cada equipo recibido genera un folio único (un folio corresponde a un solo equipo), que sirve para la búsqueda y seguimiento del pedido: cualquier persona puede consultar el estado del equipo con ese folio, sin necesidad de iniciar sesión. Adicionalmente, el cliente puede iniciar sesión con su cuenta para ver de forma simultánea el estatus de todos sus pedidos activos sin tener que ingresar folio por folio, y para recibir promociones. También usamos el número de teléfono registrado del cliente para enviarle notificaciones automáticas por WhatsApp cada vez que el estado de su ticket cambia (recibido, en diagnóstico, en reparación, listo, entregado).

## Módulos principales

- roles
- usuarios
- equipos
- tickets
- historial_estados
- notificaciones
- tecnico_ticket

## Roles de usuario:

- Administrador
- Técnico
- Cliente

## Stack

- Backend: Spring Boot (Java)
- Frontend: React + Vite + Tailwind CSS
- Base de datos: MySQL
- Autenticación: JWT (Spring Security), con roles para Administrador, Técnico y Cliente
- Notificaciones: correo (JavaMailSender + Postfix), SMS y WhatsApp (Twilio)
- Pruebas de API: Bruno

## Diagrama Entidad-Relación
![Diagrama ER](assets/ERyintrack.png)
