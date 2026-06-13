// Validación de Formulario — Licorera La Cancha (basado en el patrón del tutorial de FalconMasters)

const formulario = document.getElementById('formulario_n01');

const inputsTexto = document.querySelectorAll(
    '#formulario_n01 input:not([type="radio"]):not([type="submit"]):not([type="reset"]), #formulario_n01 textarea'
);

// ─ Campos que tienen pattern nativo en el HTML ─
// Para estos, el navegador ya valida y muestra el mensaje completo
// ("Utiliza un formato que coincida..." + title como descripción).
// JS NO debe llamar setCustomValidity() en ellos, solo rastrear
// su estado leyendo input.validity.valid
const camposConPatternNativo = new Set([
    'cliente_nombre',   // pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,}"
    'cliente_login',    // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    'pedido_marca',     // pattern=".{1,30}"
]);

// ─ Expresiones regulares (solo para campos SIN pattern nativo) ─
const expresiones = {
    // Número de entre 8 y 11 dígitos
    cliente_cedula: /^\d{8,11}$/,

    // Exactamente 10 dígitos
    cliente_telefono: /^\d{10}$/,

    // Formato estándar de correo electrónico
    // (type="email" ya valida, pero setCustomValidity permite mensaje personalizado)
    cliente_email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,

    // Número entero entre 18 y 99
    cliente_edad: /^(1[89]|[2-9]\d)$/,

    // Texto libre, máximo 80 caracteres
    cliente_direccion: /^.{15,80}$/,

    // Mínimo 4 caracteres
    pedido_nombre: /^.{4,}$/,

    // Número entero entre 1 y 100
    pedido_id: /^([1-9]|[1-9]\d|100)$/,

    // Número entero entre 0 y 100
    pedido_volumen_alcohol: /^(0|[1-9]\d?|100)$/,

    // Número entre 1.000 y 500.000
    pedido_precio: /^([1-9]\d{3,5}|500000)$/,
};

// ─ Mensajes para campos SIN pattern nativo ─
const titulos = {
    cliente_cedula:         'La cédula debe tener entre 8 y 11 dígitos numéricos.',
    cliente_telefono:       'El teléfono debe tener exactamente 10 dígitos numéricos. Ej: 3001234567',
    cliente_email:          'Ingrese un correo válido. Ej: nombre.apellido@universidad.edu.co',
    cliente_edad:           'La edad debe ser un número entero entre 18 y 99.',
    cliente_direccion:      'La dirección debe tener 15 y 80 caracteres. Ej: Calle 50F #21-99',
    pedido_nombre:          'El nombre del producto debe tener al menos 4 caracteres.',
    pedido_id:              'El ID debe ser un número entero entre 1 y 100.',
    pedido_volumen_alcohol: 'El volumen de alcohol debe ser un número entero entre 0 y 100.',
    pedido_precio:          'El precio debe ser un número entre 1.000 y 500.000.',
};

// ─ Estado de validez de cada campo ─
const camposValidos = {
    cliente_nombre:         false,
    cliente_cedula:         false,
    cliente_telefono:       false,
    cliente_email:          false,
    cliente_login:          false,
    cliente_edad:           false,
    cliente_direccion:      false,
    pedido_nombre:          false,
    pedido_id:              false,
    pedido_volumen_alcohol: false,
    pedido_precio:          false,
    pedido_marca:           false,
};

// ─ Función principal de validación ─
function validarCampo(input) {
    const id = input.id;

    // Campos con pattern nativo: el navegador se encarga del mensaje.
    // JS solo lee si el campo es válido y actualiza el estado.
    if (camposConPatternNativo.has(id)) {
        camposValidos[id] = input.validity.valid;
        return;
    }

    // Campos sin pattern nativo: JS valida con regex y usa
    // setCustomValidity() para mostrar u ocultar el error.
    const regex = expresiones[id];
    if (!regex) return;

    const valor = input.value.trim();

    if (regex.test(valor)) {
        input.setCustomValidity(''); // limpia el error → campo válido
        camposValidos[id] = true;
    } else {
        input.setCustomValidity(titulos[id]); // activa el error con el mensaje
        camposValidos[id] = false;
    }
}

// ─ Validación de los radios de Tamaño ─
function validarTamano() {
    const radios = document.querySelectorAll('input[name="PedidoTamano"]');
    const alguno = [...radios].some(r => r.checked);

    radios.forEach(r => {
        if (!alguno) {
            r.setCustomValidity('Debe seleccionar un tamaño.');
        } else {
            r.setCustomValidity('');
        }
    });

    return alguno;
}

// ─ Listeners: validar mientras el usuario escribe / cambia ─
inputsTexto.forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur',  () => validarCampo(input));
});

document.querySelectorAll('input[name="PedidoTamano"]').forEach(radio => {
    radio.addEventListener('change', validarTamano);
});

// ─ Validación al enviar el formulario ─
formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    // Forzar validación en todos los campos de texto
    inputsTexto.forEach(input => validarCampo(input));

    // Validar tamaño
    const tamanoOk = validarTamano();

    // Verificar estado global
    const todosValidos = Object.values(camposValidos).every(v => v === true);

    if (todosValidos && tamanoOk) {
        alert('¡Formulario enviado exitosamente! Gracias por tu pedido.');
        formulario.reset();

        Object.keys(camposValidos).forEach(k => camposValidos[k] = false);
        inputsTexto.forEach(input => input.setCustomValidity(''));
        document.querySelectorAll('input[name="PedidoTamano"]').forEach(r => r.setCustomValidity(''));
    } else {
        // El navegador muestra el primer campo inválido con su mensaje completo
        formulario.reportValidity();
    }
});