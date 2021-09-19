// Variables
const formLogin = $('#form-login');
let administrador;
const usuariosSatisfechos = [];
let i = 0;

// Funciones
const mostrarComentarios = () => {
    if(i >= usuariosSatisfechos.length){
        i = 0;
    }
    $('#comentarios div').fadeOut(700);
    $('#comentarios').html(`
    <h3>Experiencias</h3>
    <div class="coment-container">
        <div class="img-container">
            <img src="${usuariosSatisfechos[i].avatar_url}">
        </div>
        <p><b>${usuariosSatisfechos[i].login}</b>
        <p>"${usuariosSatisfechos[i].comentario}"</p>
    </div>`);
    i++;
    $('#comentarios div').hide().fadeIn(700);
}

// Event listeners
formLogin.submit(e => {
    e.preventDefault();
    let usuario = $('#mail-login').val();
    let contra = $(':password').val();

    // Chequeo si es admin
    administrador = JSON.parse(localStorage.getItem('admin'));
    if(usuario == administrador.user && contra == administrador.password){
        window.location.assign('file:///home/alejo/Documentos/Coder_js/proyecto_final_js/proyecto/plataforma-admin.html');
    }
    else { /* Chequeo si es usuario normal */
        alert('Aun no esta implementado login de usuarios');
    }
    
});

$( document ).ready(function() {
    //Declaramos la url del API
    const APIURL = 'https://api.github.com/users';
    
    const userComents = [
        "Este sistema me ha cambiado la vida, me ahorra tiempo, dinero y hace todo mas simple.\nSuper recomendable",
        "Vengan a conocer a estos chicos, son profesionales y me dejaron la home buenarda",
        "Estoy mucho tiempo fuera de casa y gracias a este sistema puedo estar tranquilo y monitorear mi hogar desde cualquier lugar!",
        "El sistema genial, la atencion y el trato aun mejor!\nAdemas siempre ofrecen facilidades en los pagos para que todos puedan disfrutar de este sistema!"
    ]; 

    $.getJSON(APIURL, (respuesta, estado) => {
        if(estado === "success"){
            for(let i = 0; i < 4; i++){
                respuesta[i].comentario = userComents[i];
                usuariosSatisfechos.push(respuesta[i]);
            }
            
        }
    });
});


// Programa
administrador = localStorage.getItem('admin');
if(!administrador){
    let nuevoAdmin = {user : 'admin@1', password : '4321'};
    localStorage.setItem('admin', JSON.stringify(nuevoAdmin));
}

// Comentarios de usuarios
setTimeout(mostrarComentarios, 700);
comentariosDinamicos = setInterval(mostrarComentarios, 4000);

