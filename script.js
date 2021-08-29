let numClear = false;
const lastTotal = document.getElementById('lastTotal');
const currentTotal = document.getElementById('currentTotal');

document.getElementById('calculator').addEventListener('click', inputSort);

function inputSort(event){
    const sortData = event.target.dataset;
    return sortData.number ? firstNum(event)
        : sortData.operator ? operator(event)
        : sortData.modify ? modify(event)
        : sortData.clear ? clear(event)
        : null;
}

function firstNum(event){
    if (numClear || currentTotal.textContent === '0'){
        numClear = false;
        currentTotal.textContent = '';
    } 
    return currentTotal.textContent += event.target.dataset.number;
}

function clear(event){
    if(typeof event === 'undefined'){
        currentTotal.textContent = '0';
        numClear = false;
        return;
    }
    if (event.target.dataset.clear === 'ac'){
        currentTotal.textContent = '0';
        lastTotal.textContent = '';
        numClear = false;
        return;
    } else if (currentTotal.textContent === '0'){
        return;
    }
    const newTotal = currentTotal.textContent.slice(0,-1);
    return (newTotal != '') ? currentTotal.textContent = newTotal 
        : currentTotal.textContent = '0';

}

function modify(event){
    const modify = event.target.dataset.modify;
    if (numClear) clear();
    switch (modify){
        case '.':
            if (currentTotal.textContent.indexOf('.') === -1){
                return currentTotal.textContent += event.target.dataset.modify;
            }
            break;
        case 'negative':
            if (currentTotal.textContent.indexOf('-') === -1){
                return currentTotal.textContent = `-${currentTotal.textContent}`;
            } else {
                return currentTotal.textContent = currentTotal.textContent.slice(1);
            }
    }
}

function operator(event){
    if (numClear === false && lastTotal.textContent != ''){ 
        const toProcess = {
            action: lastTotal.textContent.slice(-1),
            firstTotal: Number(lastTotal.textContent.slice(0, -2)),
            secondTotal: Number(currentTotal.textContent),
            secondAction: event.target.dataset.operator,
        }
        output(toProcess);
    }
    lastTotal.textContent = `${currentTotal.textContent} ${event.target.dataset.operator}`;
    lastTotal.style.visibility = 'visible';
    numClear = true;
}

function output(toProcess){
    switch (toProcess.action){
        case '+':
            currentTotal.textContent = toProcess.firstTotal + toProcess.secondTotal;
            break;
        case '-':
            currentTotal.textContent = toProcess.firstTotal - toProcess.secondTotal;
            break;
        case '*':
            currentTotal.textContent = toProcess.firstTotal * toProcess.secondTotal;
            break;
        case '/':
            currentTotal.textContent = toProcess.firstTotal / toProcess.secondTotal;
            break;
    }
}
