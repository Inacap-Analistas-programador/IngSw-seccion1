/**
 * SGICS - Sistema de Gestión Integral de Cursos Scout
 * Punto de entrada principal del frontend Vue.js
 *
 * Responsabilidades de este archivo:
 * - Crear y configurar la aplicación (Pinia + Router)
 * - Cargar estilos globales
 * - Configurar Axios para manejar autenticación con JWT (Authorization + refresh)
 * - Montar la aplicación en el elemento #app
 */

import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import App from "./App.vue";
import axios from "axios";
import "./index.css";

// Inicializa la cabecera Authorization de Axios si ya existe un token guardado
const existingToken = localStorage.getItem("access_token");
if (existingToken) {
	axios.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
}

// Interceptor de respuestas para refrescar token automáticamente:
// - Si el backend responde 401 (no autorizado), intenta usar refresh_token una sola vez.
// - Si el refresh falla o no existe refresh_token, limpia credenciales y redirige a /login
axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const refresh = localStorage.getItem("refresh_token");
				if (!refresh) {
					throw new Error("No refresh token");
				}
				const { refreshToken } = await import("./services/auth");
				const { access } = await refreshToken(refresh);
				localStorage.setItem("access_token", access);
				axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
				originalRequest.headers = {
					...(originalRequest.headers || {}),
					Authorization: `Bearer ${access}`,
				};
				return axios(originalRequest);
			} catch (e) {
				// Limpiar tokens y redirigir a login
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				const loginUrl = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`;
				window.location.href = loginUrl;
			}
		}
		return Promise.reject(error);
	}
);

// Crear instancia principal de la aplicación Vue
const app = createApp(App);

// Configurar gestión de estado con Pinia
// Pinia maneja el estado global de la aplicación (usuario, datos compartidos)
app.use(createPinia());

// Configurar enrutamiento con Vue Router
// El router maneja la navegación entre diferentes páginas/vistas
app.use(router);

// Montar la aplicación en el DOM
// Se conecta al elemento <div id="app"> en index.html
app.mount("#app");
