 let datosFiltrados= datos.filter(dato=>{

            })
            datos.forEach((item) => {
                
                const [nombre, detalles] = item.productoCarrito;
                const [urlImagen, descripcion, precio] = detalles;
                const cantidad = parseInt(item.cantidad, 10);
                const precioUnitario = parseFloat(precio);
                const precioTotal = (precioUnitario * cantidad).toFixed(2);

                const li = document.createElement("li");
                li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <img src="${urlImagen}" alt="${nombre}" style="width: 80px; height: auto; border: 1px solid #ccc;" />
                               <div>
                                 <h4 style="margin: 0;">${nombre.replace(/_/g, ' ')}</h4>
                                 <p style="margin: 0;">${descripcion}</p>
                                 <p style="margin: 0;">Cantidad: ${cantidad}</p>
                                 <p style="margin: 0;">Precio unitario: $${precioUnitario}</p>
                                 <strong>Precio total: $${precioTotal}</strong>
                               </div>
                             </div>
    `;
                lista.appendChild(li);

            });