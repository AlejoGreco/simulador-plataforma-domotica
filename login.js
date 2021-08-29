// Variables
const formLogin = $('#form-login');
let administrador;

// Event listeners
formLogin.submit(e => {
    e.preventDefault();
    let usuario = $('#mail-login').val();
    let contra = $(':password').val();
    console.log(usuario);
    console.log(contra);

    // Chequeo si es admin
    administrador = JSON.parse(localStorage.getItem('admin'));
    if(usuario == administrador.user && contra == administrador.password){
        window.location.assign('file:///home/alejo/Documentos/Coder_js/proyecto_final_js/proyecto/plataforma-admin.html');
    }
    else{ /* Chequeo si es usuario normal */
        alert('Aun no esta mplementado login de usuarios');
    }
    
});

// Programa
administrador = localStorage.getItem('admin');
if(!administrador){
    let nuevoAdmin = {user : 'admin@1', password : '4321'};
    localStorage.setItem('admin', JSON.stringify(nuevoAdmin));
}