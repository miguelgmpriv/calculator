
document.getElementById('calculator').addEventListener('click', inputSort);

function inputSort(event){
    const sortData = event.target.dataset;
    return sortData.number ? firstNum(event)
        : sortData.operator ? console.log(sortData.operator)
        : sortData.modify ? console.log(sortData.modify)
        : sortData.clear ? clear(event)
        : console.log('error');
}

function firstNum(event){
    const currentTotal = document.getElementById('currentTotal');
    currentTotal.textContent += event.target.dataset.number;
}

function clear(event){
    const clearChoice = event.target.dataset.clear;
    const currentTotal = document.getElementById('currentTotal');
    return clearChoice === 'ac' ? currentTotal.textContent = ''
        : currentTotal.textContent = currentTotal.textContent.slice(0,-1);
}