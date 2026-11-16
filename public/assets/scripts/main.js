/* =========================================================
   SeñaLink AI - Landing Page
   Formulario de registro / inicio de sesión
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const registro = document.getElementById('registro');
  if (!registro) return;

  /* ---------- Elementos existentes (por estructura) ---------- */
  const form = registro.querySelector('form');
  const pestanas = registro.querySelectorAll('.registro-pestanas > *');
  const tabRegistro = pestanas[0]; // "Crear cuenta"
  const tabLogin = pestanas[1];    // "Iniciar sesión"
  const textoPerfil = registro.querySelector(':scope > p');
  const contenedorPerfiles = registro.querySelector('.perfiles');
  const correo = form.querySelector('input[type="email"]');
  const clave = form.querySelector('input[type="password"]');
  const boton = form.querySelector('button[type="submit"]');

  form.noValidate = true; // validamos nosotros, con mensajes propios

  /* ---------- Mensajes creados por JS ---------- */
  function crearMensaje(despuesDe) {
    const p = document.createElement('p');
    p.style.cssText = 'color:#D93025;font-size:12px;margin:-6px 0 8px;min-height:0;';
    despuesDe.insertAdjacentElement('afterend', p);
    return p;
  }

  const errorPerfil = crearMensaje(contenedorPerfiles);
  const errorCorreo = crearMensaje(correo);
  const errorClave = crearMensaje(clave);

  const mensajeFinal = document.createElement('p');
  mensajeFinal.setAttribute('aria-live', 'polite');
  mensajeFinal.style.cssText = 'font-size:14px;font-weight:700;margin-top:10px;';
  boton.insertAdjacentElement('afterend', mensajeFinal);

  function marcarCampo(campo, conError) {
    campo.style.borderColor = conError ? '#D93025' : '';
  }

  function limpiarErrores() {
    [errorPerfil, errorCorreo, errorClave].forEach((p) => (p.textContent = ''));
    marcarCampo(correo, false);
    marcarCampo(clave, false);
    mensajeFinal.textContent = '';
  }

  /* ---------- Cambio entre Crear cuenta / Iniciar sesión ---------- */
  let modo = 'registro'; // 'registro' | 'login'

  function pintarPestana(tab, activa) {
    tab.style.cursor = 'pointer';
    tab.style.backgroundColor = activa ? '#2998DF' : '#F0F0F0';
    tab.style.color = activa ? 'white' : '';
  }

  function cambiarModo(nuevoModo) {
    modo = nuevoModo;
    const esRegistro = modo === 'registro';

    pintarPestana(tabRegistro, esRegistro);
    pintarPestana(tabLogin, !esRegistro);

    textoPerfil.style.display = esRegistro ? '' : 'none';
    contenedorPerfiles.style.display = esRegistro ? '' : 'none';
    boton.textContent = esRegistro ? 'Crear cuenta' : 'Iniciar sesión';

    limpiarErrores();
  }

  tabRegistro.addEventListener('click', (e) => {
    e.preventDefault();
    cambiarModo('registro');
  });

  tabLogin.addEventListener('click', (e) => {
    e.preventDefault();
    cambiarModo('login');
  });

  // Botones del menú superior ("Iniciar sesión" / "Crear cuenta")
  document.querySelectorAll('.botones-nav a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      const texto = enlace.textContent.trim().toLowerCase();
      cambiarModo(texto.includes('iniciar') ? 'login' : 'registro');
    });
  });

  /* ---------- Validación ---------- */
  function correoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function validar() {
    let valido = true;
    limpiarErrores();

    if (modo === 'registro') {
      const elegido = registro.querySelector('input[name="perfil"]:checked');
      if (!elegido) {
        errorPerfil.textContent = 'Selecciona tu perfil.';
        valido = false;
      }
    }

    const valorCorreo = correo.value.trim();
    if (!valorCorreo) {
      errorCorreo.textContent = 'Ingresa tu correo electrónico.';
      marcarCampo(correo, true);
      valido = false;
    } else if (!correoValido(valorCorreo)) {
      errorCorreo.textContent = 'El correo no tiene un formato válido.';
      marcarCampo(correo, true);
      valido = false;
    }

    if (!clave.value) {
      errorClave.textContent = 'Ingresa tu contraseña.';
      marcarCampo(clave, true);
      valido = false;
    } else if (modo === 'registro' && clave.value.length < 8) {
      errorClave.textContent = 'Debe tener al menos 8 caracteres.';
      marcarCampo(clave, true);
      valido = false;
    }

    return valido;
  }

  // Quita el error mientras el usuario corrige
  correo.addEventListener('input', () => {
    errorCorreo.textContent = '';
    marcarCampo(correo, false);
  });
  clave.addEventListener('input', () => {
    errorClave.textContent = '';
    marcarCampo(clave, false);
  });
  registro.querySelectorAll('input[name="perfil"]').forEach((radio) =>
    radio.addEventListener('change', () => (errorPerfil.textContent = ''))
  );

  /* ---------- Envío ---------- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validar()) {
      mensajeFinal.style.color = '#D93025';
      mensajeFinal.textContent = 'Revisa los campos marcados.';
      return;
    }

    // Aún no hay backend: se simula la respuesta
    const elegido = registro.querySelector('input[name="perfil"]:checked');
    const perfil = elegido ? elegido.parentElement.textContent.trim() : '';

    mensajeFinal.style.color = '#0A7D5A';
    mensajeFinal.textContent =
      modo === 'registro'
        ? `¡Cuenta creada! Perfil: ${perfil}. Descarga la app para comenzar.`
        : '¡Bienvenido de nuevo! Descarga la app para continuar.';

    form.reset();
  });

  cambiarModo('registro');
});
