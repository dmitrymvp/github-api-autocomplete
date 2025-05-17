'use strict'

const searchInput = document.querySelector('.search')
const app = document.querySelector('.app')
const ul = document.querySelector('.list')
let list = null;

function debounce(fn) {
    let timeout;
    return function () {
        const fn2 = () => { fn.call(this, ...arguments) }

        clearTimeout(timeout)
        timeout = setTimeout(fn2, 400)
    }
};

async function searchRepo() {
    let response = await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`)
    let result = await response.json()
    const arr = result.items.slice(0, 5)

    ul.innerHTML = '';

    arr.forEach((element, index) => {
        ul.insertAdjacentHTML('beforeend', `<li data-index="${index}">${element.name}</li>`)

    });
    console.log(arr)
    list = document.querySelectorAll('li')
    addRepo(list, arr)
}

const debSearch = debounce(searchRepo)

searchInput.addEventListener('input', (e) => {
    const value = searchInput.value.trim()
    if (value === '') {
        ul.innerHTML = ''
        return
    } else {
        debSearch()
    }
})

function addRepo(nodeList, array) {
    nodeList.forEach((elem) => {
        elem.addEventListener('click', () => {
            ul.innerHTML = ''
            searchInput.value = ''

            const card = document.createElement('div')
            card.classList.add('card')
            app.append(card)

            const description = document.createElement('div')
            description.classList.add('description')
            card.append(description)

            const index = elem.dataset.index;

            description.insertAdjacentHTML('beforeend',
                `<ul class="description__list">
                    <li>Name: ${array[index].name}</li>
                    <li>Owner: ${array[index].owner.login}</li>
                    <li>Stars: ${array[index].stargazers_count}</li>
                </ul>`
            )

            const closeBtn = document.createElement('button')
            closeBtn.classList.add('closeBtn')
            card.append(closeBtn)

            const img = document.createElement('img')
            img.src = 'img/close.svg'
            img.alt = 'Кнопка закрытия'
            closeBtn.append(img)

            closeBtn.addEventListener('click', () => {
                card.remove()
            })
        })
    })
}



