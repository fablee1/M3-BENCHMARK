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

const renderAll = async () => {
  const categories = await getData()
  console.log(categories)

  let num = 0
  for(cat of categories) {
    const movies = await getData(cat)
    createCarousel(cat, movies, num)
    num++
  }
}

const createCarousel = (cat, movies, num) => {

  let count = 0
  const carouselCols = movies.reduce((acc, curr) => {
    if(count % 5 == 0) {
      acc.push([])
    }
    count++
    acc[acc.length - 1].push(
      `
      <div class="col-md-2">
        <img class="movies" src="${curr.imageUrl}" alt="media1" >
      </div>
      `
    )
    return acc
  }, [])

  let active = 'active'
  const carouselItems = carouselCols.map(cols => {
      const carouselItem = `
          <div class="carousel-item ${active}">
              <div class="row d-flex">
                  ${cols.join('')}
              </div>
          </div>
      `
      active = ''

      return carouselItem
  }).join('')

  const section = `
    <section id="section${num}" class="m-2">
      <div id="trendingnow" class="mt-5">
        <h3>${cat}</h3>
      </div>
      <div class="cointainer bg-black">
        <div class="row">
          <div id="carouselExampleControls${num}" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls${num}" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls${num}" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </section> 
  `
  document.getElementById('carousels').innerHTML += section
}

window.onload=function() {
    const showPlaceholder = function() {
      document.querySelector('#hideable').style.visibility = 'visible'
    }

    renderAll()
}