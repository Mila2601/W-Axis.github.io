// Выгрузка со склада (товары в наличии)
var cardsData = [
    {
      imgUrl: 'images/pineapple.png',
      text: 'Pineapple',
      price: 8.50,
      oldPrice: 19.00,
      isLimited: true
    },
    {
        imgUrl: 'images/berries.png',
        text: 'Berries',
        price: 8.50,
        oldPrice: 19.00,
        isLimited: true
    },
    {
        imgUrl: 'images/grapefruit.png',
        text: 'Grapefruit',
        price: 8.50,
        oldPrice: 19.00,
        isLimited: true
    },
    {
        imgUrl: 'images/apple.png',
        text: 'Apple',
        price: 8.50,
        oldPrice: 19.00,
        isLimited: true
    }
];
  
var list = document.querySelector('ul.goods');
var selectedItems = document.querySelector('ul.selectedItems');
var itemDescriptions = "offerta</br> fizzyslim con sapore di</br>";
  
  //создаем элемент, который будет помещен в карточку товара
var makeCardElement = function (nameTag, nameClass, text) {
    var element = document.createElement(nameTag);
    element.classList.add(nameClass);
    
    if (text) {
     var span = document.createElement('span');
     span.textContent = text; 
     element.appendChild(span);
    };
    return element
}
  
  /*создаем карточку товара с последовательностью элементов: 
    <li class="good"></li>
    <h2 class="description">product.text</h2>
    <img class="image" src=product.imgUrl alt=product.text>
    <p class="price">$ + product.price</p> 
    <div class="container">
      <span class="itemsCount">3</span> 
      <button class="cartButton"></button>
    <div>
    И определяем оформление в зависимости от того, есть ли 
    для него спец. предложение*/
var makeCard = function (product) {
    var card = makeCardElement('li', 'good');
    card.setAttribute('id', product.text);
    
    var title = makeCardElement('h2', 'description', product.text);
    card.appendChild(title);
    
    var picture = makeCardElement('img', 'image');
    picture.src = product.imgUrl;
    picture.alt = product.text;
    card.appendChild(picture);

    var board = makeCardElement('img', 'board');
    board.src = 'images/board.png';
    card.appendChild(board);
    
    var price = makeCardElement('p', 'price', ('\u0024' + (product.price).toFixed(2)));
    card.appendChild(price);
    
    if (product.isLimited) {
      card.classList.add('good-limited');
      price.firstChild.setAttribute('old-price', (product.oldPrice.toFixed(2) + '\u0024'));
    }

    var container = makeCardElement('div', 'container');
    var itemsCount = makeCardElement('span', 'itemsCount', '3');
    itemsCount.classList.add('dropdownOff');
    var dropdown = makeCardElement('ul', 'dropdown');
      for (var i = 1; i <= 50; i++) {
        var item = makeCardElement('li', 'listItem');
        item.setAttribute('id', i);
        item.textContent = i;
        dropdown.appendChild(item);
      }
    itemsCount.appendChild(dropdown);
    container.appendChild(itemsCount);
    var button = makeCardElement('button', 'cartButton');
    button.classList.add('popup-open');
    button.setAttribute('id', 'buttonFor'+product.text)
    container.appendChild(button);
    card.appendChild(container);
    return card
}
  
  /* Создаем ненумерованный список карточек, перебирая данные из массива объектов 
  и создавая карточку для каждого объекта */
var renderCards = function (cardsData) {
    
    for (var i = 0; i < cardsData.length; i++) {
      var goodCard = makeCard(cardsData[i]);
      list.appendChild(goodCard);
    }
    return goodCard
}  
renderCards(cardsData);

  //Включаем-выключаем видимость выпадающего списка
  var toggleDropdown = function () {
    this.classList.toggle('dropdownOff');
    }

  // Всплытие и закрывание корзины
var popup = document.querySelector('.popup');
var cardButtonHide = document.querySelector('.cartHeader');
var popupContent = document.querySelector('.popup-content');

popupContent.addEventListener('click', function () {event.stopPropagation()});

cardButtonHide.addEventListener('click', function () {
  popup.classList.remove('popup--open');
});

popup.addEventListener('click', function () {popup.classList.remove('popup--open')});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === 27) {
   popup.classList.remove('popup--open')
  }  
});


  // Функция удаления товара из корзины
  var delItem = function () {
    var li = this.parentNode;
    this.parentNode.parentNode.removeChild(li);
    countingPrice();
  }

  // Создаем карту товара и добавляем в корзину
var makeCardForCart = function (selectedImageUrl, descOfSelectedItem, countOfSelectedItems, priceOfSelectedItem) {
  var count = parseInt(countOfSelectedItems);
  var selectedItem = makeCardElement('li', 'selectedItem');
  var priceOfSelectedItem = parseFloat(priceOfSelectedItem.slice(1));

  var trash = makeCardElement('div', 'trash');
  trash.addEventListener('click', delItem);
  selectedItem.appendChild(trash);

  var imgItem = makeCardElement('img', 'selectedImage');
  imgItem.setAttribute('src', selectedImageUrl);
  selectedItem.appendChild(imgItem);

  var desc = makeCardElement('p', 'desc');
  desc.innerHTML = descOfSelectedItem;
  selectedItem.appendChild(desc);

  var countOfItems = makeCardElement('p', 'countOfItems');
  countOfItems.textContent = 'QTÀ: ' + count;
  selectedItem.appendChild(countOfItems);

  var price = makeCardElement('p', 'pr');
  price.textContent = '\u20ac' + (count * priceOfSelectedItem).toFixed(2);
  selectedItem.appendChild(price);

  var hr = makeCardElement('hr', 'hr');
  selectedItem.appendChild(hr);

  selectedItems.appendChild(selectedItem);
}

  // Функция рассчета стоимости товаров
var countingPrice = function () {
  var prices = document.getElementsByClassName('pr');
  var totalPrice = 0;
  for (var i = 0; i < prices.length; i++) {
    totalPrice += parseFloat(prices[i].textContent.slice(1));
  }
  var div = document.querySelector('.total');
  div.innerHTML = '\u20ac' + totalPrice.toFixed(2);
}

  //функция выезда корзины
var openCart = function () {
  popup.classList.add('popup--open');
  makeCardForCart(this.parentNode.parentNode.children[1].getAttribute('src'),
                  (itemDescriptions + this.parentNode.parentNode.getAttribute('id')),
                  this.parentNode.firstChild.firstChild.textContent,
                  this.parentNode.previousSibling.firstChild.textContent);
  countingPrice();
}

  // Функция вставки кол-ва товара в ul>li>span
var countItems = function () {
  var count = parseInt(this.textContent);
  this.parentNode.parentNode.firstChild.textContent = count;
}

    // Добавляем слушатель на каждую кнопку корзины и вып. списка
var itemsCounts = document.getElementsByClassName('itemsCount');
for (var i = 0; i < cardsData.length; i++) {
  var button = document.getElementById(('buttonFor'+cardsData[i].text));
  itemsCounts[i].addEventListener('click', toggleDropdown);
  button.addEventListener('click', openCart);
}

  // Добавляем слушатель на кнопки кол-ва товара
var items = document.querySelectorAll('.listItem');
for (var i = 0; i < items.length; i++) {
  items[i].addEventListener('click', countItems)
}
