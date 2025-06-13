// script.js

document.addEventListener('DOMContentLoaded', function () {
  // Función para cargar opciones en un select
  const loadSelectOptions = (selectId, data) => {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">-- Seleccione una opción --</option>'; // Opción en blanco 
    data.forEach(item => {
      select.innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
    });
  };

  // Función para cargar checkboxes
  const loadCheckboxes = (containerId, data) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    data.forEach(item => {
      container.innerHTML += `
                <div>
                    <input type="checkbox" name="materiales[]" value="${item.id}">
                    <label>${item.nombre}</label>
                </div>
            `;
    });
  };

  // Se usa otro archivo PHP llamado 'get_data.php' para obtener estos datos
  // Cargar Bodegas 
  fetch('get_data.php?list=bodegas').then(res => res.json()).then(data => loadSelectOptions('bodega', data));

  // Cargar Monedas 
  fetch('get_data.php?list=monedas').then(res => res.json()).then(data => loadSelectOptions('moneda', data));

  // Cargar Materiales 
  fetch('get_data.php?list=materiales').then(res => res.json()).then(data => loadCheckboxes('materiales-checkboxes', data));

  // Evento para cargar sucursales cuando cambia la bodega 
  document.getElementById('bodega').addEventListener('change', function () {
    const idBodega = this.value;
    const sucursalSelect = document.getElementById('sucursal');

    if (idBodega) {
      fetch(`get_data.php?list=sucursales&bodega_id=${idBodega}`).then(res => res.json()).then(data => loadSelectOptions('sucursal', data));
    } else {
      sucursalSelect.innerHTML = '<option value="">-- Seleccione una Bodega primero --</option>'; // Opción en blanco 
    }
  });

  // La lógica de validación y envío del formulario
  document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de la forma tradicional 

    // 1. Validar Código del Producto
    const codigo = document.getElementById('codigo').value.trim();
    if (codigo === '') {
      alert("El código del producto no puede estar en blanco.");
      return;
    }
    if (codigo.length < 5 || codigo.length > 15) {
      alert("El código del producto debe tener entre 5 y 15 caracteres.");
      return;
    }
    const codigoRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/; // Regex para letras y números 
    if (!codigoRegex.test(codigo)) {
      alert("El código del producto debe contener letras y números.");
      return;
    }

    // 2. Validar Nombre del Producto
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre === '') {
      alert("El nombre del producto no puede estar en blanco.");
      return;
    }
    if (nombre.length < 2 || nombre.length > 50) {
      alert("El nombre del producto debe tener entre 2 y 50 caracteres.");
      return;
    }

    // 3. Validar Bodega
    const bodega = document.getElementById('bodega').value;
    if (bodega === '') {
      alert("Debe seleccionar una bodega.");
      return;
    }

    // 4. Validar Sucursal
    const sucursal = document.getElementById('sucursal').value;
    if (sucursal === '') {
      alert("Debe seleccionar una sucursal para la bodega seleccionada.");
      return;
    }

    // 5. Validar Moneda
    const moneda = document.getElementById('moneda').value;
    if (moneda === '') {
      alert("Debe seleccionar una moneda para el producto.");
      return;
    }

    // 6. Validar Precio
    const precio = document.getElementById('precio').value.trim();
    if (precio === '') {
      alert("El precio del producto no puede estar en blanco.");
      return;
    }
    const precioRegex = /^\d+(\.\d{1,2})?$/; // Regex para número positivo con hasta 2 decimales 
    if (!precioRegex.test(precio)) {
      alert("El precio del producto debe ser un número positivo con hasta dos decimales.");
      return;
    }

    // 7. Validar Materiales (checkboxes)
    const materialesChecked = document.querySelectorAll('input[name="materiales[]"]:checked');
    if (materialesChecked.length < 2) {
      alert("Debe seleccionar al menos dos materiales para el producto.");
      return;
    }

    // 8. Validar Descripción
    const descripcion = document.getElementById('descripcion').value.trim();
    if (descripcion === '') {
      alert("La descripción del producto no puede estar en blanco.");
      return;
    }
    if (descripcion.length < 10 || descripcion.length > 1000) {
      alert("La descripción del producto debe tener entre 10 y 1000 caracteres.");
      return;
    }

    // Si todas las validaciones pasan, se envían los datos
    const formData = new FormData(this);

    fetch('procesar.php', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        // Respuesta del servidor 
        alert(data.message);
        if (data.success) {
          document.getElementById('productForm').reset(); // Limpiar el formulario si tuvo éxito
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al conectar con el servidor.');
      });
  });
});