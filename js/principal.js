
//Base de datos indexedDB
const IDbRequest = indexedDB.open('LocosXLaPesca', 1);

IDbRequest.addEventListener('upgradeneeded', () => {
    const db = IDbRequest.result;
    db.createObjectStore('ubicacion', {
        autoIncrement: true
    })
    db.createObjectStore('datos', {
        autoIncrement: true
    })
})

// operaciones CRUD
//crear:

const añadirObjeto = (seccion, objeto) => {
    const IDBData = getIDBData(seccion, 'readwrite');
    IDBData.add(objeto);
}

//leer

const leerObjetos = (seccion) => {
    return new Promise((resolve, reject) => {
        const IDBData = getIDBData(seccion, 'readonly');
        const cursor = IDBData.openCursor();
        const elementos = [];

        cursor.addEventListener("success", () => {
            if (cursor.result) {
                const elemento = [cursor.result.key, cursor.result.value];
                elementos.push(elemento);
                cursor.result.continue();
            } else {
                resolve(elementos);
            }
        });
        cursor.addEventListener("error", (error) => {
            reject(error);
        });
    });
};


//modificar

const modificarObjeto = (key, objeto, seccion) => {
    const IDBData = getIDBData(seccion, 'readwrite');
    IDBData.put(objeto, key); //si el objeto no existe,lo crea, si existe lo modifica
    return 'hecho'
}

// Eliminar

const eliminarObjeto = (key, seccion) => {
    const IDBData = getIDBData(seccion, 'readwrite');
    IDBData.delete(key);

}

const getIDBData = (seccion, mode) => {
    const db = IDbRequest.result;
    const IDBTransaction = db.transaction(seccion, mode) //se puede abrir en modo escritura-lectura (readwrite) o solo lectura (readonly)
    const objetotStore = IDBTransaction.objectStore(seccion);

    IDBTransaction.addEventListener('complete', () => {

    })
    return objetotStore
}

//Variables globales
var localidad, codigoPostal, provincia, domicilio, keyUbicacion;
var nombreUsuario = 'demo', fotoDePerfil = '../img/fondo1.jpg';
var usuariosAdministradores = {}
var precioTotalEnCarrito = 0;


//productos
const productos = {
    carnadas: {
        Lombrices: ["../img/productos/Lombrices.jpg", "Bolsa de 100 gramos de Lombrices ", "$1.800"],
        Morena: ["../img/productos/morena.jpg", "Bolsa al  vacio de morena", "$3.000"],
        Cascarudo: ["../img/productos/cascarudo.jpg", "Una docena de la mejor calidad ", "$3.200"],
        Cascarudo_media_docena: ["../img/productos/cascarudo.jpg", "Media docena de la mejor calidad", "$1.800"],
        Anguila: ["../img/productos/anguilas.jpg", "Una docena de anguilas ", "$4.800"],
        Anguila_media_docena: ["../img/productos/anguilas.jpg", "media docena", "$2.900"],
        Sabalitos: ["../img/productos/sabalitos.jpg", "Una docena de sabalitos, ideal para pescar en ríos pequeños", "$3.200"],
        Sabalitos_media_docena: ["../img/productos/sabalitos.jpg", "la misma calidad en media docena", "$1.800"],
        Mojarra: ["../img/productos/mojarras.jpg", "Un paquete de 500 gramos de mojarra al vacio", "$1.500"],
        Sabalo_trozado: ["../img/productos/sabalo trozado enbolsado.webp", "Carnada enbolsada al vacio", "$4.000"],
        Tripa_de_gallina: ["../img/productos/tripa de gallina.webp", "Carnada embolsada al vacio para pesca variada", "$4.800"],
    },
    articulosPesca: {
        Reel_frontal_Skyline_surf_6000: ["../img/productos/skyline surf 6000.webp", "Exelente calidad 3 rodamientos con capacidad para 100 M de linea", "$229.000"],
        Reel_frontal_Firecast_4000: ["../img/productos/firecast 4000.webp", "Exelente calidad 1 rodamiento con capacidad para 30 M de linea", "$37.600"],
        Reel_frontal_zest_fox_4000: ["../img/productos/fox 4000.webp", "Exelente calidad 1 rodamiento con capacidad para 40 M de linea", "$47.500"],
        Reel_frontal_Nitro_500_metal: ["../img/productos/nitro 5000.webp", "Exelente calidad 2 rodamiento con capacidad para 30 M de linea", "$87.700"],
        Reel_frontal_XTI_sw_4000: ["../img/productos/XTI sw 4000.webp", "Exelente calidad 2 rodamiento con capacidad para 50 M de linea", "$78.300"],
        Caña_Silvertech_210: ["../img/productos/silvertech 210.webp", "Caña de fibra de vidrio de alta resistencia. 1.66 metros", "$62.700"],
        caña_Mystix_infinity_198_MTS: ["../img/productos/caña mystix.webp", "Caña de pescar clasica Colony de fibra de vidrio. 1.66 metros", "$198.500"],
        caña_Colony_aventura_MT: ["../img/productos/colony aventura.webp", "Caña de fibra reforzada de vidrio de alta resistencia. 2.0 metros", "$152.200"],
        anzuelos: ["../img/productos/anzuelos.webp", "Juego de anzuelos de varias medidas, desde 1/0 hasta 6 ", "$18.700"],
        Lider_de_Pesca: ["../img/productos/lider de pesca.webp", "10 lider pesca leader acero armado 20 cm", "$5.700"],
        Lider_de_acero_para_pesca: ["../img/productos/lider de pesca acero armado.webp", "Kit de 5 lideres de pesca  acero armado 15 cm", "$3.500"],
        lineas_para_pescar_Grillon: ["../img/productos/linea para pescar grillon.webp", "lineas ultra resistentes soporta 22,9 Kg 0.60 mm 100 metros ", "$5.000"],
        lineas_para_pescar_Camou_line_050mm: ["../img/productos/linea de nylon.webp", "lineas de pesca Camou line 0.50 mm resiste hasta 32 Kg color verde 100 metros", "$5.000"],
        Plomadas_Surtidas_30g_a_100g: ["../img/productos/plomadas surtidas.webp", "Plomadas surtidas de 30g a 100g peso total 1 Kg", "$13.500"],
        Plomadas_10G: ["../img/productos/plomada  10g  5u.webp", "kit de 5 plomadas de 10 g cada una", "$5.500"],
        Plomadas_50G: ["../img/productos/plomada 50g 5u.webp", "kit de 5 plomadas de 50 g cada una", "$7.000"],
    }
}

//escucha de eventos 
document.querySelector('.zonaDeEntrega').addEventListener('click', e => {
    let labelDireccionDeEntrega = document.querySelector('.zonaDeEntrega');

    e.preventDefault()
    if (labelDireccionDeEntrega.textContent == 'Elegir zona de entrega:') {
        elegirZonaDeEntrega()
    } else {
        modificarZonaDeEntrega()
    }
})
document.getElementById('btnCargarCarnadas').addEventListener('click', () => {
    cargarProductos('carnadas');
    if (history.state.sitioActual != 'carnadas') history.pushState({ sitioActual: "carnadas" }, '', '#carnadas')

})

document.getElementById('btnCargarArticulosPesca').addEventListener('click', () => {
    cargarProductos('articulosPesca');
    if (history.state.sitioActual != 'articulosPesca') history.pushState({ sitioActual: "articulosPesca" }, '', '#articulosPesca')

})
window.addEventListener('load', () => {
    cargarLugarDeEntrega()
    cargarUsuario()
    history.replaceState({ sitioActual: 'inicio' }, '', '/')

})

window.addEventListener('click', (e) => {
    const cuenta = document.querySelector('.menuCuentaPc');
    const cuentaLaptop = document.querySelector('.menuCuentaLaptop');
    const contenedorSugerencias = document.querySelector('.contenedorSugerenciasBusqueda');
    const contenedorSugerenciasMobile = document.querySelector('.contenedorSugerenciasBusqueda.mobile');
    if (!e.target.matches('#cuenta') && cuenta.classList.contains('active')) cerrarLogin('pc')
    if (!e.target.matches('#cuentaLaptop') && cuentaLaptop.classList.contains('menuCuentaActivo')) cerrarLogin('laptop')

    if (!e.target.matches('.contenedorSugerenciasBusqueda' && contenedorSugerencias.innerHTML != '')) {
        contenedorSugerencias.innerHTML = ''
    }

    if (!e.target.matches('.contenedorSugerenciasBusqueda.mobile' && contenedorSugerenciasMobile.innerHTML != '')) {
        contenedorSugerenciasMobile.innerHTML = '';

    }


})

window.addEventListener('popstate', (e) => {
    if (e.state == null || e.state.sitioActual == 'inicio') {
        history.replaceState({ sitioActual: 'inicio' }, '', '/')
        location.reload()

    }
    if (e.state.sitioActual == 'carnadas') {
        cargarProductos('carnadas');
    }
    if (e.state.sitioActual == 'articulosPesca') {
        cargarProductos('articulosPesca');

    }
    if (e.state.sitioActual == 'mostrarProducto') {
        mostrarProducto(e.state.producto);
    }
    if (e.state.sitioActual == 'carrito') {
        carrito.mostrar()
    }
})

document.querySelector('.lugarDespacho').addEventListener('click', e => {
    e.preventDefault();
    abrirModal('mapaLugarDespacho')
})

document.getElementById('cuenta').addEventListener('click', async () => {
    await mostrarUsuario('pc');
    let imgFotoPerfil = document.getElementById('cuenta')
    imgFotoPerfil.classList.toggle('seccionActiva');

})

document.getElementById('carrito').addEventListener('click', () => {
    carrito.mostrar('pc');
})

document.getElementById('cuentaLaptop').addEventListener('click', async () => {
    await mostrarUsuario('laptop');
    let imgFotoPerfil = document.getElementById('cuentaLaptop')
    imgFotoPerfil.classList.toggle('seccionActiva');

})

document.getElementById('carritoLaptop').addEventListener('click', () => {
    carrito.mostrar('laptop');
})


document.querySelector('.btnCerrarSesion').addEventListener('click', (e) => {
    if (e.target.classList.contains('iniciarSesion')) {
        iniciarSesion('pc')
    } else {
        cerrarSesion('pc')
    }

})

document.querySelector('.btnCerrarSesionLaptop').addEventListener('click', (e) => {
    if (e.target.classList.contains('iniciarSesion')) {
        iniciarSesion('laptop')
    } else {
        cerrarSesion('laptop')
    }

})

document.querySelector('.btnCerrarSesionMobile').addEventListener('click', (e) => {
    if (e.target.classList.contains('iniciarSesion')) {
        iniciarSesion('mobile')
    } else {
        cerrarSesion('mobile')
    }
})


document.getElementById('carritoLaptop').addEventListener('click', () => {
    carrito.mostrar('pc');
})



document.getElementById('buscar').addEventListener('input', (e) => {
    sugerirProductos('pc')
    e.target.setAttribute('autocomplete', 'off')
})

document.getElementById('buscarMobile').addEventListener('input', (e) => {
    sugerirProductos('celular')
    e.target.setAttribute('autocomplete', 'off')
})

document.getElementById('buscar').addEventListener('click', () => {
    sugerirProductos()
})

document.querySelector('.imgMenu').addEventListener('click', (e) => {
    abrirMenuDesplegable()
})

document.getElementById('buscarCelular').addEventListener('click', () => mostrarBuscadorCelular())

document.getElementById('carritoCelular').addEventListener('click', () => {
    carrito.mostrarCelular()
})



//funciones del header

const cargarLugarDeEntrega = () => {
    leerObjetos('datos').then(dato => {
        dato.forEach(data => {
            if (data[1].ubicacion != undefined) {
                localidad = data[1].ubicacion[0]
                codigoPostal = data[1].ubicacion[1]
                provincia = data[1].ubicacion[2]
                domicilio = data[1].ubicacion[3]
                keyUbicacion = data[0];

                let labelDireccionDeEntrega = document.querySelector('.zonaDeEntrega');
                if (domicilio.length > 18) {
                    labelDireccionDeEntrega.textContent = `${domicilio}, ${localidad} ...`
                } else {
                    labelDireccionDeEntrega.textContent = `${domicilio}, ${localidad} ${provincia}`
                }
            }
        })

    })
}

const modificarZonaDeEntrega = () => {
    abrirModal('zonasDeEntrega')
    let letLocalidad = document.getElementById('inputLocalidad');
    let letcodigoPostal = document.getElementById('inputCodigoPostal');
    let letprovincia = document.getElementById('inputProvincia');
    let letDomicilio = document.getElementById('inputDomicilio');


    letLocalidad.value = localidad;
    letcodigoPostal.value = codigoPostal;
    letprovincia.value = provincia;
    letDomicilio.value = domicilio;

    document.getElementById('btnGuardar').addEventListener('click', () => {

        if (letLocalidad.value.length && letcodigoPostal.value.length > 1 && letDomicilio.value.length > 1 && letprovincia.value.length > 1) {
            modificarObjeto(keyUbicacion, { ubicacion: [letLocalidad.value, letcodigoPostal.value, letprovincia.value, letDomicilio.value] }, 'datos')
            cargarLugarDeEntrega()
            cerrarModal()
            location.reload()
        } else {
            alert('Por favor complete todos los campos.')
        }

    })

}


const elegirZonaDeEntrega = () => {
    abrirModal('zonasDeEntrega')
    document.getElementById('btnGuardar').addEventListener('click', () => {
        let Localidad = document.getElementById('inputLocalidad').value;
        let codigoPostal = document.getElementById('inputCodigoPostal').value;
        let provincia = document.getElementById('inputProvincia').value;
        let domicilio = document.getElementById('inputDomicilio').value;

        if (Localidad.length > 1 && codigoPostal.length > 1 && domicilio.length > 1 && provincia.length > 1) {
            añadirObjeto('datos', { ubicacion: [Localidad, codigoPostal, provincia, domicilio] })
            cargarLugarDeEntrega()
            cerrarModal()
        } else {
            alert('Por favor complete todos los campos.')
        }


    })

}

//modal
const cerrarModal = () => {
    const bgModal = document.querySelector('.modalBackground');
    const modal = document.querySelector('.modal');
    const body = document.querySelector('body');

    modal.innerHTML = '';
    bgModal.style.animation = '';
    bgModal.style.animation = 'desaparecer 0.2s forwards';
    bgModal.style.display = 'none'
    body.style.overflow = 'auto';
}
const abrirModal = (tipoDeApertura, titulo, mensaje) => {
    if (tipoDeApertura != undefined) {
        const bgModal = document.querySelector('.modalBackground');
        const modal = document.querySelector('.modal');
        const body = document.querySelector('body');
        if (tipoDeApertura == 'zonasDeEntrega') {
            const h3 = document.createElement('H3');
            const inputProvincia = document.createElement('INPUT');
            const inputCodigoPostal = document.createElement('INPUT');
            const inputLocalidad = document.createElement('INPUT');
            const button = document.createElement('BUTTON');
            const labelProvincia = document.createElement('LABEL');
            const labelCodigoPostal = document.createElement('LABEL');
            const labelLocalidad = document.createElement('LABEL');
            const labelDomicilio = document.createElement('LABEL');
            const inputDomicilio = document.createElement('INPUT');
            const contenedorInputs = document.createElement('DIV');

            modal.innerHTML = ''

            h3.textContent = 'Escribe tu ubicación';
            h3.id = 'enunciadoZonaEntrega';

            inputProvincia.setAttribute('placeholder', 'Provincia');
            inputCodigoPostal.setAttribute('placeholder', 'Código Postal');
            inputLocalidad.setAttribute('placeholder', 'Localidad');
            inputDomicilio.setAttribute('placeholder', 'Domicilio')


            inputProvincia.classList.add('inputsZonaEntrega')
            inputCodigoPostal.classList.add('inputsZonaEntrega')
            inputLocalidad.classList.add('inputsZonaEntrega')
            inputDomicilio.classList.add('inputsZonaEntrega')

            inputProvincia.id = 'inputProvincia';
            inputCodigoPostal.id = 'inputCodigoPostal';
            inputLocalidad.id = 'inputLocalidad';
            inputDomicilio.id = 'inputDomicilio'

            contenedorInputs.classList.add('contenedorInputsZonaEntrega')

            button.textContent = 'Guardar';
            button.id = 'btnGuardar';

            labelCodigoPostal.textContent = 'Código Postal';
            labelLocalidad.textContent = 'Localidad';
            labelProvincia.textContent = 'Provincia';
            labelDomicilio.textContent = 'Domicilio'

            modal.appendChild(h3);
            contenedorInputs.appendChild(labelProvincia);
            contenedorInputs.appendChild(inputProvincia);
            contenedorInputs.appendChild(labelCodigoPostal);
            contenedorInputs.appendChild(inputCodigoPostal);
            contenedorInputs.appendChild(labelLocalidad);
            contenedorInputs.appendChild(inputLocalidad);
            contenedorInputs.appendChild(labelDomicilio);
            contenedorInputs.appendChild(inputDomicilio);
            modal.appendChild(contenedorInputs)
            modal.appendChild(button);
            window.scroll({ top: 0, behavior: 'smooth' })
            bgModal.style.animation = 'aparecerModal 0.2s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';
        } else if (tipoDeApertura == 'mensaje') {
            let htmlCode = `
            <h2 id="tituloMensaje">${titulo}</h2>
            <h3 id="mensajeModal">${mensaje}</h3>
            `

            window.scroll({ top: 0, behavior: 'smooth' })
            modal.innerHTML = htmlCode;
            bgModal.style.animation = 'aparecerModal 0.4s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';


        } else if (tipoDeApertura == 'mapaLugarDespacho') {
            let htmlCode = `
            <h2 id="tituloMensajeDespacho">Lugar de despacho:</h2>
             <img id="imgMapaDespacho" src="../img/mapaLugarDespacho.png" width="300px" alt="">
             <button id="btnCerrarMapa">Cerrar</button>
            `

            window.scroll({ top: 0, behavior: 'smooth' })
            modal.innerHTML = htmlCode;
            document.getElementById('imgMapaDespacho').addEventListener('click', () => {
                window.open(document.getElementById('imgMapaDespacho').src)
            })
            document.getElementById('btnCerrarMapa').addEventListener('click', () => {
                cerrarModal()
            })
            bgModal.style.animation = 'aparecerModal 0.4s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';

        } else if (tipoDeApertura == 'iniciarSesion') {
            const inputNombre = document.createElement('INPUT');
            const inputcontraseña = document.createElement('INPUT');
            const labelNombre = document.createElement('LABEL');
            const labelContraseña = document.createElement('LABEL');
            const enunciado = document.createElement('H3');
            const btnIniciarSesion = document.createElement('BUTTON');

            modal.innerHTML = '';

            inputNombre.id = 'nombreInicioSesion';
            inputNombre.className = 'inputsLogin';
            inputNombre.setAttribute('placeholder', 'Ingresa tu nombre');
            inputNombre.setAttribute('required', ' ');

            inputcontraseña.type = 'password';
            inputcontraseña.setAttribute('placeholder', 'Ingresa tu contraseña');
            inputcontraseña.id = 'contraseñaInicioSesion';
            inputcontraseña.setAttribute('required', ' ');
            inputcontraseña.className = 'inputsLogin';

            labelNombre.textContent = 'Nombre de usuario:';
            labelNombre.className = 'labelLogin';

            labelContraseña.textContent = 'Contraseña:';
            labelContraseña.className = 'labelLogin';

            enunciado.textContent = 'Iniciar Sesión'
            enunciado.id = 'enunciadoIniciarSesion'

            btnIniciarSesion.textContent = 'Iniciar Sesión'
            btnIniciarSesion.addEventListener('click', () => {
                const nombre = document.getElementById('nombreInicioSesion').value;
                const contraseña = document.getElementById('contraseñaInicioSesion').value;
                const btnIniciarSesion = document.querySelector('.btnCerrarSesion')


                if (nombre != undefined && nombre != ' ' && nombre != '' && contraseña != undefined && contraseña != ' ' && contraseña != '') {
                    let resultado = 'No se encontro al usuario';
                    for (usuario in usuariosAdministradores) {
                        if (nombre == usuario) {
                            if (contraseña == usuariosAdministradores[usuario][0]) {
                                nombreUsuario = usuario;
                                fotoDePerfil = usuariosAdministradores[usuario][1];
                                let mensaje = `Bienvenid@ ${nombre} !!`
                                enviarNotificacion(mensaje)

                                btnIniciarSesion.classList.remove('iniciarSesion')
                                btnIniciarSesion.textContent = 'Cerrar sesión'
                                resultado = 'Sesión iniciada'

                                cerrarModal();
                                cargarUsuario()
                                return
                            } else {
                                alert('Contrasña Incorrecta');
                                return
                            }
                        }
                    }
                    if (resultado == 'No se encontro al usuario') {
                        alert(resultado);
                    }
                } else {
                    alert('Complete todos los campos');
                }
            })
            btnIniciarSesion.id = 'btnIniciarSesion'

            modal.appendChild(enunciado)
            modal.appendChild(labelNombre);
            modal.appendChild(inputNombre);
            modal.appendChild(labelContraseña);
            modal.appendChild(inputcontraseña);
            modal.appendChild(btnIniciarSesion);


            window.scroll({ top: 0, behavior: 'smooth' })
            bgModal.style.animation = 'aparecerModal 0.4s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';

            const inputLogin = document.querySelectorAll('.inputsLogin');
            for (let input of inputLogin) {
                input.addEventListener('input', () => {
                    input.style.borderBottom = "#4be20f  solid";

                })
            }
        }

    } else {
        console.log('Errror al abrir modal: no se definio el tipo de apertura')
    }

}

//función para cambiar de lugar el footer


const moverFooter = (prioridad) => {
    const footerDefecto = document.querySelector('.footerDefecto');
    const footerCarrito = document.querySelector('.footerCarrito');

    if (prioridad == 'defecto') {
        if (!footerDefecto.classList.contains('footerActivo')) {
            footerDefecto.classList.toggle('footerActivo');
            if (footerCarrito) footerCarrito.classList.toggle('footerActivo')
        }
    }
    if (prioridad == 'footerCarrito') {
        if (!footerCarrito.classList.contains('footerActivo')) {
            footerDefecto.classList.toggle('footerActivo');

            footerCarrito.classList.toggle('footerActivo')
        }
    }


}


//funcion para mostrar las areas 
const mostrarAreas = () => {
    const contenedorProductos = document.querySelector('.contenedorProductos');
    contenedorProductos.style.display = 'none';
    const divElegirArea = document.querySelector('.elegirArea');


    let sobreNosotros = document.querySelector('.contenedorSobreNosotros')
    if (sobreNosotros) {
        sobreNosotros.style.display = 'none';
    }


    moverFooter('defecto');
    contenedorProductos.style.animation = 'desaparecer 0.6s forwards'

    divElegirArea.style.animation = 'aparecerArea 0.6s forwards';
    history.pushState({ sitioActual: 'inicio' }, '', '/')
}

//Función para cargar los productos
const cargarProductos = (areaACargar) => {

    const contenedorProductos = document.querySelector('.contenedorProductos');
    const divElegirArea = document.querySelector('.elegirArea')
    divElegirArea.style.animation = 'desaparecerArea 0.1s forwards'
    contenedorProductos.style.display = 'flex';


    window.scroll({ top: 0, behavior: "smooth" })
    contenedorProductos.innerHTML = '';


    for (let area in productos) {
        if (areaACargar == area) {
            for (let nombreProducto in productos[area]) {
                let nombreProductoFormateado;
                if (nombreProducto.includes('_')) {
                    nombreProductoFormateado = nombreProducto.replaceAll('_', ' ');
                    if (nombreProductoFormateado.includes('media docena')) {
                        nombreProductoFormateado = nombreProductoFormateado.substring('0', nombreProductoFormateado.indexOf('media docena') - 1)
                    }

                } else {
                    nombreProductoFormateado = nombreProducto;
                }
                const producto = document.createElement('DIV');
                const img = document.createElement('IMG');
                const nombreDelProducto = document.createElement('H3');
                const descripcionProducto = document.createElement('P');
                const precioProducto = document.createElement('P');
                const inputCantidad = document.createElement('INPUT');
                const btnAgregar = document.createElement('BUTTON');
                const btnAumentar = document.createElement('BUTTON');
                const btnDisminuir = document.createElement('BUTTON');
                const contenedorInputCantidad = document.createElement('DIV')

                producto.classList.add('producto');
                producto.addEventListener('click', (e) => {
                    if (e.target.matches('.producto') || e.target.matches('#imgProducto')) {

                        mostrarProducto({ [nombreProducto]: productos[area][nombreProducto] })
                    }
                })

                btnDisminuir.classList.add('btnDisminuirInput')
                btnDisminuir.classList.add('btnControlInput');
                btnDisminuir.textContent = '-'
                btnDisminuir.addEventListener('click', () => {
                    let valor = inputCantidad.value;
                    if (valor > 1) {
                        inputCantidad.value = --valor
                    }

                })


                btnAumentar.classList.add('btnAumentarInput');
                btnAumentar.classList.add('btnControlInput');
                btnAumentar.textContent = '+'
                btnAumentar.addEventListener('click', () => {
                    let valor = inputCantidad.value;
                    inputCantidad.value = ++valor
                })
                contenedorInputCantidad.className = 'contenedorInputCantidad';

                img.id = 'imgProducto';
                img.style.width = '200px';
                img.style.cursor = 'pointer'
                img.src = productos[area][nombreProducto][0]

                nombreDelProducto.classList.add('nombreProducto');
                nombreDelProducto.textContent = nombreProductoFormateado;

                descripcionProducto.className = 'descripcion';
                if (productos[area][nombreProducto][1].length > 90) {
                    let verMas = document.createElement('A');
                    verMas.textContent = 'Ver más'
                    verMas.id = 'btnVerMas'
                    verMas.addEventListener('click', (e) => {
                        e.preventDefault();
                        mostrarProducto({ [nombreProducto]: productos[area][nombreProducto] })
                    })

                    descripcionProducto.textContent = productos[area][nombreProducto][1].substring(0, 90) + '... '
                    descripcionProducto.appendChild(verMas)
                } else {
                    descripcionProducto.textContent = productos[area][nombreProducto][1]
                }


                precioProducto.className = 'precioProducto';
                precioProducto.textContent = productos[area][nombreProducto][2]

                inputCantidad.setAttribute('type', 'number');
                inputCantidad.setAttribute('name', 'cantidad');
                inputCantidad.className = 'classInputCantidad';
                inputCantidad.id = 'inputCantidad';
                inputCantidad.value = 1;
                inputCantidad.setAttribute('min', '1');
                inputCantidad.setAttribute('max', '99');
                inputCantidad.addEventListener('blur', () => {
                    if (inputCantidad.value == 0) {
                        inputCantidad.value = 1;
                    }
                })

                btnAgregar.className = 'btnAagregar';
                btnAgregar.textContent = 'Añadir';
                btnAgregar.addEventListener('click', () => {
                    añadirObjeto('datos', { productoCarrito: [nombreProducto, productos[area][nombreProducto]], cantidad: inputCantidad.value })
                    enviarNotificacion('Producto: ' + nombreProductoFormateado + ' añadido al carrito')
                })


                producto.appendChild(img);
                producto.appendChild(nombreDelProducto);
                producto.appendChild(descripcionProducto);
                producto.appendChild(precioProducto);

                contenedorInputCantidad.appendChild(btnDisminuir);
                contenedorInputCantidad.appendChild(inputCantidad);
                contenedorInputCantidad.appendChild(btnAumentar);
                producto.appendChild(contenedorInputCantidad)
                producto.appendChild(btnAgregar);

                contenedorProductos.style.animation = 'aparecer 1s forwards';

                contenedorProductos.appendChild(producto);
            }
        }
    }
}

const mostrarUsuario = async (tipoDeApertura) => {
    if (tipoDeApertura) {
        if (tipoDeApertura == 'pc') {
            const contenedorInfoLogin = document.querySelector('.menuCuentaPc');
            if (contenedorInfoLogin.classList.contains('active')) {
                document.querySelector('.menuCuentaPc').style.animation = 'desaparecerArea 0.8s forwards'
                await new Promise(resolve => setTimeout(() => {
                    contenedorInfoLogin.classList.toggle('active')
                    resolve()
                    return
                }, 700))

            } else {
                contenedorInfoLogin.classList.toggle('active')
                document.querySelector('.menuCuentaPc').style.animation = 'aparecerArea 0.5s forwards'
            }
        }
        if (tipoDeApertura == 'laptop') {
            const contenedorInfoLogin = document.querySelector('.menuCuentaLaptop');
            if (contenedorInfoLogin.classList.contains('menuCuentaActivo')) {
                contenedorInfoLogin.style.animation = 'desaparecerArea 0.8s forwards'
                await new Promise(resolve => setTimeout(() => {
                    contenedorInfoLogin.classList.toggle('menuCuentaActivo')
                    resolve()
                    return
                }, 700))

            } else {
                contenedorInfoLogin.classList.toggle('menuCuentaActivo')
                contenedorInfoLogin.style.animation = 'aparecerArea 0.5s forwards';
            }

        }
    }
}

const cerrarSesion = (modo) => {
    if (nombreUsuario && fotoDePerfil) {
        if (confirm(`Esta seguro que quiere cerrar la sesion de: ${nombreUsuario} ?`)) {
            nombreUsuario = undefined;
            fotoDePerfil = undefined;
            cargarUsuario(modo)
        }
    }
}

const iniciarSesion = async (modo) => {
    fetch('../datos/Administradores.json')
        .then(usuarios => usuarios.json())
        .then(usuario => {
            Object.assign(usuariosAdministradores, usuario);
        })
    await cerrarLogin(modo)
    abrirModal('iniciarSesion')
    let btnCerrarSesion = document.querySelector('.btnCerrarSesionMobile')
    btnCerrarSesion.textContent = 'Cerrar sesión';
    btnCerrarSesion.classList.toggle('iniciarSesion');

}

const cargarUsuario = (modo) => {
    const nombreCompleto = document.querySelectorAll('.nombreYApellido');
    const fotoPerfil = document.querySelectorAll('.fotoPerfil');
    let btnCerrarSesion;
    if (modo == 'pc') btnCerrarSesion = document.querySelector('.btnCerrarSesion')
    if (modo == 'laptop') btnCerrarSesion = document.querySelector('.btnCerrarSesionLaptop')
    if (modo == 'mobile') btnCerrarSesion = document.querySelector('.btnCerrarSesionMobile')


    if (nombreUsuario && fotoDePerfil) {
        for (let img of fotoPerfil) {
            img.src = fotoDePerfil;
        }

        nombreCompleto.forEach(nombre => nombre.textContent = nombreUsuario)


    } else {
        fotoPerfil.forEach(img => img.src = '')

        nombreCompleto.forEach(nombre => nombre.textContent = 'No se ha iniciado sesión')

        btnCerrarSesion.textContent = 'Iniciar Sesión';
        btnCerrarSesion.classList.add('iniciarSesion');
    }
}

const cerrarLogin = async (modo) => {
    if (modo == 'pc') {
        const contenedorInfoLogin = document.querySelector('.menuCuentaPc');
        let imgFotoPerfil = document.getElementById('cuenta')

        contenedorInfoLogin.style.animation = 'desaparecerArea 0.8s forwards'
        await new Promise(resolve => setTimeout(() => {
            contenedorInfoLogin.classList.toggle('active')
            imgFotoPerfil.classList.toggle('seccionActiva')
            resolve()
            return
        }, 700))
    }
    if (modo == 'laptop') {
        const contenedorInfoLogin = document.querySelector('.menuCuentaLaptop');
        let imgFotoPerfil = document.getElementById('cuentaLaptop')

        contenedorInfoLogin.style.animation = 'desaparecerArea 0.8s forwards'
        await new Promise(resolve => setTimeout(() => {
            contenedorInfoLogin.classList.toggle('active')
            imgFotoPerfil.classList.toggle('seccionActiva');
            resolve()
            return
        }, 700))
    }


}

const enviarNotificacion = (mensaje) => {
    const body = document.querySelector('body');
    const contenedorMensaje = document.createElement('DIV');
    const spanMensaje = document.createElement('SPAN');

    spanMensaje.textContent = mensaje;
    spanMensaje.className = 'spanNotificacion';

    contenedorMensaje.className = 'notificacion'
    contenedorMensaje.appendChild(spanMensaje);


    body.appendChild(contenedorMensaje);
    contenedorMensaje.style.animation = 'enviarNotificacion 1s forwards';

    setTimeout(() => {
        contenedorMensaje.style.animation = 'ocultarNotificacion 1s forwards';
        setTimeout(() => {
            contenedorMensaje.innerHTML = ''

        }, 700)
    }, 3000)
}

const sugerirProductos = (modo) => {
    if (modo == 'pc') {
        let input = document.getElementById('buscar').value;
        const contenedorBusqueda = document.querySelector('.buscador');
        const contenedorSugerencias = document.querySelector('.contenedorSugerenciasBusqueda')
        const ul = document.createElement('UL')
        let validadorDeEspacios = false;

        contenedorSugerencias.innerHTML = ''

        let productosSimilares = []
        ul.className = 'ulSugerenciasBusqueda';

        if (input[0] == ' ' && input[1] != ' ') {
            validadorDeEspacios = true;
            input = input.substring(1)
        } else if (input[0] != ' ') {
            validadorDeEspacios = true;
        }

        if (input.length > 0 && validadorDeEspacios) {
            for (let clasificacion in productos) {
                for (let producto in productos[clasificacion]) {
                    if (producto.toLowerCase().includes((input.toLowerCase()))) {
                        productosSimilares.push(producto);
                    }
                }
            }
            for (let producto of productosSimilares) {
                const li = document.createElement('LI')
                let productoTabulado;
                if (producto.includes('_')) {
                    productoTabulado = producto.replaceAll('_', ' ');
                } else {
                    productoTabulado = producto;
                }
                li.addEventListener('click', () => {
                    for (let clasificacion in productos) {
                        for (let productoBuscado in productos[clasificacion]) {
                            if (productoBuscado == producto) {
                                document.getElementById('buscar').value = ''
                                mostrarProducto({ [productoBuscado]: productos[clasificacion][productoBuscado] });
                            }
                        }
                    }

                })
                li.textContent = productoTabulado;
                ul.appendChild(li);
            }
            if (productosSimilares.length == 0) {
                const li = document.createElement('LI')
                li.textContent = 'Ups... no tenemos en stock ese producto';
                ul.appendChild(li);
            }
        }
        contenedorSugerencias.appendChild(ul);
        contenedorBusqueda.appendChild(contenedorSugerencias)
    }
    if (modo == 'celular') {
        let input = document.getElementById('buscarMobile').value;
        const contenedorBusqueda = document.querySelector('.buscadorCelular');
        const contenedorSugerencias = document.querySelector('.contenedorSugerenciasBusqueda.mobile')
        const ul = document.createElement('UL')
        let validadorDeEspacios = false;

        contenedorSugerencias.innerHTML = '';

        let productosSimilares = []
        ul.className = 'ulSugerenciasBusqueda';

        if (input[0] == ' ' && input[1] != ' ') {
            validadorDeEspacios = true;
            input = input.substring(1)
        } else if (input[0] != ' ') {
            validadorDeEspacios = true;
        }

        if (input.length > 0 && validadorDeEspacios) {
            for (let clasificacion in productos) {
                for (let producto in productos[clasificacion]) {
                    if (producto.toLowerCase().includes((input.toLowerCase()))) {
                        productosSimilares.push(producto);
                    }
                }
            }
            for (let producto of productosSimilares) {
                const li = document.createElement('LI')
                let productoTabulado;
                if (producto.includes('_')) {
                    productoTabulado = producto.replaceAll('_', ' ');
                } else {
                    productoTabulado = producto;
                }
                li.addEventListener('click', () => {
                    for (let clasificacion in productos) {
                        for (let productoBuscado in productos[clasificacion]) {
                            if (productoBuscado == producto) {
                                document.getElementById('buscarMobile').value = ''
                                mostrarBuscadorCelular()
                                mostrarProducto({ [productoBuscado]: productos[clasificacion][productoBuscado] });
                            }
                        }
                    }

                })
                li.textContent = productoTabulado;
                ul.appendChild(li);
            }
            if (productosSimilares.length == 0) {
                const li = document.createElement('LI')
                li.textContent = 'Ups... no tenemos en stock ese producto';
                ul.appendChild(li);
            }


        }
        contenedorSugerencias.appendChild(ul);
        contenedorBusqueda.appendChild(contenedorSugerencias)

    }


}
const mostrarProducto = producto => {
    const contenedorPrincipal = document.querySelector('.contenedorProductos');
    const divElegirArea = document.querySelector('.elegirArea');
    divElegirArea.style.animation = 'desaparecer 0.1s forwards'
    const tarjetaProducto = document.createElement('DIV');
    const nombreProducto = Object.keys(producto)[0];
    const btnAumentar = document.createElement('BUTTON');
    const btnDisminuir = document.createElement('BUTTON');
    const contenedorInputCantidad = document.createElement('DIV')

    if (history.state.sitioActual != 'mostrarProducto') history.pushState({ sitioActual: 'mostrarProducto', producto: producto }, '', `#producto:${nombreProducto}`)


    contenedorPrincipal.innerHTML = '';
    contenedorPrincipal.style.display = 'flex'


    if (nombreProducto.includes('_')) {
        nombreProductoFormateado = nombreProducto.replaceAll('_', ' ');
        if (nombreProductoFormateado.includes('media docena')) {
            nombreProductoFormateado = nombreProductoFormateado.substring('0', nombreProductoFormateado.indexOf('media docena') - 1)
        }
    } else {
        nombreProductoFormateado = nombreProducto;
    }

    btnDisminuir.classList.add('btnDisminuirInput')
    btnDisminuir.classList.add('btnControlInput');
    btnDisminuir.textContent = '-'
    btnDisminuir.addEventListener('click', () => {
        let valor = inputCantidad.value;
        if (valor > 1) {
            inputCantidad.value = --valor
        }

    })

    btnAumentar.classList.add('btnAumentarInput');
    btnAumentar.classList.add('btnControlInput');
    btnAumentar.textContent = '+'
    btnAumentar.addEventListener('click', () => {
        let valor = inputCantidad.value;
        inputCantidad.value = ++valor
    })

    contenedorInputCantidad.className = 'contenedorInputCantidadAmpliado';

    const img = document.createElement('IMG');
    const nombreDelProducto = document.createElement('H3');
    const descripcionProducto = document.createElement('P');
    const precioProducto = document.createElement('P');
    const labelCantidad = document.createElement('LABEL');
    const inputCantidad = document.createElement('INPUT');
    const btnAgregar = document.createElement('BUTTON');

    tarjetaProducto.classList.add('tarjetaProducto');

    img.id = 'imgProductoAmpliado';
    img.src = producto[nombreProducto][0];

    nombreDelProducto.classList.add('nombreProducto');
    nombreDelProducto.textContent = nombreProductoFormateado;

    descripcionProducto.className = 'descripcion';
    descripcionProducto.textContent = producto[nombreProducto][1]

    precioProducto.className = 'precioProducto';
    precioProducto.textContent = producto[nombreProducto][2]

    labelCantidad.setAttribute('for', 'cantidad');
    labelCantidad.textContent = 'Cantidad';

    inputCantidad.setAttribute('type', 'number');
    inputCantidad.setAttribute('name', 'cantidad');
    inputCantidad.className = 'classInputCantidad';
    inputCantidad.id = 'inputCantidad';
    inputCantidad.value = 1;
    inputCantidad.setAttribute('min', '1');
    inputCantidad.setAttribute('max', '99');
    inputCantidad.addEventListener('blur', () => {
        if (inputCantidad.value == 0) {
            inputCantidad.value = 1;
        }
    })


    btnAgregar.className = 'btnAagregar';
    btnAgregar.textContent = 'Añadir';
    btnAgregar.addEventListener('click', () => {
        let valorInput = inputCantidad.value;
        let clave = Object.keys(producto);
        añadirObjeto('datos', { productoCarrito: [clave[0], [producto[clave][0], producto[clave][1], producto[clave][2]]], cantidad: inputCantidad.value })
        enviarNotificacion('Producto: ' + nombreProductoFormateado + ' añadido al carrito')
    })

    tarjetaProducto.appendChild(nombreDelProducto);
    tarjetaProducto.appendChild(img);
    tarjetaProducto.appendChild(descripcionProducto);
    tarjetaProducto.appendChild(precioProducto);
    contenedorInputCantidad.appendChild(btnDisminuir);
    contenedorInputCantidad.appendChild(inputCantidad);
    contenedorInputCantidad.appendChild(btnAumentar);
    tarjetaProducto.appendChild(contenedorInputCantidad)
    tarjetaProducto.appendChild(btnAgregar);


    contenedorPrincipal.style.animation = 'aparecer 1s forwards';
    contenedorPrincipal.appendChild(tarjetaProducto);



}

const darFormato = (precio) => {
    return precio.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

//objeto Carrito de compras

class Carrito {

    classContenedorPrincipal = ''
    classContenedorElegirArea = ''
    productosComprados = {}
    colocarEvento(modo) {
        let elementos = document.querySelectorAll('.btnEliminarProductoCarrito')
        if (modo == 'celular') {
            elementos.forEach(elemento => {
                elemento.addEventListener('click', () => {
                    if (confirm('Esta seguro de quitar este producto? ')) {
                        carrito.eliminar(elemento.id, null, 'celular')
                    }
                })
            })

        } else {
            elementos.forEach(elemento => {
                elemento.addEventListener('click', () => {
                    if (confirm('Esta seguro de quitar este producto? ')) {
                        carrito.eliminar(elemento.id, null, 'pc')
                    }
                })

            })
        }

    }
    async eliminar(id, obj, modo) {

        eliminarObjeto(+id, 'datos')
        if (!obj) {
            enviarNotificacion('Producto quitado');
        }

        if (modo == 'celular') {
            await this.actualizar('celular')
        }
        if (modo == 'pc') {
            await this.actualizar('pc')
        }

        this.actualizarPrecio()
    }


    actualizarPrecio() {

        const precioTotal = document.querySelectorAll('.precioTotalEnCarrito')
        precioTotalEnCarrito = 0
        const productos = document.querySelectorAll('.precioTotalProducto')
        productos.forEach(precio => {
            let precioTabulado = precio.textContent.substring(15)
            precioTabulado = precioTabulado.replaceAll('.', '')
            precioTotalEnCarrito += +precioTabulado;

        })
        if (productos.length == 0) {
            precioTotalEnCarrito = 0
        }

        precioTotal.forEach(precio =>precio.textContent = `$${darFormato(precioTotalEnCarrito.toString())}`)
    }
    async actualizar(modo) {
        const divProductosEnElCarrito = document.querySelector('.ProductosEnElCarrito');
        const divTerminarCompra = document.createElement('DIV');


        const datos = await leerObjetos('datos');
        const lista = document.createElement('UL');
        lista.classList.add('listadoProductos')

        if (datos.length > 1) {
            for (let dato in datos) {
                if (datos[dato][1].productoCarrito != undefined) {
                    let descripcion = datos[dato][1].productoCarrito[1][1];

                    if (descripcion.length > 180) {
                        descripcion = descripcion.substring(0, 180) + ' ...'
                    }

                    const nombre = datos[dato][1].productoCarrito[0]
                    const urlImagen = datos[dato][1].productoCarrito[1][0]
                    const cantidad = +datos[dato][1].cantidad
                    let precioUnitario = datos[dato][1].productoCarrito[1][2].substring('1')
                    precioUnitario = +precioUnitario.replaceAll('.', '');
                    const precioTotal = (precioUnitario * cantidad)
                    precioTotalEnCarrito += precioTotal;
                    const li = document.createElement("li");


                    li.classList.add('listadoProductoCarrito')

                    li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <img src="${urlImagen}" alt="${nombre}" style="width: 80px; height: auto; border: 1px solid #ccc;" />
                               <div class="">
                                 <h4 style="margin: 0;">${nombre.replace(/_/g, ' ')}</h4>
                                 <p style="margin: 0;">${descripcion}</p>
                                 <p style="margin: 0;">Cantidad: ${cantidad}</p>
                                 <p style="margin: 0;">Precio unitario: $${precioUnitario}</p>
                                 <strong class="precioTotalProducto">Precio total: $${darFormato(precioTotal.toString())}</strong>
                                 <span hidden > </span>
                               </div>
                                <div id='${datos[dato][0]}' class="btnEliminarProductoCarrito"></div>
                             </div>
    `;

                    lista.appendChild(li);


                }

            }

            this.actualizarPrecio()

        } else {

            let li = document.createElement('LI')
            li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <div class="">
                                 <h4 style="margin-left:10px; margin-top:20px;  ">No Hay productos en el carrito</h4>
                             </div>
    `;

            lista.appendChild(li)
            divProductosEnElCarrito.appendChild(lista)
            divProductosEnElCarrito.classList.add('ProductosEnElCarrito')

        }
        if (modo == 'pc') {
            let footerDentroListado;
            if (!document.querySelector('.footerCarrito')) {
                footerDentroListado = document.createElement('FOOTER')
            } else {
                footerDentroListado = document.querySelector('.footerCarrito')
            }
            let codigoFooter = document.querySelector('.footerCarrito').innerHTML;
            divProductosEnElCarrito.innerHTML = '';

            footerDentroListado.innerHTML = codigoFooter;
            divProductosEnElCarrito.appendChild(lista);

            footerDentroListado.classList.add('footerCarrito')

            divProductosEnElCarrito.appendChild(footerDentroListado);
            moverFooter('footerCarrito');
            divProductosEnElCarrito.style.animation = 'actualizarCarrito 3s forwards'
            this.colocarEvento('pc')
        }
        if (modo == 'celular') {
            divProductosEnElCarrito.innerHTML = '';
            divProductosEnElCarrito.appendChild(lista);
            divProductosEnElCarrito.classList.add('ProductosEnElCarrito')

            divProductosEnElCarrito.style.animation = 'actualizarCarrito 3s forwards'
            this.colocarEvento('celular')
        }

    }
    async mostrar(tipo) {


        if (tipo == 'pc') {
            const contenedorPrincipal = document.querySelector('.' + this.classContenedorPrincipal);
            const contenedorElegirArea = document.querySelector('.' + this.classContenedorElegirArea);
            const divProductosEnElCarrito = document.createElement('DIV');
            const divTerminarCompra = document.createElement('DIV');

            contenedorProductos.style.display = 'grid'

            let footerDentroListado;
            if (!document.querySelector('.footerCarrito')) {
                footerDentroListado = document.createElement('FOOTER')
            } else {
                footerDentroListado = document.querySelector('.footerCarrito')
            }

            contenedorPrincipal.innerHTML = '';
            contenedorPrincipal.style.animation = 'aparecerArea 1s forwards'

            const datos = await leerObjetos('datos');
            const lista = document.createElement('UL')

            lista.classList.add('listadoProductos')
            if (datos.length > 1) {

                for (let dato in datos) {

                    if (datos[dato][1].productoCarrito != undefined) {

                        let descripcion = datos[dato][1].productoCarrito[1][1];

                        if (descripcion.length > 180) {
                            descripcion = descripcion.substring(0, 180) + ' ...'
                        }

                        const nombre = datos[dato][1].productoCarrito[0]
                        const urlImagen = datos[dato][1].productoCarrito[1][0]
                        const cantidad = +datos[dato][1].cantidad
                        let precioUnitario = datos[dato][1].productoCarrito[1][2].substring('1')
                        precioUnitario = +precioUnitario.replaceAll('.', '');
                        const precioTotal = (precioUnitario * cantidad)
                        precioTotalEnCarrito += precioTotal
                        const li = document.createElement("li");


                        li.classList.add('listadoProductoCarrito')

                        li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <img src="${urlImagen}" alt="${nombre}" style="width: 80px; height: auto; border: 1px solid #ccc;" />
                               <div class="">
                                 <h4 style="margin: 0;">${nombre.replace(/_/g, ' ')}</h4>
                                 <p style="margin: 0;">${descripcion}</p>
                                 <p style="margin: 0;">Cantidad: ${cantidad}</p>
                                 <p style="margin: 0;">Precio unitario: $${precioUnitario}</p>
                                 <strong class="precioTotalProducto">Precio total: $${darFormato(precioTotal.toString())}</strong>
                                 <span hidden > </span>
                               </div>
                                <div id='${datos[dato][0]}' class="btnEliminarProductoCarrito celular"></div>
                             </div>
    `;

                        lista.appendChild(li);
                        divProductosEnElCarrito.appendChild(lista)
                        divProductosEnElCarrito.classList.add('ProductosEnElCarrito')
                    }
                }

            } else {
                let li = document.createElement('LI')
                li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <div class="">
                                 <h4 style="margin-left:10px; margin-top:20px;  ">No Hay productos en el carrito</h4>
                             </div>
    `;

                lista.appendChild(li)
                divProductosEnElCarrito.appendChild(lista)
                divProductosEnElCarrito.classList.add('ProductosEnElCarrito')

            }




            let footer = document.querySelector('footer')
            let codigoHtmlFooter = footer.innerHTML;
            footerDentroListado.innerHTML = codigoHtmlFooter;
            footerDentroListado.classList.add('footerCarrito');

            contenedorPrincipal.appendChild(divProductosEnElCarrito)
            divProductosEnElCarrito.appendChild(footerDentroListado)


            moverFooter('footerCarrito')
            this.colocarEvento('pc');

            divProductosEnElCarrito.style.animation = 'aparecerCarrito 1s forwards';

            divTerminarCompra.style.animation = 'aparecerCarrito 1.9s forwards';


            divTerminarCompra.className = 'divTerminarCompra';
            cargarLugarDeEntrega()

            //contenedor finalizar compra

            const contenedor = document.createElement('DIV');
            const enunciado = document.createElement('H1');
            const lugarDespacho = document.createElement('H3')
            const destino = document.createElement('H3');
            const labelTotal = document.createElement('LABEL');
            const total = document.createElement('H2');
            const btnConfirmarCompra = document.createElement('BUTTON');
            const labelModoDePago = document.createElement('LABEL');
            const inputModoPago = document.createElement('INPUT');
            const labelTargeta = document.createElement('LABEL')


            contenedor.className = 'contenedorConfirmarCompra';

            enunciado.textContent = 'Finalizá tu compra'

            lugarDespacho.innerHTML = 'Desde: <b>Florencia, Santa Fe</b>';

            destino.innerHTML = `Hasta: <b>${domicilio}, ${localidad}-${provincia} </b>`;

            total.textContent = `$${darFormato(precioTotalEnCarrito.toString())}`
            total.classList.add('precioTotalEnCarrito');

            labelModoDePago.innerHTML = 'Método de pago: '
            labelModoDePago.id = 'labelMetodoDePago'
            labelTargeta.textContent = '      Mastercard finalizada en: 0092'
            inputModoPago.type = 'radio'
            inputModoPago.setAttribute('checked', '')



            labelTotal.innerHTML = '<br>Precio Total:'

            btnConfirmarCompra.textContent = 'Confirmar compra'
            btnConfirmarCompra.id = 'confirmarCompra'
            btnConfirmarCompra.addEventListener('click', async () => {
                if (precioTotalEnCarrito > 0) {
                    if (confirm('Esta seguro de realizar la compra? ')) {
                        const datos = await leerObjetos('datos');
                        enviarNotificacion('Muchas gracias por tu compra, te avisaremos cuando llegue tu producto')
                        let productosEnElCarrito = datos.filter(dato => dato[1].productoCarrito)
                        productosEnElCarrito.forEach(async elemento => {
                            await this.eliminar(elemento[0], { notificacion: 'no' }, 'pc')

                        })
                    }
                } else {
                    enviarNotificacion('No hay productos en el carrito')
                }
            })

            contenedor.appendChild(enunciado);
            contenedor.appendChild(lugarDespacho);
            contenedor.appendChild(destino);
            contenedor.appendChild(labelModoDePago);
            contenedor.appendChild(inputModoPago)
            contenedor.appendChild(labelTargeta)
            contenedor.appendChild(labelTotal);
            contenedor.appendChild(total);
            contenedor.appendChild(btnConfirmarCompra);

            divTerminarCompra.appendChild(contenedor)

            contenedorPrincipal.style.animation = '';
            contenedorPrincipal.appendChild(divTerminarCompra);

            contenedorPrincipal.classList.add('carrito')
            history.pushState({ sitioActual: "carrito" }, ' ', '#carrito');

            contenedorElegirArea.style.animation = 'desaparecerArea 0.3s forwards';
            this.actualizarPrecio();


        }

    }

    async mostrarCelular() {
        const contenedorPrincipal = document.querySelector('.' + this.classContenedorPrincipal);
        const contenedorElegirArea = document.querySelector('.' + this.classContenedorElegirArea);
        const divProductosEnElCarrito = document.createElement('DIV');
        const divTerminarCompra = document.createElement('DIV');


        contenedorPrincipal.innerHTML = '';
        contenedorPrincipal.style.display = 'block';
        contenedorPrincipal.style.animation = 'aparecerArea 1s forwards'

        const datos = await leerObjetos('datos');
        const lista = document.createElement('UL')

        lista.classList.add('listadoProductos')
        if (datos.length > 1) {

            for (let dato in datos) {

                if (datos[dato][1].productoCarrito != undefined) {

                    let descripcion = datos[dato][1].productoCarrito[1][1];

                    if (descripcion.length > 180) {
                        descripcion = descripcion.substring(0, 180) + ' ...'
                    }

                    const nombre = datos[dato][1].productoCarrito[0]
                    const urlImagen = datos[dato][1].productoCarrito[1][0]
                    const cantidad = +datos[dato][1].cantidad
                    let precioUnitario = datos[dato][1].productoCarrito[1][2].substring('1')
                    precioUnitario = +precioUnitario.replaceAll('.', '');
                    const precioTotal = (precioUnitario * cantidad)
                    precioTotalEnCarrito += precioTotal
                    const li = document.createElement("li");


                    li.classList.add('listadoProductoCarrito')

                    li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <img src="${urlImagen}" alt="${nombre}" style="width: 80px; height: auto; border: 1px solid #ccc;" />
                               <div class="">
                                 <h4 style="margin: 0;">${nombre.replace(/_/g, ' ')}</h4>
                                 <p style="margin: 0;">${descripcion}</p>
                                 <p style="margin: 0;">Cantidad: ${cantidad}</p>
                                 <p style="margin: 0;">Precio unitario: $${precioUnitario}</p>
                                 <strong class="precioTotalProducto">Precio total: $${darFormato(precioTotal.toString())}</strong>
                                 <span hidden > </span>
                               </div>
                                <div id='${datos[dato][0]}' class="btnEliminarProductoCarrito"></div>
                             </div>
    `;

                    lista.appendChild(li);
                    divProductosEnElCarrito.appendChild(lista)
                    divProductosEnElCarrito.classList.add('ProductosEnElCarrito')
                }

            }

        } else {
            let li = document.createElement('LI')
            li.innerHTML = `
                             <div style="display: flex; align-items: center; gap: 1em; margin-bottom: 10px;">
                               <div class="">
                                 <h4 style="margin-left:10px; margin-top:20px; font-size:20px ">No Hay productos en el carrito</h4>
                             </div>
    `;

            lista.appendChild(li)
            divProductosEnElCarrito.appendChild(lista)
            divProductosEnElCarrito.classList.add('ProductosEnElCarrito')
        }

        contenedorPrincipal.appendChild(divProductosEnElCarrito);
        this.colocarEvento('celular')
        abrirMenuDesplegable()
        history.pushState({ sitioActual: "carrito" }, ' ', '#carrito');

        contenedorElegirArea.style.animation = 'desaparecerArea 0.3s forwards';
        this.actualizarPrecio();
        divProductosEnElCarrito.style.animation = 'aparecerCarrito 1s forwards';

        divTerminarCompra.style.animation = 'aparecerCarrito 1.9s forwards';


        const contenedor = document.createElement('DIV');
        const enunciado = document.createElement('H1');
        const lugarDespacho = document.createElement('H3')
        const destino = document.createElement('H3');
        const labelTotal = document.createElement('LABEL');
        const total = document.createElement('H2');
        const btnConfirmarCompra = document.createElement('BUTTON');
        const labelModoDePago = document.createElement('LABEL');
        const inputModoPago = document.createElement('INPUT');
        const labelTargeta = document.createElement('LABEL')


        contenedor.className = 'contenedorConfirmarCompraCelular';

        enunciado.textContent = 'Finalizá tu compra'

        lugarDespacho.innerHTML = 'Desde: <b>Florencia, Santa Fe</b>';

        destino.innerHTML = `Hasta: <b>${domicilio}, ${localidad}-${provincia} </b>`;

        total.textContent = `$${darFormato(precioTotalEnCarrito.toString())}`
        total.classList.add('precioTotalEnCarrito');

        labelModoDePago.innerHTML = 'Método de pago: '
        labelModoDePago.id = 'labelMetodoDePago'
        labelTargeta.textContent = '      Mastercard finalizada en: 0092'
        inputModoPago.type = 'radio'
        inputModoPago.setAttribute('checked', '')



        labelTotal.innerHTML = '<br>Precio Total:'

        btnConfirmarCompra.textContent = 'Confirmar compra'
        btnConfirmarCompra.id = 'confirmarCompra'
        btnConfirmarCompra.addEventListener('click', async () => {
            if (precioTotalEnCarrito > 0) {
                if (confirm('Esta seguro de realizar la compra? ')) {
                    const datos = await leerObjetos('datos');
                    enviarNotificacion('Muchas gracias por tu compra, te avisaremos cuando llegue tu producto')
                    let productosEnElCarrito = datos.filter(dato => dato[1].productoCarrito)
                    productosEnElCarrito.forEach(async elemento => {
                        await this.eliminar(elemento[0], { notificacion: 'no' }, 'celular')

                    })
                }
            } else {
                enviarNotificacion('No hay productos en el carrito')
            }
        })

        contenedor.appendChild(enunciado);
        contenedor.appendChild(lugarDespacho);
        contenedor.appendChild(destino);
        contenedor.appendChild(labelModoDePago);
        contenedor.appendChild(inputModoPago)
        contenedor.appendChild(labelTargeta)
        contenedor.appendChild(labelTotal);
        contenedor.appendChild(total);
        contenedor.appendChild(btnConfirmarCompra);

        divTerminarCompra.appendChild(contenedor)

        contenedorPrincipal.style.animation = '';
        contenedorPrincipal.appendChild(divTerminarCompra);


    }
}
const sobreNosotros = () => {
    const contenedorPrincipal = document.querySelector('.contenedorProductos');
    const contenedorElegirArea = document.querySelector('.elegirArea')
    const contenedorSobreNosotros = document.createElement('DIV')

    contenedorProductos.style.display = 'block';

    const bgModal = document.querySelector('.modalBackground');
    console.log(bgModal.style.display);
    if (bgModal.style.display == '' || bgModal.style.display == 'none') {
        contenedorElegirArea.style.animation = 'desaparecerArea 1s forwards'
        contenedorPrincipal.innerHTML = ''

        const htmlCode = `
    
     <h1>¡Bienvenidos a nuestra tienda online de artículos de pesca y carnadas!</h1>
     <p>Somos un equipo de cuatro jóvenes emprendedores, Nahuel Giménez, Suarez Alan, Adán Ledesma y Lautaro De Martin, todos alumnos de 5° año de la EESO N° 267. </p>
     <p>Este sitio web es el complemento de un proyecto de microemprendimiento que nació de nuestra pasión compartida por la pesca y el deseo de ofrecer productos de calidad a la comunidad pesquera.</p>
    <p>Adán Ledesma, el creador de este espacio digital, invirtió más de 57 horas en el desarrollo de este sitio, desde la concepción inical hasta la implementacion final. Cada línea de código, cada imagen y cada detalle fueron cuidadosamente pensados para brindar una experiencia de usuario intuitiva y agradable.</p>

    <p>Pero somos más que solo un sitio web.  Somos un equipo comprometido con la excelencia, La innovación y el servicio al cliente. Nuestra misión es proporcionar a los pescadores de todas las edades y niveles de experiencia los mejores productos y el ascesoramiento experto que necesitan para disfrutar al máximo de su pasión.</p>
    <p>¿Qué nos diferencia? Además de nuestra dedicación y experiencia, somos estudiantes que entendemos las necesidades y los desafíos de la comunidad local. Nos esforzamos por ofrecer precios competitivos, con una amplia selección  de productos y un servicio personalizado que supera las expectativas.</p>
    <span >Este sitio fue creado con fines educativos y no cuenta con una funcionalidad real de envios, tampoco guardamos  información de los usuarios que visiten esta página. </span>
    <p align='center'>Proyecto finalizado el 20 de octubre de 2025</p>
    `

        if (!document.querySelector('.contenedorSobreNosotros')) {
            contenedorSobreNosotros.innerHTML = htmlCode;
            contenedorSobreNosotros.className = 'contenedorSobreNosotros'
            contenedorPrincipal.style.animation = 'aparecer 1s forwards';
            contenedorPrincipal.appendChild(contenedorSobreNosotros);


        } else {
            contenedorPrincipal.style.animation = 'aparecer 1s forwards';
            let contenedorSobreNosotrosVisible = document.querySelector('.contenedorSobreNosotros')
            contenedorSobreNosotrosVisible.style.display = 'block';
        }
        moverFooter('defecto');
    }
}

const abrirMenuDesplegable = () => {
    const menuDesplegable = document.querySelector('.menuDesplegableLaptop');
    menuDesplegable.style.animation = '';
    requestAnimationFrame(() => {
        if (menuDesplegable.classList.contains('activo')) {
            menuDesplegable.classList.remove('activo')
            menuDesplegable.classList.add('inactivo')
        } else {
            menuDesplegable.classList.remove('inactivo')
            menuDesplegable.classList.add('activo')
        }
    })
}

const mostrarBuscadorCelular = () => {
    const divBuscador = document.querySelector('.buscadorCelular');
    const imgBuscador = document.getElementById('buscarCelular');
    const imgMenu = document.querySelector('.imgMenu');
    if (divBuscador.style.display != 'block') {
        divBuscador.style.display = 'block'
        imgBuscador.style.left = '340px'
        imgMenu.style.display = 'none';

    } else {
        divBuscador.style.display = 'none'
        imgBuscador.removeAttribute('style')
        imgMenu.style.display = 'inline-block';
    }
}


const carrito = new Carrito();
carrito.classContenedorPrincipal = 'contenedorProductos';
carrito.classContenedorElegirArea = 'elegirArea';


const contenedorProductos = document.querySelector('.contenedorProductos');
contenedorProductos.style.display = 'none';
