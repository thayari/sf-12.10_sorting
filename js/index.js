// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления
const minWeightInput = document.querySelector('.minweight__input'); // минимальный вес
const maxWeightInput = document.querySelector('.maxweight__input'); // максимальный вес

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

const colorMap = new Map([
  ['фиолетовый', 'violet'],
  ['зеленый', 'green'],
  ['розово-красный', 'carmazin'],
  ['желтый', 'yellow'],
  ['светло-коричневый', 'lightbrown']
]);

// отрисовка карточек
const display = () => {
  // очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';

  fruits.forEach((element, i) => {
    let color = '';
    for (let [key, value] of colorMap) {
      if (element.color == key) {
        color = value;
      }
    }
    let item = document.createElement('li');
    item.className = `fruit__item fruit_${color}`;
    item.innerHTML = `<div class="fruit__info">
      <div>index: ${i}</div>
      <div>kind: ${element.kind}</div>
      <div>color: ${element.color}</div>
      <div>weight (кг): ${element.weight}</div>
      </div>`;
    fruitsList.insertAdjacentElement('beforeend', item);
  });
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  while (fruits.length > 0) {
    result.push(fruits.splice(getRandomInt(0, fruits.length - 1), 1));
  }
  
  fruits = result.flat();
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  let minWeight = minWeightInput.value;
  let maxWeight = maxWeightInput.value;

  if (minWeight == '' || isNaN(parseInt(minWeight))) {
    // если минимальное значение некорректно, подставить ноль
    minWeightInput.value = minWeight = 0;
  };
  if (maxWeight == '' || isNaN(parseInt(maxWeight))) {
    // если максимальное значение некорректно, подставить максимальный вес из имеющихся
    maxWeightInput.value = maxWeight = fruits.reduce((prev, cur) => (prev.weight > cur.weight) ? prev : cur).weight;
  }

  const result = fruits.filter(item => item.weight >= minWeight && item.weight <= maxWeight);
  fruits = result;
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // функция сравнения двух элементов по цвету
  return a.color > b.color;
};

const sortAPI = {
  // функция сортировки пузырьком
  bubbleSort(arr, comparation) {

    const n = arr.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        }
      }
    }
  },

  // функция быстрой сортировки
  quickSort (arr, comparation) {
    if (arr.length < 2) {
      return arr;
    }

    const index = Math.floor(Math.random() * arr.length);
    const pivot = arr[index];
    
    const more = [];
    const less = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === index) {
        continue;
      }
      if (comparationColor(arr[i], pivot)) {
        more.push(arr[i]);
      } else {
        less.push(arr[i]);
      }
    }
    result = [...sortAPI.quickSort(less), pivot, ...sortAPI.quickSort(more)];
    fruits = result;
    return result;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

function isSorted(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].color < arr[i - 1].color)  {
      return false;
    }
  }
  return true;
}

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // переключает значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind == 'bubbleSort') {
    sortKind = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
  }
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  // если массив не отсортирован
  if (!isSorted(fruits)) {
    sortAPI.startSort(sort, fruits, comparationColor);
  }

  display();
  
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const checkField = (value) => {
    return (value != '') ? true : false;
  }; 

  // создание и добавление нового фрукта в массив fruits
  if (checkField(kindInput.value) && checkField(colorInput.value) && checkField(weightInput.value)) {
    const newFruit = {
      kind: kindInput.value,
      color: colorInput.value,
      weight: weightInput.value,
    };
    
    fruits.push(newFruit);
  } else {
    alert('Введите все значения');
  }

  display();
});
