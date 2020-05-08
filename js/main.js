'use strict';


const 
    cartButton = document.querySelector("#cart-button"), 
    modal = document.querySelector(".modal"),
    close = document.querySelector(".close"),
    buttonAuth = document.querySelector('.button-auth'),
    modalAuth = document.querySelector('.modal-auth'),
    closeAuth = document.querySelector('.close-auth'),
    logInForm = document.querySelector('#logInForm'),
    loginInput = document.querySelector('#login'),
    buttonOut = document.querySelector('.button-out'),
    userName = document.querySelector('.user-name'),
    cardsRestaurants = document.querySelector('.cards-restaurants'),
    containerPromo = document.querySelector('.container-promo'),
    restaurants = document.querySelector('.restaurants'),
    menu = document.querySelector('.menu'),
    logo = document.querySelector('.logo'),
    cardsMenu = document.querySelector('.cards-menu'),
    sectionHeading = document.querySelector('.section-heading-hide');

    let login = localStorage.getItem('mainKey');

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);


const getData = async function (url){

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error (`Ошибка по адресу ${url}, статус ошибка ${response.status} `);
    }

    return await response.json();
};



function toggleModal() {
    modal.classList.toggle("is-open");
}
function toggleModalAuth() {
    modalAuth.classList.toggle('is-open');
    loginInput.style.border = '';
    loginInput.style.borderRadius = '';
    loginInput.style.width = '';
    loginInput.style.height = '';
    loginInput.style.padding = '';
}

function authorised() {
    console.log('Авторизирован');

    userName.textContent = login;

    function logOut() {
        login = '';
        chekAuth();

        localStorage.removeItem('mainKey');

        buttonAuth.style.display = '';
        buttonOut.style.display = '';
        userName.style.display = '';
    }

    buttonAuth.style.display = 'none';
    buttonOut.style.display = 'inline';
    userName.style.display = 'block';

    buttonOut.addEventListener('click', logOut);


}

function notAuthorised() {
    console.log('Не авторизован');

    function logIn(event) {

        login = loginInput.value;
        event.preventDefault();



        if (login) {

            localStorage.setItem('mainKey', login)

            buttonAuth.removeEventListener('click', toggleModalAuth);
            closeAuth.removeEventListener('click', toggleModalAuth);
            logInForm.removeEventListener('submit', logIn)

            logInForm.reset();
            toggleModalAuth();
            chekAuth();

        } else {
            loginInput.style.border = '1px solid red';
            loginInput.style.borderRadius = '2px';
            loginInput.style.width = '213px';
            loginInput.style.height = '34px';
            loginInput.style.padding = '7px';
            alert('Введите логин и пароль!');
        };
    }

    buttonAuth.addEventListener('click', toggleModalAuth);
    closeAuth.addEventListener('click', toggleModalAuth);
    logInForm.addEventListener('submit', logIn);

}

function chekAuth() {
    if (login) {
        authorised();

    } else {
        notAuthorised();
    }
}


function createCardRestaurant (restaurant) {

    const { image, kitchen, name, price, products, stars, time_of_delivery:timeOfDelivery } = restaurant;

    const card = `
                    <a  class="card card-restaurant" data-kitchen="${kitchen}" data-price="${price}" data-stars="${stars}" data-name="${name}" data-products="${products}">
                        <img src="${image}" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title">${name}</h3>
                                <span class="card-tag tag">${timeOfDelivery} мин</span>
                            </div>
                            <div class="card-info">
                                <div class="rating">
                                ${stars}
                                </div>
                                <div class="price">От ${price} ₽</div>
                                <div class="category">${kitchen}</div>
                            </div>
                        </div>
                    </a>
                `;

                cardsRestaurants.insertAdjacentHTML('beforeend', card);

}


function createCardGood ({ description, id, image, name, price }) {

    

  


    const card = document.createElement('div');

    card.className = 'card';

    card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image" />
    <div class="card-text">
        <div class="card-heading">
            <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
            <div class="ingredients">${description}
            </div>
        </div>
        <!-- /.card-info -->
        <div class="card-buttons">
            <button class="button button-primary button-add-cart">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
            </button>
            <strong class="card-price-bold">${price} ₽</strong>
        </div>
    </div>
    `);

    cardsMenu.insertAdjacentElement('beforeend', card);
    
}

function openGoods(event){
    const target = event.target;

    const restaurant = target.closest('.card-restaurant');

    if (login) {
        if (restaurant) {
            cardsMenu.textContent = '';
            sectionHeading.textContent = '';

            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
    
            getData(`./db/${restaurant.dataset.products}`).then(function (data){
            data.forEach(createCardGood);
            });
 
            
            getData(`./db/${restaurant.dataset.products}`).then(function (data){
 


                        const section = document.createElement('div');
                        section.className = 'section-heading';
    
                        section.insertAdjacentHTML('beforeend', `
                            <h2 class="section-title restaurant-title">${restaurant.dataset.name}</h2>
                                <div class="card-info">
                                    <div class="rating">
                                    ${restaurant.dataset.stars}
                                    </div>
                                    <div class="price">От ${restaurant.dataset.price} ₽</div>
                                    <div class="category">${restaurant.dataset.kitchen}</div>
                                </div>
                        `);
    
                            sectionHeading.insertAdjacentElement('beforeend', section);
                   
                });
        
        }

    } else {
        toggleModalAuth();
    }
    
   
  
}

function init() {

    getData('./db/partners.json').then(function (data){
        data.forEach(createCardRestaurant);
     });
     
     
     
     chekAuth();
     
     
     
     
     cardsRestaurants.addEventListener('click', openGoods);
     logo.addEventListener('click', function () {
         containerPromo.classList.remove('hide');
         restaurants.classList.remove('hide');
         menu.classList.add('hide');
     });

}

init();






