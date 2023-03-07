jQuery(document).ready(function($) {

	'use strict';

    var top_header = $('.parallax-content');
    top_header.css({'background-position':'center center'}); // better use CSS

    $(window).scroll(function () {
    var st = $(this).scrollTop();
    top_header.css({'background-position':'center calc(50% + '+(st*.5)+'px)'});
    });


    $('body').scrollspy({ 
        target: '.fixed-side-navbar',
        offset: 200
    });
      
      // smoothscroll on sidenav click

    $('.tabgroup > div').hide();
        $('.tabgroup > div:first-of-type').show();
        $('.tabs a').click(function(e){
          e.preventDefault();
            var $this = $(this),
            tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
            others = $this.closest('li').siblings().children('a'),
            target = $this.attr('href');
        others.removeClass('active');
        $this.addClass('active');
        $(tabgroup).children('div').hide();
        $(target).show();
      
    })

    var owl = $("#owl-testimonials");

      owl.owlCarousel({
        
        pagination : true,
        paginationNumbers: false,
        autoPlay: 6000, //Set AutoPlay to 3 seconds
        items : 3, //10 items above 1000px browser width
        itemsDesktop : [1000,3], //5 items between 1000px and 901px
        itemsDesktopSmall : [900,2], // betweem 900px and 601px
        itemsTablet: [600,1], //2 items between 600 and 0
        itemsMobile : false // itemsMobile disabled - inherit from itemsTablet option
        
    });


});

//--------- js for fetching data ------------------

// API URLs
const weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=France,FR&appid=9fd7a449d055dba26a982a3220f32aa2';
const mealApiUrl = 'https://www.themealdb.com/api/json/v1/1/filter.php?a=French';

// DOM Elements
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');
const weatherIconElement = document.getElementById('weather-icon');

const attractionCardsElement = document.getElementById('attraction-cards');

const mealCardsElement = document.getElementById('meal-cards');
const mealImages = document.querySelectorAll('.tabs-content #first-tab-group img');
const mealNames = document.querySelectorAll('.tabs-content #first-tab-group p');
const mealIngredientsLists = document.querySelectorAll('.tabs-content #first-tab-group ul');

// Fetch Weather Data
fetch(weatherApiUrl)
  .then(response => response.json())
  .then(data => {
    const temperature = convertKelvinToCelsius(data.main.temp);
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const iconUrl = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);

    temperatureElement.innerHTML = `${temperature} &deg;C`;
    weatherDescriptionElement.innerHTML = description;
    weatherIconElement.src = iconUrl;
    document.getElementById("humidity").innerHTML = `${humidity}%`;
    document.getElementById("windSpeed").innerHTML = `${windSpeed}m/s`;
    document.getElementById("sunrise").innerHTML = formatTime(sunrise);
    document.getElementById("sunset").innerHTML = formatTime(sunset);
  });

// Temperature Conversion Function
function convertKelvinToCelsius(kelvin) {
  const celsius = kelvin - 273.15;
  return celsius.toFixed(1);
}

// Time Formatting Function
function formatTime(time) {
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}



// fetch Meal data
fetch(mealApiUrl)
    .then(response => response.json())
    .then(data => {
        const mealDetailsPromises = data.meals.slice(0, 5).map(meal => {
            return fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                .then(response => response.json());
        });

        Promise.all(mealDetailsPromises)
            .then(mealDetails => {
                mealDetails.forEach((meal, index) => {
                    const name = meal.meals[0].strMeal;
                    const image = meal.meals[0].strMealThumb;
                    const ingredients = getIngredientsList(meal.meals[0]);

                    mealImages[index].src = image;
                    mealNames[index].textContent = name;
                    mealIngredientsLists[index].innerHTML = ingredients;
                });
            });
    });

function getIngredientsList(meal) {
  let ingredients = '';
  for (let i = 1; i <= 5  ; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li>${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}</li>`;
    } else {
      break;
    }
  }
  return ingredients;
}
    
function createMealCard(name, image, ingredients) {
  const card = document.createElement('div');
  card.classList.add('meal-card');

  const imageElement = document.createElement('img');
  imageElement.classList.add('meal-image');
  imageElement.src = image;
  imageElement.alt = name;
  card.appendChild(imageElement);

  const contentElement = document.createElement('div');
  contentElement.classList.add('meal-content');
  card.appendChild(contentElement);

  const nameElement = document.createElement('h3');
  nameElement.classList.add('meal-name');
  nameElement.textContent = name;
  contentElement.appendChild(nameElement);

  const ingredientsElement = document.createElement('ul');
  ingredientsElement.classList.add('meal-ingredients');
  ingredientsElement.innerHTML = ingredients;
  contentElement.appendChild(ingredientsElement);

  return card;
}