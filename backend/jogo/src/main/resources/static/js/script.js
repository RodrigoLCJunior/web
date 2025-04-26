document.addEventListener("DOMContentLoaded", function() {
    carregarPerfil();
});

function carregarPerfil() {
    
    fetch('/api/usuario/perfil') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do perfil');
            }
            return response.json();
        })
        .then(data => {
           
            document.getElementById('nomeUsuario').textContent = data.nome;
            document.getElementById('emailUsuario').textContent = data.email;
            document.getElementById('moedasPermanentes').textContent = data.moedasPermanentes;
            document.getElementById('moedasTemporarias').textContent = data.moedasTemporarias;
            document.getElementById('totalCliques').textContent = data.totalCliques;
            document.getElementById('inimigosDerrotados').textContent = data.inimigosDerrotados;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Não foi possível carregar o perfil.');
        });
}
