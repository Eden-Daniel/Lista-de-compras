const form = document.getElementById('form')
const campoTexto = document.getElementById('campo-texto')
const listaDeCompras = document.getElementById('lista-itens')
const listaDosComprados = document.getElementById('itens-comprados')
const listaRecuperada = localStorage.getItem('listaDeItens')

let listaDeItens = []
let itemParaEditar

// Atualizando o LocalStorage
function atualizarLocalStorage(){
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if(listaRecuperada){
    listaDeItens = JSON.parse(listaRecuperada)
    mostrarItens()
} else {
    listaDeItens = []
}

// Adicionado os itens ao clicar.
form.addEventListener('submit', function (evento) {
    evento.preventDefault()
    salvarItem()
    mostrarItens()

    campoTexto.focus()
})


function salvarItem() {
    const itemParaComprar = campoTexto.value
    listaDeItens.push({
        valor: itemParaComprar,
        check: false
    })

    campoTexto.value = ''
}

function mostrarItens() {
    listaDeCompras.innerHTML = ''
    listaDosComprados.innerHTML = ''

    listaDeItens.forEach((elemento, index) => {
        if (elemento.check) {       
                listaDosComprados.innerHTML += `
                <li data-valor="${index}">        
                    <div class="itens-na-lista">            
                        <input class="clicavel" type="checkbox" checked/>
                        <span class="item-comprado">${elemento.valor}</span>
                    </div>   
                    <div class="itens-na-lista">
                        <i class="fa-solid fa-trash clicavel deletar"></i>
                    </div>    
                </li>
                `
            }
         else {
                listaDeCompras.innerHTML += `
                <li data-valor="${index}">        
                    <div class="itens-na-lista">            
                        <input class="clicavel" type="checkbox" class="is-clickable" />
                        <input class="item-lista" type="text" data-id="${index}" value="${elemento.valor}" ${index !== Number(itemParaEditar) ? 'disabled' : ' '}/>
                    </div>   
                    <div class="itens-na-lista">
                        ${index === Number(itemParaEditar) ? '<buttom onclick="salvaEdicao()"> <i class="fa-regular fa-floppy-disk clicavel"> </buttom' : '<i class="fa-regular fa-pen-to-square clicavel editar"></i>'}  
                        
                        <i class="fa-solid fa-trash clicavel deletar"></i>
                    </div>    
                </li>
                `
        } 
    })

    // Verificção do input checkbox
    const inputCheck = document.querySelectorAll('input[type="checkbox"]')
    inputCheck.forEach(input => {
        input.addEventListener('click', (evento) => {
            let valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-valor')
            listaDeItens[valorDoElemento].check = evento.target.checked
            mostrarItens() 
        })
    })
    
    // Deletar itens
    const deletarObjetos = document.querySelectorAll('.deletar')
    deletarObjetos.forEach(input => {
        input.addEventListener('click', (evento) => {            
            let valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-valor')
            listaDeItens.splice(valorDoElemento, 1)
            mostrarItens()
        })
    })

    
    // Editar item 
    const editarObjeto = document.querySelectorAll('.editar')
    editarObjeto.forEach(input => {
        input.addEventListener('click', (evento) => {
            itemParaEditar = evento.target.parentElement.parentElement.getAttribute('data-valor')
            mostrarItens()            
            document.querySelector(`[data-id="${itemParaEditar}"]`).focus()
        })
    })

    atualizarLocalStorage()
}

// Salvar item
function salvaEdicao() {
    const itemEditado = document.querySelector(`[data-valor='${itemParaEditar}'] input[type='text']`)
    listaDeItens[itemParaEditar].valor = itemEditado.value
    itemParaEditar = -1
    mostrarItens()
}
