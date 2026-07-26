// Validación de Formulario — Licorera La Cancha (basado en tutorial de FalconMasters)

const formulario = document.getElementById('formulario_n01');

const inputsTexto = document.querySelectorAll(
    '#formulario_n01 input:not([type="radio"]):not([type="submit"]):not([type="reset"]), #formulario_n01 textarea'
);

const grupoTamano = document.querySelector('input[name="PedidoTamano"]')?.closest('p');


const expresiones = {
    // Numero de entre 8 y 11 digitos
    cliente_cedula: /^\d{8,11}$/,

    // Numero de 10 digitos
    cliente_telefono: /^\d{10}$/,

    // Validacion email
    cliente_email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,

    // Numero entero entre 18 y 99
    cliente_edad: /^(1[89]|[2-9]\d)$/,

    // Texto libre, maximo 80 caracteres
    cliente_direccion: /^.{15,80}$/,

    // Minimo 4 caracteres
    pedido_nombre: /^.{4,}$/,

    // Numero entero entre 1 y 100
    pedido_id: /^([1-9]|[1-9]\d|100)$/,

    // Numero entero entre 0 y 100
    pedido_volumen_alcohol: /^(0|[1-9]\d?|100)$/,

    // Numero entre 1.000 y 500.000
    pedido_precio: /^([1-9]\d{3,5}|500000)$/,
};


const titulos = {
    cliente_nombre: 'El nombre debe contener solo letras y espacios, con un mínimo de 3 caracteres.',
    cliente_cedula: 'La cédula debe tener entre 8 y 11 dígitos numéricos.',
    cliente_telefono: 'El teléfono debe tener exactamente 10 dígitos numéricos. Ej: 3001234567',
    cliente_email: 'Ingrese un correo válido. Ej: nombre.apellido@universidad.edu.co',
    cliente_login: 'Mínimo 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula y un número',
    cliente_edad: 'La edad debe ser un número entero entre 18 y 99.',
    cliente_direccion: 'La dirección debe tener 15 y 80 caracteres. Ej: Calle 50F #21-99',
    pedido_nombre: 'El nombre del producto debe tener al menos 4 caracteres.',
    pedido_id: 'El ID debe ser un número entero entre 1 y 100.',
    pedido_volumen_alcohol: 'El volumen de alcohol debe ser un número entero entre 0 y 100.',
    pedido_precio: 'El precio debe ser un número entre 1.000 y 500.000.',
    pedido_marca: 'La marca puede tener hasta 30 caracteres.',
    PedidoTamano: 'Debe seleccionar un tamaño: 350ml, 500ml, 700ml o 1000ml.',
};

// Estado de validez de cada campo 
const camposValidos = {
    cliente_nombre: false,
    cliente_cedula: false,
    cliente_telefono: false,
    cliente_email: false,
    cliente_login: false,
    cliente_edad: false,
    cliente_direccion: false,
    pedido_nombre: false,
    pedido_id: false,
    pedido_volumen_alcohol: false,
    pedido_precio: false,
    pedido_marca: false,
};

// Funcion principal de validacion
function validarCampo(input) {
    const id = input.id;

    input.setCustomValidity('');
    const valor = input.value.trim();
    let mensaje = '';

    if (input.validity.valueMissing) {
        mensaje = 'Este campo es obligatorio.';
    } else if (input.validity.typeMismatch && input.type === 'email') {
        mensaje = titulos[id] || 'Ingrese un correo válido.';
    } else if (input.validity.patternMismatch) {
        mensaje = titulos[id] || input.title || 'Formato inválido.';
    } else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
        mensaje = input.title || titulos[id] || 'El valor está fuera del rango permitido.';
    } else if (input.validity.badInput) {
        mensaje = input.title || 'Ingrese un valor numérico válido.';
    } else {
        const regex = expresiones[id];
        if (regex && !regex.test(valor)) {
            mensaje = titulos[id] || 'Formato inválido.';
        }
    }

    if (mensaje) {
        input.setCustomValidity(mensaje);
        camposValidos[id] = false;
    } else {
        input.setCustomValidity('');
        camposValidos[id] = true;
    }

    actualizarEstadoVisual(input, !mensaje, mensaje);
}

function actualizarEstadoVisual(elemento, esValido, mensaje) {
    const contenedor = elemento.closest('p');

    if (!contenedor) {
        return;
    }

    contenedor.classList.toggle('campo-ok', esValido);
    contenedor.classList.toggle('campo-error', !esValido);
    contenedor.dataset.error = esValido ? '' : mensaje;
}

//  Validacion de los radios de tamaño 
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

    if (grupoTamano) {
        grupoTamano.classList.toggle('campo-ok', alguno);
        grupoTamano.classList.toggle('campo-error', !alguno);
        grupoTamano.dataset.error = alguno ? '' : titulos.PedidoTamano;
    }

    return alguno;
}

// Validar mientras el usuario escribe o sale del campo
inputsTexto.forEach(input => {
    input.addEventListener('input', () => validarCampo(input));
    input.addEventListener('blur', () => validarCampo(input));
});

document.querySelectorAll('input[name="PedidoTamano"]').forEach(radio => {
    radio.addEventListener('change', validarTamano);
});

// Validacion al enviar el formulario
formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    // Forzar validacion en todos los campos de texto
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
        document.querySelectorAll('#formulario_n01 p').forEach(parrafo => {
            parrafo.classList.remove('campo-ok', 'campo-error');
            parrafo.dataset.error = '';
        });
    } else {
        const primerInvalido = formulario.querySelector(':invalid');

        if (primerInvalido) {
            primerInvalido.focus();
        }
    }
});

formulario.addEventListener('reset', function () {
    Object.keys(camposValidos).forEach(k => camposValidos[k] = false);
    inputsTexto.forEach(input => input.setCustomValidity(''));
    document.querySelectorAll('input[name="PedidoTamano"]').forEach(r => r.setCustomValidity(''));
    document.querySelectorAll('#formulario_n01 p').forEach(parrafo => {
        parrafo.classList.remove('campo-ok', 'campo-error');
        parrafo.dataset.error = '';
    });
});