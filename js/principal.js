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
var productos ={};


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

window.addEventListener('load', () => {
    cargarLugarDeEntrega()
    cargarProductos()
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
            if (domicilio.length > 20) {
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
            window.scroll({ top: 0 , behavior:'smooth' })
            bgModal.style.animation = 'aparecer 0.2s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';
        }else if (tipoDeApertura == 'mensaje') {
            let htmlCode = `
            <h2 id="tituloMensaje">${titulo}</h2>
            <h3 id="mensajeModal">${mensaje}</h3>
            `
    
            window.scroll({ top: 0 , behavior:'smooth' })
            modal.innerHTML=htmlCode;
            bgModal.style.animation = 'aparecer 0.2s forwards'
            bgModal.style.display = 'flex';
            body.style.overflow = 'hidden';
    
        }

    }else {
        console.log('Errror al abrir modal: no se definio el tipo de apertura')
    }

}

//Función para cargar los productos
const cargarProductos = async () => {
    await fetch('../datos/productos.json')
        .then(dato => dato.json())
        .then(dato => {
            const contenedorProductos = document.querySelector('.contenedorProductos');
            contenedorProductos.innerHTML=''
            for (let nombreProducto in dato) {
                productos.nombreProducto=[nombreProducto[0],nombreProducto[1],nombreProducto[2] ]

                const producto=document.createElement('DIV');
                const img =document.createElement('IMG');
                const nombreDelProducto= document.createElement('H3');
                const descripcionProducto= document.createElement('P');
                const precioProducto= document.createElement('P');
                const labelCantidad= document.createElement('LABEL');
                const inputCantidad= document.createElement('INPUT');
                const btnAgregar= document.createElement('BUTTON');
                
                producto.classList.add('producto');
            
                img.id='imgProducto';
                img.style.width='200px';
                img.src=dato[nombreProducto][0]
            
                nombreDelProducto.classList.add('nombreProducto');
                nombreDelProducto.textContent=nombreProducto;
            
                descripcionProducto.className='descripcion';
                descripcionProducto.textContent=dato[nombreProducto][1]
            
                precioProducto.className='precioProducto';
                precioProducto.textContent=dato[nombreProducto][2]
            
                labelCantidad.setAttribute('for','cantidad');
                labelCantidad.textContent='Cantidad';
            
                inputCantidad.setAttribute('type','number');
                inputCantidad.setAttribute('name','cantidad');
                inputCantidad.className='classInputCantidad';
                inputCantidad.id='inputCantidad';
            
                btnAgregar.className='btnAagregar';
                btnAgregar.textContent='Añadir';
                btnAgregar.addEventListener('click',()=>{
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
        })       
}