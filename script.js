buscarItensDaLocalStorage()
adicionarComEnter()

let tarefaRecuperar = ''

const timeOut = () => { 
    tarefaRecuperar = document.querySelector('#novaTarefa').value
    if(tarefaRecuperar != ''){
        document.querySelector('#novaTarefa').value = 'processando...'
        document.querySelector('#novaTarefa').disabled = true
        setTimeout(recuperarValor, 19)
        setTimeout(adicionarTarefaNova, 20)
    }
}

function recuperarValor() {
    document.querySelector('#novaTarefa').value = tarefaRecuperar
    document.querySelector('#novaTarefa').disabled = false
}

function contador() {
    let listaDetarefas = document.querySelectorAll('#listaDeTarefas li')
    
    if(listaDetarefas.length > 0){
        let total = listaDetarefas.length
        let concluidas = 0
        let pendentes = 0
    
        for (k = 0; k<listaDetarefas.length; k++){
            if(listaDetarefas[k].classList.contains('striked-text')){
                concluidas++
            }
        }
    
        pendentes = total - concluidas
        
        document.querySelector('.contador').innerText = `Concluídas: ${concluidas} | Pendentes:${pendentes} | Total: ${total}`
    }
}

const botaoAdd = document.querySelector('.botaoTarefa')
botaoAdd.addEventListener('click', timeOut)

function adicionarComEnter() {
    let input = document.querySelector('.inputTarefa')
    input.addEventListener('keyup', function(event) {
        if (event.keyCode === 13) { document.querySelector('.botaoTarefa').click(); }
    })
}

function listenerBotaoExcluir() {
    const botaoExcluir = document.querySelectorAll('.botaoExcluir')
    botaoExcluir.forEach(element => {element.addEventListener('click', excluirTarefa) })

    const botaoEditar = document.querySelectorAll('.botaoEditar')
    botaoEditar.forEach(element => {element.addEventListener('click', editarTarefa) })
}

function editarTarefa(event){
    document.querySelector('#novaTarefa').value = event.target.parentNode.parentNode.parentNode.firstChild.innerText
    excluirTarefa(event)
    document.querySelector('#novaTarefa').focus()
}

function excluirTarefa(event) {
    event.target.parentNode.parentNode.parentNode.remove()
    armazenarListaNoLocalStorage()
}

let indexDoLi = 0;
function adicionarTarefaNova() {
    let tarefaInput = document.querySelector('#novaTarefa').value

    if(tarefaInput != ''){

        criarItemNaLista(tarefaInput, indexDoLi)
        indexDoLi++;
        
        document.querySelector('#novaTarefa').value = ''

        document.querySelector('#listaDeTarefas').addEventListener('click', toggleStatus)
        listenerBotaoExcluir();
        armazenarListaNoLocalStorage()
        contador()

        document.querySelector('#novaTarefa').focus()
    }
}

function toggleStatus(event) {
    if(event.target.tagName != 'UI'){
        if ( event.target.tagName == 'LI') {
            event.target.classList.toggle('striked-text')
            let dadosLocais = JSON.parse(localStorage.getItem('dados'))
            let indexSearch = dadosLocais.index.indexOf(event.target.id)
            dadosLocais.tarefaConcluida[indexSearch] = !dadosLocais.tarefaConcluida[indexSearch]
            localStorage.setItem('dados', JSON.stringify(dadosLocais))
        } else if (event.target.tagName == 'DIV') { 
            event.target.parentNode.classList.toggle('striked-text') 
            let dadosLocais = JSON.parse(localStorage.getItem('dados'))
            let indexSearch = dadosLocais.index.indexOf(event.target.parentNode.id)
            dadosLocais.tarefaConcluida[indexSearch] = !dadosLocais.tarefaConcluida[indexSearch]
            localStorage.setItem('dados', JSON.stringify(dadosLocais))
        }
    }    
    contador()
}

function armazenarListaNoLocalStorage() {
    let itens = document.querySelectorAll('#listaDeTarefas li')

    let dadosLocais = {
        tarefaConcluida: []
    }

    dadosLocais.texto = Array.prototype.map.call(itens, function(item) { return item.textContent })
    dadosLocais.index = Array.prototype.map.call(itens, function(item) { return item.getAttribute('id') })
    dadosLocais.tarefaConcluida = Array.prototype.map.call(itens, function(item) {
        if(item.classList.contains('striked-text')){ return true } else { return false }
    })

    localStorage.setItem('dados', JSON.stringify(dadosLocais))
}

function criarItemNaLista(text, index) {
    let ul = document.querySelector('#listaDeTarefas')
    
    let li = document.createElement('li')
    li.classList.add('itemLista')
    li.setAttribute('id', `item${index}`)

    let div1 = document.createElement('div')
    div1.classList.add('divTexto')

    let div2 = document.createElement('div')
    
    let imgExcluir = document.createElement('img')
    imgExcluir.classList.add('iconeDeletar')
    imgExcluir.setAttribute('src', 'imgs/iconeLixeira.png')
    
    let botaoExcluir = document.createElement('button')
    botaoExcluir.classList.add('botaoExcluir')
    botaoExcluir.appendChild(imgExcluir)
    

    let imgEditar = document.createElement('img')
    imgEditar.classList.add('iconeEditar')
    imgEditar.setAttribute('src', 'imgs/iconeEditar.png')

    let botaoEditar = document.createElement('button')
    botaoEditar.classList.add('botaoEditar')
    botaoEditar.appendChild(imgEditar)

    li.appendChild(div1)
    li.appendChild(div2)

    div2.appendChild(botaoExcluir)
    div2.appendChild(botaoEditar)
    div2.classList.add('divBotoes')

    div1.innerText = text;

    ul.appendChild(li)
    ul.addEventListener('click', toggleStatus)

    contador()
}

function buscarItensDaLocalStorage() {
    let dadosLocais = JSON.parse(localStorage.getItem('dados'))

    if(dadosLocais){
        for (i = 0; i < dadosLocais.texto.length; i++){
            criarItemNaLista(dadosLocais.texto[i])
            document.querySelector('#listaDeTarefas').lastChild.setAttribute('id', dadosLocais.index[i])
            if(dadosLocais.tarefaConcluida[i]) { document.querySelector('#listaDeTarefas').lastChild.classList.add('striked-text') }
        }
    }
    listenerBotaoExcluir()
}