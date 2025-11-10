// utils/errorSuppression.ts
"use client";

/**
 * Configuración global para suprimir errores de lógica de negocio
 * en el overlay de desarrollo de Next.js
 */

// Solo ejecutar en el cliente y en desarrollo
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Lista de mensajes de error que queremos suprimir
  const businessLogicErrorMessages = [
    "Invalid current password",
    "User not found", 
    "Division code already exists",
    "Program code already exists",
    "BusinessLogicError",
    "Request failed with status code 400",
    "Request failed with status code 404",
    "Request failed with status code 422"
  ];

  // Función para verificar si un error es de lógica de negocio
  const isBusinessLogicError = (error: any): boolean => {
    if (!error) return false;
    
    // Verificar si tiene la marca explícita
    if (error.isBusinessLogicError) return true;
    
    // Verificar por el mensaje
    const message = error.message || error.toString();
    return businessLogicErrorMessages.some(msg => 
      message.includes(msg)
    );
  };

  // Interceptar errores globales
  const originalErrorHandler = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (isBusinessLogicError(error) || isBusinessLogicError({ message })) {
      return true; // Suprimir el error
    }
    
    if (originalErrorHandler) {
      return originalErrorHandler.call(window, message, source, lineno, colno, error);
    }
    return false;
  };

  // Interceptar promesas rechazadas
  const originalUnhandledRejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event) {
    if (isBusinessLogicError(event.reason)) {
      event.preventDefault();
      return;
    }
    
    if (originalUnhandledRejection) {
      originalUnhandledRejection.call(window, event);
    }
  };

  // Interceptar console.error (esto evita que aparezca en la consola)
  const originalConsoleError = console.error;
  console.error = function(...args: any[]) {
    const firstArg = args[0];
    
    // Si es un error de lógica de negocio, no mostrarlo
    if (isBusinessLogicError(firstArg)) {
      return;
    }
    
    // Si el mensaje contiene palabras clave de errores de negocio
    const message = args.join(" ");
    if (businessLogicErrorMessages.some(msg => message.includes(msg))) {
      return;
    }
    
    // Para otros errores, mostrar normalmente
    originalConsoleError.apply(console, args);
  };
}

export {};