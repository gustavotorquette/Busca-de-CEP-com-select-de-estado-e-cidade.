// Criando uma variável que recebe um evento
var event = new Event('change');

// Função para facilitar na hora de pegar um Elemento no DOM
function getElement(target){
  return document.querySelector(target);
}
// Colocando todos os elementos em variáveis
const cep = getElement("#cep"),
      logradouro = getElement('#logradouro'),
      bairro = getElement('#bairro'),
      localidade = getElement('#localidade'),
      uf = getElement('#uf');

// Desabilitando de início o Select Cidade 
localidade.disabled = true;

// Habilitando o campo cidade caso o usuário selecionar o Estado
uf.addEventListener('change', () => {
  localidade.disabled = false;
});

// Ainda não sei o que é isso
new dgCidadesEstados({
  estado: uf,
  cidade: localidade,
  estadoVal: '<%=Request("estado") %>',
  cidadeVal: '<%=Request("cidade") %>'
});

// Função que executa caso o Fetch der TRUE
const showData = (result) => {
  localidade.disabled = false;

  logradouro.value = result.logradouro;
  bairro.value = result.bairro;

  let estado = result.uf;
  let cidade = result.localidade;


  // Se vier o Estado no Fetch
  if(estado){
    estado = estado.toUpperCase();
    // percorre todos os estados
    for(i = 0; i < uf.length; i ++){
    
      let valor = uf.options[i];
      if(valor.value == estado){

        valor.setAttribute('selected', 'selected');
        // Força o evento de Change para buscar as cidades
        uf.dispatchEvent(event);

        for(c = 0; c < localidade.length; c ++){
          
          let valorCidade = localidade.options[c];

          if(valorCidade.value == cidade){
            valorCidade.setAttribute('selected', 'selected');
          }
          
        }
      }
    }

  }
}

// Popula as cidades de acordo com o Estado selecionado
var opts = uf.getElementsByTagName("option");
var i = 0, j = opts.length, e, remove = [];

for (i = 0; i < j; i++) {
  e = opts[i];
  if (e.value !== "") {
      remove.push(e);
  }
}

// Quando o usuário preenche o campo CEP
cep.addEventListener("blur", ()=>{

  if(cep.value){
    let search = cep.value.replace("-","");
    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    }


    fetch(`https://viacep.com.br/ws/${search}/json/`, options)
    .then( response =>{

      response.json()
        .then(data => showData(data))

    })
    .catch(e => alert('CEP inválido'));
  }

});