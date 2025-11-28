function boton() {

    const correo = document.getElementById('gmail').value;
    
    const clave = document.getElementById('password').value;
    
    localStorage.setItem("correo", correo);
    localStorage.setItem("clave", clave);

    alert("Registrado correctamente!");
    
    window.location.href = "api.html";
}

function boton_2(){
    
    const correo = document.getElementById('gmail_2').value
    
    const clave = document.getElementById('password_2').value 
    
    const correo_2 = localStorage.getItem('correo');
    
    const clave_2 = localStorage.getItem('clave');
    
    
    
    if(correo === correo_2 && clave === clave_2){window.location.href ="api.html"}
    else { alert("Usuario incorrecto")}
}


const RAWG_API_KEY = 'e0c4007f312a4701b2f5a3cbd33de0e4'

async function buscarJuego() {
            const nombreJuego = document.getElementById('nombre-juego').value.trim();
            const resultadoDiv = document.getElementById('resultado');
            
            resultadoDiv.innerHTML = 'Cargando...';

            if (nombreJuego === '') {
                resultadoDiv.innerHTML = 'Ingresa un nombre.';
                return;
            }

            const query = encodeURIComponent(nombreJuego);
            const url = `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${query}&page_size=1`; 

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const juego = data.results[0];
                    const nombre = juego.name;
                    const imagenUrl = juego.background_image; 
                    
                    if (imagenUrl) {
                        resultadoDiv.innerHTML = `
                            <h2>${nombre}</h2>
                            <img src="${imagenUrl}" alt="${nombre}" style="max-width: 300px; height: auto;">
                        `;
                    } else {
                        resultadoDiv.innerHTML = `<p>No hay carátula para ${nombre}.</p>`;
                    }
                } else {
                    resultadoDiv.innerHTML = 'Juego no encontrado.';
                }

            } catch (error) {
                resultadoDiv.innerHTML = 'Error de conexión.';
            }
        }
    




