const adminCol = document.getElementById("adminPanel")


const adminButtons = () => adminCol.innerHTML = `
<div class="row h-100">
    <button class="w-50 h-100 btn text-white btn-success" onclick="addMovie()">Add</button>
    <button class="w-50 h-100 btn text-white btn-danger" onclick="chooseCat()">Edit/Delete</button>
</div>
`


// fetch section start

// movie example
// {
//     "name": "Strive School",
//     "description": "Horror movie about coding 10 hours per day",
//     "category": "horror",
//     "imageUrl": "https://bit.ly/3cMc2IH",
// }

const headers = {'Content-Type': 'application/json',
                   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGFlMzU3MWNlYWY0ODAwMTVjOTE4NjIiLCJpYXQiOjE2MjIwMjk2ODEsImV4cCI6MTYyMzIzOTI4MX0.hWEhrY4Maa8j-xYWTEzS0vKjwvhbQ5eSApEaI2_tZKg'
                  }
const baseUrl = 'https://striveschool-api.herokuapp.com/api/movies/'

const checkResponse = async response => {
    if(response.ok) {
        return await response.json()
    } else {
        if (response.status === 400) {
            throw new Error("Bad request with status 400");
        } else if (response.status === 401) {
            throw new Error("Anauthorized with status 401");
        } else if (response.status === 404) {
            throw new Error("Not found with status 404");
        }
    }
}

const getData = async (category='') => {
    try {
        const response = await fetch(baseUrl+category, {
            method: 'GET',
            headers: headers
        })
        return await checkResponse(response)
    } catch(err) {
        alert(err.message)
    }
}

const postData = async (movie) => {
    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            body: JSON.stringify(movie),
            headers: headers
        })
        await checkResponse(response)
        return response
    } catch(err) {
        alert(err.message)
    }
}

const putData = async (movieId, movie) => {
    try {
        const response = await fetch(baseUrl+movieId, {
            method: 'PUT',
            body: JSON.stringify(movie),
            headers: headers
        })
        await checkResponse(response)
        return response
    } catch(err) {
        alert(err.message)
    }
}

const deleteData = async (movieId) => {
    try {
        const response = await fetch(baseUrl+movieId, {
            method: 'DELETE',
            headers: headers
        })
        await checkResponse(response)
        return response
    } catch(err) {
        alert(err.message)
    }
}

const checkImage = async (url) => {
    try {
        return fetch(url, { method: 'HEAD' })
        .then(res => {
            if (res.ok) {
                return true;
            } else {
                throw 'some error text';
            }
        }).catch(err => false)
    } catch (err) {
        return false
    }
}

// fetch section ends


const showFormImage = async () => {
    const formImage = document.getElementById('formImage')
    const imageInput = document.getElementById('image')
    if(imageInput.value == '' || (imageInput.value != formImage.src && formImage.src != 'https://via.placeholder.com/150')) {
        formImage.src = 'https://via.placeholder.com/150'
    } else {
        const imageExists = await checkImage(imageInput.value)
        if(imageExists) {
            formImage.src = imageInput.value
        }
    }
}

const formInputs = () => {
    const movieName = document.getElementById('name')
    const movieCategory = document.getElementById('category')
    const movieDesc = document.getElementById('description')
    const movieImageUrl = document.getElementById('image')
    return [movieName, movieDesc, movieCategory, movieImageUrl]
}

const movieObject = (movieData) => {
    const movie = Object.fromEntries(
        ["name", "description", "category", "imageUrl"].map((name, i) =>
            [name, movieData[i]]
        )
    );
    console.log(movie)
    return movie
}

const postMovie = async () => {
    const formValues = formInputs().map(input => input.value)

    const response = await postData(movieObject(formValues))
    waitScreen(response)
}

const putMovie = async (id) => {
    const formValues = formInputs().map(input => input.value)

    const response = await putData(id, movieObject(formValues))
    waitScreen(response)
}

const addMovie = () => {
    
    const form = `
        <form class="w-100 p-3 addForm">
            <h1 class="text-center formh1">Add New Movie</h1>
            <div class="mb-3 mt-3 row d-flex">
                <div class="col-6">
                    <label for="name" class="form-label">Movie name</label>
                    <input type="text" class="form-control" id="name" placeholder="Avengers" required>
                </div>
                <div class="col-6">
                <label for="category" class="form-label">Movie category</label>
                <input class="form-control" id="category" placeholder="Example" required></input>
                </div>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Movie description</label>
                <textarea class="form-control" id="description" rows="3" required></textarea>
            </div>
            <div class="mb-3 row d-flex">
                <div class="col-6 align-self-end">
                    <label for="image" class="form-label">Image URL</label>
                    <input class="form-control" id="image" placeholder="Image url" oninput="showFormImage()" required></input>
                </div>
                <div class="col-6">
                   <img src="https://via.placeholder.com/150" class="w-100" id="formImage">
                </div>
            </div>
            <button type="submit" class="btn btn-success mb-2 border-white">Add Movie
                <div class="spinner-border spinner-border-sm d-none" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </button>
        </form>
    `
    adminCol.innerHTML = form

    document.getElementsByClassName('addForm')[0].addEventListener('submit', function(e){
        e.preventDefault()
        document.getElementsByClassName('spinner-border')[0].classList.remove('d-none')
        postMovie()
    })
}

const deleteMovie = async (id) => {
    const response = await deleteData(id)

    waitScreen(response)
}

const editMovie = async (category, id) => {

    const movies = await getData(category)
    const movie = movies.find(m => m._id = id)

    const form = `
        <form class="w-100">
            <div class="mb-3 mt-3 row d-flex">
                <div class="col-6">
                    <label for="name" class="form-label">Movie name</label>
                    <input type="text" class="form-control" id="name" placeholder="Avengers" value="${movie.name}" required>
                </div>
                <div class="col-6">
                <label for="category" class="form-label">Movie category</label>
                <input class="form-control" id="category" placeholder="Example" value="${movie.category}" required></input>
                </div>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Movie description</label>
                <textarea class="form-control" id="description" rows="3" required>${movie.description}</textarea>
            </div>
            <div class="mb-3 row d-flex">
                <div class="col-6 align-self-end">
                    <label for="image" class="form-label">Image URL</label>
                    <input class="form-control" id="image" placeholder="Image url" value="${movie.imageUrl}" oninput="showFormImage()" required></input>
                </div>
                <div class="col-6">
                <img src="${movie.imageUrl}" class="w-100" id="formImage">
                </div>
            </div>
            <button type="button" class="btn btn-success mb-2 border-white" id="putMovie">Save Changes
                <div class="spinner-border spinner-border-sm d-none" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </button>
        </form>
    `
    adminCol.innerHTML = form

    document.getElementById('putMovie').addEventListener('click', () => {
        document.getElementsByClassName('spinner-border')[0].classList.remove('d-none')
        putMovie(movie._id)
    })
}

const chooseCat = async () => {

    const categories = await getData()
    const buttons = categories.map(cat => `<button onclick="renderCards('${cat}')" class="btn category-btn">${cat}</button>`).join('')

    const categoryButtons = `
        <h1 class="text-center">Edit/Delete Movies</h1>
        <div class="row categoryRow w-100 mb-5">
            ${buttons}
        </div>
    `
    adminCol.innerHTML = categoryButtons
}

const renderCards = async (category) => {
    const movies = await getData(category)

    let count = 0
    const cards = movies.reduce((acc, curr) => {
        if(count == 0) {
            count++
            acc.push([])
            acc[acc.length - 1].push(
                `
                <div class="card me-4">
                    <img src=${curr.imageUrl} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${curr.name}</h5>
                        <p class="card-category mt-4">${curr.category}</p>
                        <p class="card-text">${curr.description}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn edit" onclick="editMovie('${curr.category}', '${curr._id}')">Edit</button>
                            <button class="btn delete" onclick="deleteMovie('${curr._id}')">Delete</button>
                        </div>
                    </div>
                </div>
                `
            )
            return acc
        } else {
            count = 0
            acc[acc.length - 1].push(
                `
                <div class="card">
                    <img src=${curr.imageUrl} class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${curr.name}</h5>
                        <p class="card-category mt-4">${curr.category}</p>
                        <p class="card-text">${curr.description}</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn edit" onclick="editMovie('${curr.category}', '${curr._id}')">Edit</button>
                            <button class="btn delete" onclick="deleteMovie('${curr._id}')">Delete</button>
                        </div>
                    </div>
                </div>
                `
            )
            return acc
        }
    }, [])

    let active = 'active'
    const carouselItems = cards.map(cards => {
        const carouselItem = `
            <div class="carousel-item ${active}">
                <div class="row justify-content-center">
                    ${cards.join('')}
                </div>
            </div>
        `
        active = ''

        return carouselItem
    }).join('')


    const carousel = `
    <div class="row">
        <div id="carouselExampleControls" class="carousel slide w-100" data-bs-ride="carousel">
            <div class="carousel-inner">
                ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
        </div>
    </div>
    `
    adminCol.innerHTML += carousel
}


const waitScreen = (response) => {
    let color = 'bg-success'
    let message = 'Action successful!'

    let button = `
        <button class="btn btn-success">Back to panel</button>
    `
    if(!response.ok) {
        color = 'bg-danger'
        message = 'Something went wrong!'
        button = `
            <button class="btn btn-danger">Back to panel</button>
        `
    }
    const screen = `
        <div class="w-100 waitScreen ${color} d-flex flex-column justify-content-center align-items-center">
            <h1 class="mb-5">${message}</h1>
            ${button}
        </div>
    `
    adminCol.innerHTML = screen
    document.querySelector('.waitScreen button').addEventListener('click', () => adminButtons())
}

window.onload = () => {
    adminButtons()
}