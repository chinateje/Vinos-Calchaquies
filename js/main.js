document.addEventListener('DOMContentLoaded', () => {

  // Productos de la tienda
  const productos = [
    { id: 1, nombre: 'Blend Stones 2016 - Homenaje 62 años', precio: 20000, desc: 'Gran Corte 2015' },
    { id: 2, nombre: 'Rolling Stones Malbec 2015', precio: 10000, desc: 'Edición limitada de 2015' },
    { id: 3, nombre: 'Julio Julian Reserva', precio: 18500, desc: 'Gran Vino de 2015' }
  ];

  // Estado
  let emailUsuario = '';
  let carrito = [];
  let metodoPago = 'transferencia';

  // DOM
  const pantallaIngreso = document.getElementById('pantalla-ingreso');
  const pantallaTienda = document.getElementById('pantalla-tienda');
  const formLogin = document.getElementById('form-login');
  const inputEmail = document.getElementById('email-usuario');
  const errorMsg = document.getElementById('error-msg');
  const userEmailDisplay = document.getElementById('user-email-display');

  const listaProductos = document.getElementById('lista-productos');
  const itemsCarrito = document.getElementById('items-carrito');
  const subtotalVal = document.getElementById('subtotal-val');
  const descuentoVal = document.getElementById('descuento-val');
  const totalVal = document.getElementById('total-val');
  const btnFinalizar = document.getElementById('btn-finalizar');

  function formatearPrecio(monto) {
    return '$' + monto.toLocaleString('es-AR');
  }

  // 1. Ingreso con Email
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailIngresado = inputEmail.value.trim();

      if (emailIngresado === '' || !emailIngresado.includes('@')) {
        if (errorMsg) errorMsg.classList.remove('d-none');
        return;
      }

      emailUsuario = emailIngresado;

      if (errorMsg) errorMsg.classList.add('d-none');
      if (userEmailDisplay) userEmailDisplay.textContent = emailUsuario;

      if (pantallaIngreso) pantallaIngreso.classList.add('d-none');
      if (pantallaTienda) pantallaTienda.classList.remove('d-none');

      renderizarProductos();
    });
  }

  // 2. Renderizar productos
  function renderizarProductos() {
    if (!listaProductos) return;
    listaProductos.innerHTML = '';
    
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'card p-3 border shadow-sm slide-top';
      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 class="m-0 font-weight-bold" style="color: #58111A;">${prod.nombre}</h5>
            <small class="text-muted">${prod.desc}</small>
          </div>
          <div class="text-end">
            <span class="h5 d-block text-dark fw-bold m-0">${formatearPrecio(prod.precio)}</span>
            <button class="btn btn-sm text-white mt-1 btn-agregar" data-id="${prod.id}" style="background-color: #58111A;">
              Agregar al carrito
            </button>
          </div>
        </div>
      `;
      listaProductos.appendChild(card);
    });

    document.querySelectorAll('.btn-agregar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        agregarAlCarrito(id);
      });
    });
  }

  // 3. Agregar al carrito
  function agregarAlCarrito(id) {
    const prodEncontrado = productos.find(p => p.id === id);
    const enCarrito = carrito.find(item => item.id === id);

    if (enCarrito) {
      enCarrito.cantidad++;
    } else {
      carrito.push({ ...prodEncontrado, cantidad: 1 });
    }

    actualizarCarrito();
  }

  // 4. Cambios en método de pago
  document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      metodoPago = e.target.value;
      actualizarCarrito();
    });
  });

  // 5. Actualizar totales y render del carrito
  function actualizarCarrito() {
    if (!itemsCarrito) return;

    if (carrito.length === 0) {
      itemsCarrito.innerHTML = '<p class="text-muted italic m-0">El carrito está vacío</p>';
      if (btnFinalizar) btnFinalizar.disabled = true;
    } else {
      itemsCarrito.innerHTML = '';
      carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center mb-2 pb-2 border-bottom';
        div.innerHTML = `
          <div>
            <strong>${item.nombre}</strong><br>
            <small class="text-muted">Cant: ${item.cantidad} x ${formatearPrecio(item.precio)}</small>
          </div>
          <div class="text-end">
            <span class="fw-bold d-block mb-1">${formatearPrecio(item.precio * item.cantidad)}</span>
            <button class="btn btn-danger btn-sm py-0 px-2 btn-eliminar" data-id="${item.id}">Eliminar</button>
          </div>
        `;
        itemsCarrito.appendChild(div);
      });

      if (btnFinalizar) btnFinalizar.disabled = false;

      document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          carrito = carrito.filter(item => item.id !== id);
          actualizarCarrito();
        });
      });
    }

    const subtotal = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    let descuento = 0;

    if (metodoPago === 'transferencia') {
      descuento = subtotal * 0.15;
    }

    const total = subtotal - descuento;

    if (subtotalVal) subtotalVal.textContent = formatearPrecio(subtotal);
    if (descuentoVal) descuentoVal.textContent = formatearPrecio(descuento);
    if (totalVal) totalVal.textContent = formatearPrecio(total);
  }

  // 6. Evento de Finalizar Compra
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      const subtotal = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
      const descuento = metodoPago === 'transferencia' ? subtotal * 0.15 : 0;
      const total = subtotal - descuento;

      alert(`¡Gracias por tu compra en Vinos Calchaquíes!\n\nEnviamos el detalle de pago al correo: ${emailUsuario}\nTotal a pagar: ${formatearPrecio(total)} (${metodoPago === 'transferencia' ? 'Con 15% OFF aplicado' : 'Tarjeta'})`);

      // Resetear carrito tras comprar
      carrito = [];
      actualizarCarrito();
    });
  }

});