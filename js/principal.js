
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
    console.log('se creo la base de datos')
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

//productos
const productos = {
    carnadas: {
        Lombrices: ["../img/productos/Lombrices.jpg", "bolsa de 100 g de Lombrices", "$1800"],
        Morena: ["../img/productos/Lombrices.jpg", "descripción adhffjjddfjfhsjfjhjfhsjhfjjjhjfhsjhsjdfjhsdjfhjsdfjhsdjdfhjshfjhdjfhjshfjhdjfhsdjhjfhjsdhfjsdjfjsdhfjshdjfsjdhfsfdshfsjsfhshdjfhsjfjsjfhjsfjsdjfdjjsjsfsdjfjsdjfjd", "$3000"],
        Cascara: ["../img/productos/Lombrices.jpg", "mejor calidad", "$3200"],
        Anguila: ["../img/productos/Lombrices.jpg", "descripción", "$4800"],
        Sábalo: ["../img/productos/Lombrices.jpg", "descripción", "$3200"],
        Mojarra: ["../img/productos/Lombrices.jpg", "Paquete 500g", "$1500"],
    },
    articulosPesca: {
        Riles: ["../img/productos/Lombrices.jpg", "A elección ", "$20.000"],
        anzuelos: ["../img/productos/Lombrices.jpg", "Todas las medidas", "$1800"],
        Caña_de_Pescar: ["../img/productos/Lombrices.jpg", "descripción", "$30.000"],
        Lider_de_Pesca: ["../img/productos/Lombrices.jpg", "cada unidad", "$800"],
        lineas_para_pescar: ["../img/productos/Lombrices.jpg", "lineas ultra resistentes de cualquier diámetro X 100 M", "$5000"],
        Señuelos_para_pesca: ["../img/productos/Lombrices.jpg", "descripcion", "$1000"],
    }
}

//escucha de eventos 
document.getElementById('zonaDeEntrega').addEventListener('click', e => {
    let labelDireccionDeEntrega = document.getElementById('zonaDeEntrega');

    e.preventDefault()
    if (labelDireccionDeEntrega.textContent == 'Elegir zona de entrega:') {
        elegirZonaDeEntrega()
    } else {
        modificarZonaDeEntrega()
    }
})
document.getElementById('btnCargarCarnadas').addEventListener('click', () => {
    cargarProductos('carnadas');
    if(history.state.sitioActual!='carnadas') history.pushState({ sitioActual: "carnadas" }, '', '#carnadas')

})

document.getElementById('btnCargarArticulosPesca').addEventListener('click', () => {
    cargarProductos('articulosPesca');
    if(history.state.sitioActual!='articulosPesca')  history.pushState({ sitioActual: "articulosPesca" }, '', '#articulosPesca')

})
window.addEventListener('load', () => {
    cargarLugarDeEntrega()
    cargarUsuario()
    history.replaceState({ sitioActual: 'inicio' }, '', '/')

})

window.addEventListener('click', (e) => {
    const cuenta = document.querySelector('.menuCuentaPc');
    const contenedorSugerencias = document.querySelector('.contenedorSugerenciasBusqueda');
    let imgFotoPerfil = document.getElementById('cuenta')

    if (!e.target.matches('#cuenta') && cuenta.classList.contains('active')) cerrarLogin()


    if (!e.target.matches('.contenedorSugerenciasBusqueda' && contenedorSugerencias.innerHTML != '')) {
        contenedorSugerencias.innerHTML = ''

    }


})

window.addEventListener('popstate', (e) => {
    state = e.state;
    console.log(e.state)
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
    if(e.state.sitioActual=='mostrarProducto'){
        console.dir(e.state.producto);
        mostrarProducto(e.state.producto);
      
    }

})

document.getElementById('lugarDespacho').addEventListener('click', e => {
    e.preventDefault();
    abrirModal('mapaLugarDespacho')
})

document.getElementById('cuenta').addEventListener('click', () => {
    mostrarUsuario('pc');
    let imgFotoPerfil = document.getElementById('cuenta')
    imgFotoPerfil.classList.toggle('seccionActiva');

})



document.querySelector('.btnCerrarSesion').addEventListener('click', (e) => {
    if (e.target.classList.contains('iniciarSesion')) {
        iniciarSesion()
    } else {
        cerrarSesion()
    }

})

document.getElementById('carrito').addEventListener('click', () => {
    carrito.mostrar('pc');
})

document.getElementById('buscar').addEventListener('input', (e) => {
    sugerirProductos()
    e.target.setAttribute('autocomplete', 'none')
})
document.getElementById('buscar').addEventListener('click', () => {
    sugerirProductos()
})


//funciones del header

const cargarLugarDeEntrega = () => {
    leerObjetos('datos').then(dato => {
        if (dato[0][1].ubicacion != undefined) {
            localidad = dato[0][1].ubicacion[0]
            codigoPostal = dato[0][1].ubicacion[1]
            provincia = dato[0][1].ubicacion[2]
            domicilio = dato[0][1].ubicacion[3]
            keyUbicacion = dato[0][0];

            let labelDireccionDeEntrega = document.getElementById('zonaDeEntrega');
            if (domicilio.length > 18) {
                labelDireccionDeEntrega.textContent = `${domicilio}, ${localidad} ...`
            } else {
                labelDireccionDeEntrega.textContent = `${domicilio}, ${localidad} ${provincia}`
            }
        }
    }
    )
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
            bgModal.style.animation = 'aparecer 0.2s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';
        } else if (tipoDeApertura == 'mensaje') {
            let htmlCode = `
            <h2 id="tituloMensaje">${titulo}</h2>
            <h3 id="mensajeModal">${mensaje}</h3>
            `

            window.scroll({ top: 0, behavior: 'smooth' })
            modal.innerHTML = htmlCode;
            bgModal.style.animation = 'aparecer 0.4s forwards'
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
            bgModal.style.animation = 'aparecer 0.4s forwards'
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
            bgModal.style.animation = 'aparecer 0.4s forwards'
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

//funcion para mostrar las areas 
const mostrarAreas = () => {
    const contenedorProductos = document.querySelector('.contenedorProductos');
    const divElegirArea = document.querySelector('.elegirArea');

    contenedorProductos.style.animation = 'desaparecerArea 0.6s forwards'
    divElegirArea.style.animation = 'aparecerArea 0.6s forwards';
}

//Función para cargar los productos
const cargarProductos = (areaACargar) => {

    const contenedorProductos = document.querySelector('.contenedorProductos');
    const divElegirArea = document.querySelector('.elegirArea')
    divElegirArea.style.animation = 'desaparecerArea 0.6s forwards'

    contenedorProductos.style.animation = ''

    window.scroll({ top: 0, behavior: "smooth" })
    contenedorProductos.innerHTML = '';

    for (let area in productos) {
        if (areaACargar == area) {
            for (let nombreProducto in productos[area]) {
                if (nombreProducto.includes('_')) {
                    nombreProductoFormateado = nombreProducto.replaceAll('_', ' ');
                    console.log('pass')
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
                img.style.cursor='pointer'
                img.src = productos[area][nombreProducto][0]

                nombreDelProducto.classList.add('nombreProducto');
                nombreDelProducto.textContent = nombreProductoFormateado;

                descripcionProducto.className = 'descripcion';
                if( productos[area][nombreProducto][1].length>90){
                    let verMas= document.createElement('A');
                    verMas.textContent='Ver más'
                     verMas.id='btnVerMas'
                    verMas.addEventListener('click',(e)=>{
                        e.preventDefault();
                        mostrarProducto({ [nombreProducto]: productos[area][nombreProducto] })
                    })

                    descripcionProducto.textContent = productos[area][nombreProducto][1].substring(0,90) +'... '
                    descripcionProducto.appendChild(verMas)
                }else{
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
                    console.log('listo')
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

                contenedorProductos.appendChild(producto);
            }
        }
    }
}

const mostrarUsuario = (tipoDeApertura) => {
    if (tipoDeApertura) {
        if (tipoDeApertura == 'pc') {
            const contenedorInfoLogin = document.querySelector('.menuCuentaPc');
            if (contenedorInfoLogin.classList.contains('active')) {
                document.querySelector('.menuCuentaPc').style.animation = 'desaparecerArea 0.8s forwards'
                setTimeout(() => {
                    contenedorInfoLogin.classList.toggle('active')
                }, 802)

            } else {
                contenedorInfoLogin.classList.toggle('active')
                document.querySelector('.menuCuentaPc').style.animation = 'aparecerArea 0.5s forwards'
            }
        }
    }
}

const cerrarSesion = () => {
    if (nombreUsuario && fotoDePerfil) {
        if (confirm(`Esta seguro que quiere cerrar la sesion de: ${nombreUsuario} ?`)) {
            nombreUsuario = undefined;
            fotoDePerfil = undefined;
            cargarUsuario()
        }
    }
}

const iniciarSesion = () => {
    fetch('../datos/Administradores.json')
        .then(usuarios => usuarios.json())
        .then(usuario => {
            Object.assign(usuariosAdministradores, usuario);
        })
    cerrarLogin()
    abrirModal('iniciarSesion')
}

const cargarUsuario = () => {
    const nombreCompleto = document.getElementById('nombreYApellido');
    const fotoPerfil = document.getElementById('fotoPerfil');
    const btnCerrarSesion = document.querySelector('.btnCerrarSesion');

    if (nombreUsuario && fotoDePerfil) {
        nombreCompleto.textContent = nombreUsuario;
        fotoPerfil.src = fotoDePerfil;
    } else {
        fotoPerfil.src = '';
        nombreCompleto.textContent = 'No se ha iniciado sesión';
        btnCerrarSesion.textContent = 'Iniciar Sesión'
        btnCerrarSesion.classList.add('iniciarSesion');
    }
}

const cerrarLogin = () => {
    const contenedorInfoLogin = document.querySelector('.menuCuentaPc');
    let imgFotoPerfil = document.getElementById('cuenta')

    contenedorInfoLogin.style.animation = 'desaparecerArea 0.8s forwards'
    setTimeout(() => {
        contenedorInfoLogin.classList.toggle('active')
    }, 802)
    imgFotoPerfil.classList.toggle('seccionActiva');
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

const sugerirProductos = () => {
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

    if(history.state.sitioActual!='mostrarProducto') history.pushState({sitioActual:'mostrarProducto', producto:producto},'',`#producto:${nombreProducto}`)


    contenedorPrincipal.innerHTML = '';


    if (nombreProducto.includes('_')) {
        nombreProductoFormateado = nombreProducto.replaceAll('_', ' ');
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
        console.log('listo')
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

//objeto Carrito de compras

class Carrito {

    classContenedorPrincipal = ''
    classContenedorElegirArea = ''
    productosComprados = {}
    añadir(producto) {

    }
    eliminar(producto) {

    }
    actualizar() {

    }
    mostrar(tipo) {

        if (tipo == 'pc') {
            const contenedorPrincipal = document.querySelector('.' + this.classContenedorPrincipal);
            const contenedorElegirArea = document.querySelector('.' + this.classContenedorElegirArea);
            const enunciado = document.createElement('H2');


            history.pushState({ sitioActual: "carrito" }, ' ', '#carrito');

            contenedorElegirArea.style.animation = 'ocultarNotificacion 1s forwards';



        }
    }

}
const carrito = new Carrito();
carrito.classContenedorPrincipal = 'contenedorProductos';
carrito.classContenedorElegirArea = 'elegirArea'




