// ==========================================================
// 1. VARIABLES GLOBALES Y FUNCIONES DEL MODAL
// ==========================================================

let productoSeleccionado = {
    nombre: "",
    precio: 0, // Usar un número para el precio unitario
    talla: "",
    cantidad: 1, 
    descripcion: ""
};

const modal = document.getElementById('modal');
// VINCULADO AL NUEVO ID: whatsappPedidoBtn
const whatsappPedidoBtn = document.getElementById('whatsappPedidoBtn'); 
const tallaButtons = document.querySelectorAll('.talla-btn');
const qtyInput = document.getElementById('qty-input'); 


// Función auxiliar para limpiar y convertir el precio a número
function parsePrice(priceString) {
    // Elimina el símbolo de moneda, el texto 'MXN', y la coma decimal si existe
    let cleanString = priceString.replace('$', '').replace(' MXN', '').replace('.', '').trim();
    return parseInt(cleanString, 10);
}

// Función para abrir el modal con la información del producto
function verProducto(nombre, imagen, precioString, material, estilo, descripcion) {
    // 1. Actualización visual del modal
    document.getElementById('modal-img').src = imagen;
    document.getElementById('modal-nombre').textContent = nombre;
    document.getElementById('modal-precio').textContent = precioString;
    document.getElementById('modal-material').textContent = material.charAt(0).toUpperCase() + material.slice(1);
    document.getElementById('modal-estilo').textContent = estilo.charAt(0).toUpperCase() + estilo.slice(1);
    document.getElementById('modal-descripcion').textContent = descripcion;
    
    // 2. Inicializar y resetear datos del producto
    productoSeleccionado.nombre = nombre;
    productoSeleccionado.precio = parsePrice(precioString); // GUARDAR EL PRECIO COMO NÚMERO
    productoSeleccionado.descripcion = descripcion;
    productoSeleccionado.talla = ""; 
    productoSeleccionado.cantidad = 1; 
    
    // 3. Resetear visualmente el modal
    qtyInput.value = 1; // Asegurar que el input de cantidad muestre 1
    tallaButtons.forEach(btn => btn.classList.remove('seleccionada'));
    
    // Texto inicial del botón
    whatsappPedidoBtn.textContent = 'SELECCIONA UNA TALLA'; 
    whatsappPedidoBtn.disabled = true;
    
    modal.style.display = 'flex'; 
}

// Función para cerrar el modal
function cerrarModal() {
    modal.style.display = 'none';
}

// ==========================================================
// 2. FUNCIÓN DE SELECCIÓN DE TALLA
// ==========================================================

tallaButtons.forEach(button => {
    button.addEventListener('click', function() {
        tallaButtons.forEach(btn => btn.classList.remove('seleccionada'));
        this.classList.add('seleccionada');
        productoSeleccionado.talla = this.getAttribute('data-talla');
        
        // Texto del botón al seleccionar talla
        whatsappPedidoBtn.textContent = 'PEDIR POR WHATSAPP'; 
        whatsappPedidoBtn.disabled = false;
    });
});

// ==========================================================
// 3. FUNCIÓN CRUCIAL DE CANTIDAD (CAMBIAR CANTIDAD)
// ==========================================================

function cambiarCantidad(cambio) {
    let cantidadActual = parseInt(qtyInput.value, 10);
    
    let nuevaCantidad = cantidadActual + cambio;
    
    if (nuevaCantidad >= 1) {
        qtyInput.value = nuevaCantidad;
        productoSeleccionado.cantidad = nuevaCantidad; // Actualizar el objeto de producto
    }
}

// ==========================================================
// 4. FUNCIÓN PARA GENERAR PEDIDO EN WHATSAPP (MEJORADO)
// ==========================================================

whatsappPedidoBtn.addEventListener('click', function() { 
    if (productoSeleccionado.talla === "") {
        alert("Por favor, selecciona una talla antes de continuar.");
        return;
    }

    const totalEstimado = productoSeleccionado.precio * productoSeleccionado.cantidad;
    
    // Formatear el precio de vuelta a formato de moneda local con comas (p. ej., 1.500)
    const precioUnitarioFormateado = `$${productoSeleccionado.precio.toLocaleString('es-MX')} MXN`;
    const totalEstimadoFormateado = `$${totalEstimado.toLocaleString('es-MX')} MXN`;

    // Mensaje de WhatsApp más claro y formal
    const mensaje = `¡Hola, GorrasShop! 🎩 Me interesa realizar un pedido para *entrega personal en Taxco*.

Aquí están los detalles de la gorra:
--------------------------------
*Artículo:* ${productoSeleccionado.nombre}
*Talla:* ${productoSeleccionado.talla}
*Cantidad:* ${productoSeleccionado.cantidad}
*Precio Unitario:* ${precioUnitarioFormateado}
*Total Estimado:* ${totalEstimadoFormateado}
--------------------------------

Por favor, ayúdame a confirmar la disponibilidad y el punto de encuentro para la entrega. ¡Gracias!`;
    
    const urlWhatsApp = `https://wa.me/527331006981?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
    
    cerrarModal();
});


// ==========================================================
// 5. FUNCIÓN DE FILTRADO
// ==========================================================

function filtrarProductos() {
    const material = document.getElementById('filtro-material').value;
    const estilo = document.getElementById('filtro-estilo').value;
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const cardMaterial = card.getAttribute('data-material');
        const cardEstilo = card.getAttribute('data-estilo');
        
        const pasaMaterial = material === 'todos' || cardMaterial === material;
        const pasaEstilo = estilo === 'todos' || cardEstilo === estilo;

        if (pasaMaterial && pasaEstilo) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Escuchar cambios en los selectores de filtro
document.getElementById('filtro-material').addEventListener('change', filtrarProductos);
document.getElementById('filtro-estilo').addEventListener('change', filtrarProductos);


// ==========================================================
// 6. CERRAR MODAL AL HACER CLIC FUERA
// ==========================================================

window.onclick = function(event) {
    if (event.target == modal) {
        cerrarModal();
    }
}