var tab1Array;

function createArrayCopy(array) {
  var copyArray = new Array(array.length);
  for (var i = 0; i < array.length; i += 1) {
    copyArray[i] = array[i].slice();
  }
  return copyArray
}

function getAllRowInputsByRowNum(num) {
  return $("[id*='floatInput" + num + "']")
}

function getInputByRowAndColumn(rowNum, colNum) {
  return $("[id='floatInput" + rowNum + "_" + colNum + "']")
}
function getTotalByRowNum(rowNum) {
  return $("[id='totalRoad" + rowNum + " ']")
}

function tableRowsProcessing() {
  tab1Array = fillArray(cleanArray());
  $.each([1, 2, 3, 4, 5], function (rowIndex, num) {
    getAllRowInputsByRowNum(num).each(function (column, el) {
      inputsActions(el, tab1Array, rowIndex, column)
    });
  });
}

function inputsActions(el, array, rowIndex, column) {
  $(el).click(function () { tableOnElementClick(this) });
  $(el).change(function () { tableOnElementChange(this) });
  $(el).keyup(function () { tableOnElementKeyUp(this, array, rowIndex, column) });
}

function tableOnElementKeyUp(element, array, rowIndex, column) {
    array = updateArrayCell(element, array, rowIndex, column);
    updateConnectedCells(array, rowIndex, column);
}

function fillArray(array) {
  var arrayCopy = createArrayCopy(array);
  $.each([1, 2, 3, 4, 5], function (rowIndex, num) {
    getAllRowInputsByRowNum(num).each(function (column, el) {
      arrayCopy[rowIndex][column] = parseFloat($(el).val());
    });
  });
  return arrayCopy;
}

// Очищение массива значений
function cleanArray() { // 
  var array = new Array(5);
  array[0] = new Array(10);
  array[1] = new Array(10);
  array[2] = new Array(10);
  array[3] = new Array(10);
  array[4] = new Array(10);
  return array;
}

// Метод для очищения нулевого значения в input
function tableOnElementClick(element) {
  var currentElement = $(element);
  currentElement.val() == 0 ? currentElement.val("") : '';
}

// Дописывает 0 для ситуации ввода числа ".5"
function tableOnElementChange(element) {
  var currentElement = $(element);
  var currentElementValue = currentElement.val();
  if (currentElementValue.indexOf('.') == 0 || currentElementValue.length == 0) {
    currentElement.val("0" + currentElementValue);
  }
}

// Обновляет элементы таблицы
function updateArrayCell(element, array, rowIndex, column) {
  var arrayCopy = createArrayCopy(array);
  arrayCopy[rowIndex][column] = parseFloat($(element).val());
  return arrayCopy;
}


function updateConnectedCells(array, rowIndex, column) {
  var arrayCopy = createArrayCopy(array);
  if (rowIndex == 0 || rowIndex == 2 || rowIndex == 4) {
    var columnNum = (column + 1);
    var calculationResult = getNewCalculatedValues(arrayCopy[0][column], arrayCopy[2][column], arrayCopy[4][column]);
    var resultRow2 = calculationResult[0];
    var resultRow4 = calculationResult[1];
    getInputByRowAndColumn(2, columnNum).val(resultRow2);
    getInputByRowAndColumn(4, columnNum).val(resultRow4);

    arrayCopy[1][column] = resultRow2;
    arrayCopy[3][column] = resultRow4;
  }
  return arrayCopy
}

function getNewCalculatedValues(valueRow1, valueRow3, valueRow5) {
  var notNanValue1 = isNaN(valueRow1) ? 0 : valueRow1;
  var notNanValue3 = isNaN(valueRow3) ? 0 : valueRow3;
  var notNanValue5 = isNaN(valueRow5) ? 0 : valueRow5;
  var result2 = notNanValue1 / notNanValue3;
  var result4 = result2 - (notNanValue1 / notNanValue5);

  return [getNonFinite(result2), getNonFinite(result4)]
}

// Возвращает конечное число
function getNonFinite(result) {
  return isFinite(result) ? Math.round(result) : 0;
}

// Суммирование элементов строки
function getSumRow(array, rowNum) {
  var sum = 0;
  for (element in array[rowNum - 1]) {
    sum += isNaN(array[rowNum - 1][element]) ? 0 : array[rowNum - 1][element];
  }
  return sum
}

