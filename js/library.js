const bookContainer = document.querySelector('.book_container')
const form = document.querySelector('form')
const cancelBtn = document.querySelector('.cancel')
const addNewBook = document.querySelector('.add_book')
const author = document.querySelector('#author')
const title = document.querySelector('#title')
const page = document.querySelector('#page')
const isItImportant = document.querySelector('#importance')
const radioInputs = document.querySelectorAll('#is_it_read input')
//containing radio inputs value
let IsitRead = ''
//containing whole library
let myLibrary = []

//book info
let total = 0,
  important = 0,
  unimportant = 0,
  read = 0,
  unread = 0

//book info elements
const totalEl = document.querySelector('.total_el')
const impEl = document.querySelector('.imp_el')
const unImpEl = document.querySelector('.unimp_el')
const readEl = document.querySelector('.read_el')
const unReadEl = document.querySelector('.unread_el')

//Book constructor
function Book(author, title, page, importance, read) {
  this.author = author
  this.title = title
  this.page = page
  this.importance = importance
  this.read = read
}

Book.prototype.toggleImportance = function () {
  if (this.importance === 'important') {
    this.importance = 'unimportant'
  } else {
    this.importance = 'important'
  }
}

Book.prototype.toggleRead = function () {
  if (this.read === 'read') {
    this.read = 'unread'
  } else {
    this.read = 'read'
  }
}

//creating an individual book from myLibrary
function book(obj) {
  const BiggerDiv = document.createElement('div')
  BiggerDiv.setAttribute('data-book', myLibrary.indexOf(obj))
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const para = document.createElement('p')
      if (key === 'author' || key === 'title' || key === 'page') {
        para.textContent = `${key}: ${obj[key]}`
      } else {
        if (key === 'importance') {
          para.classList.add('toggle_imp')
        } else {
          para.classList.add('toggle_read')
        }
        para.textContent = obj[key]
      }
      BiggerDiv.appendChild(para)
    }
  }
  const deleteBtn = document.createElement('button')
  deleteBtn.classList.add('delete')
  deleteBtn.textContent = 'delete'
  BiggerDiv.appendChild(deleteBtn)
  deleteBtn.addEventListener('click', () => {
    const elemForDelete = deleteBtn.parentElement
    const objForDelete = elemForDelete.dataset.book
    delete myLibrary[objForDelete]
    bookContainer.removeChild(elemForDelete)

    //upadate book info after deleting
    total = myLibrary.filter((elem) => elem != undefined).length
    important = myLibrary.filter(
      (elem) => elem.importance === 'important'
    ).length
    unimportant = total - important
    read = myLibrary.filter((elem) => elem.read === 'read').length
    unread = total - read

    totalEl.textContent = `Total: ${total}`
    impEl.textContent = `Important: ${important}`
    unImpEl.textContent = `Unimportant: ${unimportant}`
    readEl.textContent = `Read: ${read}`
    unReadEl.textContent = `unread: ${unread}`
  })

  //update localstorage
  // myLibrary = myLibrary.filter((elem) => elem != undefined)
  deleteBtn.addEventListener('click', setLibrary)

  bookContainer.appendChild(BiggerDiv)
}

//handling form to add new books in myLibrary

function handleForm(e) {
  e.preventDefault()
  radioInputs.forEach((elem) => (elem.checked ? (IsitRead = elem.value) : ''))
  //creating a book
  const createBook = new Book(
    author.value,
    title.value,
    page.value,
    isItImportant.value,
    IsitRead
  )
  //adding the book to myLibrary
  myLibrary.push(createBook)
  //adding the book to html
  book(createBook)
  //after adding a book removing the form
  form.classList.replace('show', 'hide')
  //toogle importance and read
  const toggleImp = document.querySelectorAll('.toggle_imp')
  toggleImp.forEach((elem) => {
    elem.addEventListener('click', toggleImpFunc)
    //update localstorage
    elem.addEventListener('click', setLibrary)
  })
  const toggleRead = document.querySelectorAll('.toggle_read')
  toggleRead.forEach((elem) => {
    elem.addEventListener('click', toggleReadFunc)
    //update localstorage
    elem.addEventListener('click', setLibrary)
  })

  //collect this value to update book info
  total = myLibrary.filter((elem) => elem != undefined).length
  important = myLibrary.filter((elem) => elem.importance === 'important').length
  unImportant = total - important
  read = myLibrary.filter((elem) => elem.read === 'read').length
  unread = total - read

  //udate info in book elements
  totalEl.textContent = `Total: ${total}`
  impEl.textContent = `Important: ${important}`
  unImpEl.textContent = `Unimportant: ${unimportant}`
  readEl.textContent = `Read: ${read}`
  unReadEl.textContent = `Unread: ${unread}`
}

function toggleImpFunc(e) {
  const index = e.target.parentElement.attributes[0].value
  myLibrary[index].toggleImportance()
  e.target.textContent = myLibrary[index].importance
  important = myLibrary.filter((elem) => elem.importance === 'important').length
  unimportant = total - important
  impEl.textContent = `Important: ${important}`
  unImpEl.textContent = `Unimportant: ${unimportant}`
}

function toggleReadFunc(e) {
  const index = e.target.parentElement.attributes[0].value
  myLibrary[index].toggleRead()
  e.target.textContent = myLibrary[index].read
  read = myLibrary.filter((elem) => elem.read === 'read').length
  unread = total - read
  readEl.textContent = `Read: ${read}`
  unReadEl.textContent = `Unread: ${unread}`
}

//create a new book from given information
form.addEventListener('submit', handleForm)

//cancel adding new book
cancelBtn.addEventListener('click', (e) => {
  e.preventDefault()
  form.classList.replace('show', 'hide')
})

//show the form to give information about book
addNewBook.addEventListener('click', () => {
  form.classList.replace('hide', 'show')
})

//set localstorage

function setLibrary() {
  localStorage.setItem('library', JSON.stringify(myLibrary))
}

form.addEventListener('submit', setLibrary)

//get library from localstorage
function getLibrary() {
  const libFromStorage = localStorage.getItem('library')
  libFromStorage ? (myLibrary = JSON.parse(libFromStorage)) : ''
  myLibrary = myLibrary.map((elem) => {
    if (elem != null) {
      return new Book(
        elem.author,
        elem.title,
        elem.page,
        elem.importance,
        elem.read
      )
    }
  })
  myLibrary.forEach((elem) => {
    if (elem != null) {
      book(elem)
    }
  })
  console.log(myLibrary)
  const toggleImp = document.querySelectorAll('.toggle_imp')
  toggleImp.forEach((elem) => {
    elem.addEventListener('click', toggleImpFunc)
    //update localstorage
    elem.addEventListener('click', setLibrary)
  })
  const toggleRead = document.querySelectorAll('.toggle_read')
  toggleRead.forEach((elem) => {
    elem.addEventListener('click', toggleReadFunc)
    //update localstorage
    elem.addEventListener('click', setLibrary)
  })

  myLibrary = myLibrary.filter((elem) => elem != undefined)
  //collect this value to update book info
  total = myLibrary.filter((elem) => elem != undefined).length
  important = myLibrary.filter((elem) => elem.importance === 'important').length
  unImportant = total - important
  read = myLibrary.filter((elem) => elem.read === 'read').length
  unread = total - read

  //udate info in book elements
  totalEl.textContent = `Total: ${total}`
  impEl.textContent = `Important: ${important}`
  unImpEl.textContent = `Unimportant: ${unimportant}`
  readEl.textContent = `Read: ${read}`
  unReadEl.textContent = `Unread: ${unread}`
}

window.addEventListener('load', getLibrary)
