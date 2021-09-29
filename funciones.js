////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////                Funciones auxiliares                ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const buscarPorId = (pId, pArreglo) => {
    let respuesta = pArreglo.filter(elemento => elemento.id == pId);
    if(respuesta[0])
        return respuesta[0];
    return false;
}

// Extrar informacion de formularios de smart home
const extraerInfoForm = pForm => {
    const form = pForm;
    const elementos = form.children;
    let contenido = [];
    let i = 0;

    // Recorro los elementos del formulario y extraigo los datos
    for(let elemento of elementos){
        if(elemento.type != 'submit'){
            if(elemento.lastElementChild.type != 'checkbox'){
                contenido[i++] = elemento.lastElementChild.value;
            }
            else {
                contenido[i++] = elemento.lastElementChild.checked;
            }
        }
    }
    return contenido;
}

// Extrar informacion de formulario POOL de smart home
const extraerInfoPoolForm = pForm => {
    const form = pForm;
    const elementos = form.children;
    let contenido = [];
    let i = 0;

    // Recorro los elementos del formulario y extraigo los datos
    for(let elemento of elementos){
        if(elemento.type != 'submit'){
            // Chequeo que no sean el div que contiene 4 hijos (las 2 cantidades)
            if(elemento.classList.contains('input-container')){
                contenido[i++] = elemento.lastElementChild.value;
            }
            else {
                // Saco la info seleccionando el elemento correcto de cantidad
                contenido[i++] = elemento.firstElementChild.lastElementChild.value;
                contenido[i++] = elemento.lastElementChild.lastElementChild.value;
            }
        }
    }
    return contenido;
}
const traducirInfoPool = (pPoolInfo) => {
    const cantidad = [];
    const info = [];
    let indiceCantidad = 0;
    let indice = 0;

    for(let dato of pPoolInfo){
        // Si es numerico ya se que son las cantidades de las luces
        // Si no son tipo y potencia de las luces
        if(isNaN(parseInt(dato))){
            switch (dato){
                case 'a':
                    info[indice++] = 'RGB';
                    break;
                case 'b':
                    info[indice++] = 'Calida';
                    break;
                case 'c':
                    info[indice++] = 'Fria';
                    break;
                case 'd':
                    info[indice++] = '12 watts';
                    break;
                case 'e':
                    info[indice++] = '16 watts';
                    break;
                case 'f':
                    info[indice++] = '24 watts';
                    break;
            }
        }
        else {
            cantidad[indiceCantidad++] = dato;
        }  
    }
    let infoFinal = [];
    infoFinal[0] = 'Luminarias exteriores';
    infoFinal[1] = info[0] + ' ' + info[1];
    infoFinal[2] = cantidad[0];
    infoFinal[3] = 'Luminarias sumergibles';
    infoFinal[4] = info[2] + ' ' + info[3];
    infoFinal[5] = cantidad[1];
    infoFinal[6] = cantidad[2]; // precio
    return infoFinal;
}


// Visualizar la lista de los elemenots de sistemas
const mostrarItemsRegistrados = (pArrayItems, pSistema) => {
    const fragmento = document.createDocumentFragment();
    let listaId = '';
    let classNameLI = '';
    let noItem = '';
    // Identifico el istema a visulaizar
    switch (pSistema){
        case 'usuarios':
            listaId= 'lista-user';
            classNameLI = 'user-item';
            noItem = 'No hay usuarios registrados';
            break;
        case 'homes':
            listaId= 'lista-home';
            classNameLI = 'home-item';
            noItem = 'No hay smart homes registradas';
            let headerList = document.createElement('LI');
            headerList.classList.add(classNameLI);
            headerList.innerHTML = `<p>Id de home</p>
                <p>Elementos simples</p>
                <p>Huertas</p>
                <p>Piscinas</p>
                <p> - </p>`;
            fragmento.appendChild(headerList);
            break;
        case 'membresias':
            listaId= 'lista-memb';
            classNameLI = 'memb-item';
            noItem = 'No hay membresias cargadas activas actualmente';
            break;
        case 'luces':
            listaId= 'lista-luminarias';
            classNameLI = 'luz-item';
            noItem = 'No hay luminarias cargadas en la home actual';
            break;
        case 'accesos':
            listaId= 'lista-accesos';
            classNameLI = 'access-clima-item';
            noItem = 'No hay accesos cargados en la home actual';
            break;
        case 'clima':
            listaId= 'lista-climas';
            classNameLI = 'access-clima-item';
            noItem = 'No hay climatizadores cargados en la home actual';
            break;
        case 'sensores':
            listaId= 'lista-sensores';
            classNameLI = 'sensor-item';
            noItem = 'No hay sensores cargados';
            break;
        case 'huerta':
            listaId= 'lista-huertas';
            classNameLI = 'huerta-item';
            noItem = 'No hay huertas cargadas en la home actual';
            break;
        case 'pool':
            listaId= 'lista-pool';
            classNameLI = 'pool-item';
            noItem = 'No hay piscinas cargadas en la home actual';
            break;
    }
    const listaDeItems = document.getElementById(listaId);
    let itemInfo;
    // Recorro el arreglo del sistema y creo los LI de cada elemento
    // con su contenido, clase y evento
    if(pArrayItems.length > 0){
        for(let item of pArrayItems){
            itemInfo = document.createElement('LI');
            itemInfo.classList.add(classNameLI);
            itemInfo.innerHTML = item.obtenerInfoRegistro();
            itemInfo.lastElementChild.addEventListener('click', (e) => {
                eliminarElemento(e.target);
                mostrarItemsRegistrados(pArrayItems, pSistema);
            })
            fragmento.appendChild(itemInfo);
        }
    }
    else {
        itemInfo = document.createElement('LI');
        itemInfo.classList.add('no-item');
        itemInfo.innerHTML = noItem;
        fragmento.appendChild(itemInfo);
    }
    listaDeItems.innerHTML = '';
    listaDeItems.appendChild(fragmento);
}

const encontrarPosicion = (pElementoABorrar) => {
    let i = 0;
    let elemento = pElementoABorrar.previousElementSibling;
    while(elemento){
        i++;
        elemento = elemento.previousElementSibling;
    }
    return i;
}

const liberarHome = (pIdHome, pHomesArray) => {
    const home = buscarPorId(pIdHome, pHomesArray);
    home.libre = true;
}

const liberarHomesBorradoUser = (pUser, pHomesArray) => {
    if(pUser.membresias.length > 0){
        for(const m of pUser.membresias){
            liberarHome(m.idHome, pHomesArray);
        }
    }
}

const eliminarElemento = (boton) => {
    const elementos = boton.parentElement.parentElement;
    let idList = elementos.getAttribute('id');
    if(idList == null){ idList = 'lista-memb' }
    let indice = 0;
    let idText;

    indice = encontrarPosicion(boton.parentElement);
    switch (idList){
        case 'lista-luminarias':
            actualSmartHome.luces.splice(indice, 1);
            console.log('Borre una luz');
            break;
        case 'lista-accesos':
            actualSmartHome.accesos.splice(indice, 1);
            console.log('Borre un acceso');
            break;
        case 'lista-climas':
            actualSmartHome.climatizadores.splice(indice, 1);
            console.log('Borre un climatizador');
            break;
        case 'lista-sensores':
            actualSensorsArray.splice(indice, 1);
            console.log('Borre un sensor');
            break;
        case 'lista-huertas':
            actualSmartHome.huertas.splice(indice, 1);
            console.log('Borre una huerta');
            break;
        case 'lista-pool':
            actualSmartHome.pool.splice(indice, 1);
            console.log('Borre una piscina ');
            break;
        case 'lista-home':
            idText = boton.parentElement.firstElementChild.textContent;
            borrarMembresia(parseInt(idText));
            indiceHome = admin.smartHomes.findIndex(h => h.id == parseInt(idText));
            admin.smartHomes.splice(indiceHome, 1);
            admin.almacenarEnStorage('homes');
            admin.almacenarEnStorage('usuarios');
            cargarSelectMembresias('home');
            mostrarMembresias(admin.agruparMembresias());
            console.log('Borre una smart home');
            break;
        case 'lista-user':
            idText = boton.parentElement.children[4].textContent;
            indiceUsr = admin.usuarios.findIndex(u => u.id == parseInt(idText.slice(15)));
            liberarHomesBorradoUser(admin.usuarios[indiceUsr], admin.smartHomes);
            admin.usuarios.splice(indiceUsr, 1);
            admin.almacenarEnStorage('usuarios');
            cargarSelectMembresias('user');
            cargarSelectMembresias('home');
            mostrarMembresias(admin.agruparMembresias());
            console.log('Borre un usuario');
            break;
        case 'lista-memb':
            idText = boton.parentElement.children[1].textContent;
            liberarHome(parseInt(idText.slice(6)), admin.smartHomes);
            borrarMembresia(parseInt(idText.slice(6)));
            admin.almacenarEnStorage('usuarios');
            cargarSelectMembresias('home');
            console.log('Borre una membresía');
            break;
    }
}

const mostrarMembresias = (pMembresias) => {
    const membresias = pMembresias[0];
    const idUsuarios = pMembresias[1];
    let indice = 0;

    const fragmento = document.createDocumentFragment();
    const listaDeMembresias = document.getElementById('lista-memb');
    let membInfo;
    // Recorro el arreglo del sistema y creo los LI de cada elemento
    // con su contenido, clase y evento
    if(membresias.length > 0){
        for(let item of membresias){
            let usuario = buscarPorId(idUsuarios[indice++], admin.usuarios);
            membInfo = document.createElement('LI');
            membInfo.classList.add('memb-li');
            membInfo.innerHTML = item.obtenerInfoRegistro(usuario);
            membInfo.firstElementChild.lastElementChild.addEventListener('click', (e) => {
                eliminarElemento(e.target);
                mostrarMembresias(admin.agruparMembresias());
            });
            fragmento.appendChild(membInfo);
        }
    }
    else {
        membInfo = document.createElement('LI');
        membInfo.classList.add('no-item');
        membInfo.innerHTML = 'No hay membresias activas actualmente';
        fragmento.appendChild(membInfo);
    }
    listaDeMembresias.innerHTML = '';
    listaDeMembresias.appendChild(fragmento);
}

const borrarMembresia = (pIdHome) => {
    let indiceMemb = 0;
    for(const user of admin.usuarios){
        if(user.membresias.length > 0){
            indiceMemb = user.membresias.findIndex(m => m.idHome == pIdHome);
            if(indiceMemb >= 0){
                user.membresias.splice(indiceMemb, 1);
                break;
            }     
        }
    }
}

const cargarSelectMembresias = (pSelect) => {
    let select;
    const fragmento = document.createDocumentFragment();
    
    if(pSelect == 'user'){
        select = document.getElementById('memb-user');
        select.innerHTML = '';
        if(admin.usuarios.length > 0){
            for(const user of admin.usuarios){
                const option = document.createElement('OPTION');
                option.setAttribute('value', `${user.id}`);
                option.innerHTML = `${user.nombre} ${user.apellido}`;
                fragmento.appendChild(option);
            }
            fragmento.firstElementChild.setAttribute('selected','');
            select.appendChild(fragmento);
        }
        else {
            select.innerHTML = `<option value="0" selected>Usuarios disponibles</option>`              
        }
    }
    else {
        select = document.getElementById('memb-home');
        select.innerHTML = '';
        if(admin.smartHomes.length > 0){
            for(const home of admin.smartHomes){
                if(home.libre){
                    const option = document.createElement('OPTION');
                    option.setAttribute('value', `${home.id}`);
                    option.innerHTML = `Id home: ${home.id}`;
                    fragmento.appendChild(option);
                }
            }
            if(fragmento.hasChildNodes()){
                fragmento.firstElementChild.setAttribute('selected','');
                select.appendChild(fragmento);
            }
            else{
                select.innerHTML = `<option value="0" selected>Homes no disponibles</option>`;
            }
        }
        else {
            select.innerHTML = `<option value="0" selected>Homes no disponibles</option>`;              
        }
    }
}