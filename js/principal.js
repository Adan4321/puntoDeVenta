
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

//productos
const productos = {
    carnadas: {
        Lombrices: ["../img/productos/Lombrices.jpg", "bolsa de 100 g de Lombrices","1800"],
        Morena: ["../img/productos/Lombrices.jpg", "descripción", "3000"],
        Cascara: ["../img/productos/Lombrices.jpg", "mejor calidad", "3200"],
        Anguila: ["../img/productos/Lombrices.jpg", "descripción", "4800"],
        Sábalo: ["../img/productos/Lombrices.jpg", "descripción", "3200"],
        Mojarra: ["../img/productos/Lombrices.jpg", "Paquete 500g","1500"],
    },
    articulosPesca: {
        Riles: ["../img/productos/Lombrices.jpg", "A elección ", "20.000"],
        anzuelos: ["../img/productos/Lombrices.jpg", "Todas las medidas", "1800"],
        Caña_de_Pescar: ["../img/productos/Lombrices.jpg", "descripción", "30.000"],
        Lider_de_Pesca: ["../img/productos/Lombrices.jpg", "cada unidad", "800"],
        lineas_para_pescar: ["../img/productos/Lombrices.jpg", "lineas ultra resistentes de cualquier diámetro X 100 M", "5000"],
        Señuelos_para_pesca: ["../img/productos/Lombrices.jpg", "descripcion", "1000"],
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
    history.pushState({sitioActual:"carnadas"},'', '#carnadas')
  
})

document.getElementById('btnCargarArticulosPesca').addEventListener('click', () => {
    cargarProductos('articulosPesca');
    history.pushState({sitioActual:"articulosPesca"},'', '#articulosPesca')

})
window.addEventListener('load', () => {
    cargarLugarDeEntrega()
    history.replaceState({sitioActual:'inicio'},'','/')
})

//guardar estado de la página
const guardarEstado=()=>{
    const contenido=document.querySelector('.documento').innerHTML;
    sessionStorage.setItem('contenidoDiv',contenido);
}

window.addEventListener('popstate',(e)=>{
    state= e.state;
    console.log(e.state)
    if(e.state== null || e.state.sitioActual=='inicio'){
        console.log('pass')
        history.replaceState({sitioActual:'inicio'},'','/')
       location.reload()
    }
    if(e.state.sitioActual=='carnadas'){
        cargarProductos('carnadas');
        console.log('pass2')
        history.pushState({sitioActual:"carnadas"},'', '#carnadas')
    }
    if(e.state.sitioActual=='articulosPesca'){
        cargarProductos('articulosPesca');
        console.log('pass3')
        history.pushState({sitioActual:"articulosPesca"},'', '#articulosPesca')
    }

})

document.getElementById('lugarDespacho').addEventListener('click',e=>{
    e.preventDefault();
    abrirModal('mapaLugarDespacho')

   
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
            bgModal.style.animation = 'aparecer 0.2s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';

        }else if(tipoDeApertura=='mapaLugarDespacho'){
            let htmlCode = `
            <h2 id="tituloMensajeDespacho">Lugar de despacho:</h2>
             <img id="imgMapaDespacho" src="../img/mapaLugarDespacho.png" width="300px" alt="">
            `

            window.scroll({ top: 0, behavior: 'smooth' })
            modal.innerHTML = htmlCode;
            document.getElementById('imgMapaDespacho').addEventListener('click',()=>{
                window.open(document.getElementById('imgMapaDespacho').src)
            })
            bgModal.style.animation = 'aparecer 0.2s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';

        }

    } else {
        console.log('Errror al abrir modal: no se definio el tipo de apertura')
    }

}

//funcion para mostrar las areas 
const mostrarAreas=()=>{
    const contenedorProductos= document.querySelector('.contenedorProductos');
    const divElegirArea = document.querySelector('.elegirArea');

    contenedorProductos.style.animation='desaparecerArea 0.6s forwards'
    divElegirArea.style.animation='aparecerArea 0.6s forwards';
}

//Función para cargar los productos
const cargarProductos = (areaACargar) => {

    const contenedorProductos = document.querySelector('.contenedorProductos');
    const divElegirArea = document.querySelector('.elegirArea')
    divElegirArea.style.animation='desaparecerArea 0.6s forwards'

    contenedorProductos.style.animation=''

    window.scroll({top:0, behavior:"smooth"}) 
    contenedorProductos.innerHTML = '';
    
    for (let area in productos) {
        if (areaACargar == area) {
            for (let nombreProducto in productos[area]) {
                if (nombreProducto.includes('_')){
                    nombreProductoFormateado = nombreProducto.replaceAll('_',' ');
                    console.log('pass')
                }else{
                    nombreProductoFormateado= nombreProducto;
                }

                const producto = document.createElement('DIV');
                const img = document.createElement('IMG');
                const nombreDelProducto = document.createElement('H3');
                const descripcionProducto = document.createElement('P');
                const precioProducto = document.createElement('P');
                const labelCantidad = document.createElement('LABEL');
                const inputCantidad = document.createElement('INPUT');
                const btnAgregar = document.createElement('BUTTON');

                producto.classList.add('producto');

                img.id = 'imgProducto';
                img.style.width = '200px';
                img.src = productos[area][nombreProducto][0]

                nombreDelProducto.classList.add('nombreProducto');
                nombreDelProducto.textContent = nombreProductoFormateado;

                descripcionProducto.className = 'descripcion';
                descripcionProducto.textContent = productos[area][nombreProducto][1]

                precioProducto.className = 'precioProducto';
                precioProducto.textContent = productos[area][nombreProducto][2]

                labelCantidad.setAttribute('for', 'cantidad');
                labelCantidad.textContent = 'Cantidad';

                inputCantidad.setAttribute('type', 'number');
                inputCantidad.setAttribute('name', 'cantidad');
                inputCantidad.className = 'classInputCantidad';
                inputCantidad.id = 'inputCantidad';

                btnAgregar.className = 'btnAagregar';
                btnAgregar.textContent = 'Añadir';
                btnAgregar.addEventListener('click', () => {
                    console.log('listo')
                })

                producto.appendChild(img);
                producto.appendChild(nombreDelProducto);
                producto.appendChild(descripcionProducto);
                producto.appendChild(precioProducto);
                producto.appendChild(labelCantidad);
                producto.appendChild(inputCantidad);
                producto.appendChild(btnAgregar);

                contenedorProductos.appendChild(producto);
            }
        }
    }
}
