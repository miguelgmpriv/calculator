
let numClear = false; //Boolean for deciding if to wipe out current screen output
const lastTotal = document.getElementById('lastTotal');
const currentTotal = document.getElementById('currentTotal');


document.getElementById('calculator').addEventListener('click', inputSort);
document.addEventListener('keydown', keySort);


function keySort(event){
    //Function to mimic a click event to trigger inputSort with the event targets
    const mouseClick = new MouseEvent('click',{
        bubbles: true,
    });
    const keyCode = event.key;
    const numChoice = /^[0-9]/;
    const operatorChoice = /^[\/+*=-]/;
    const clearChoice = ['Backspace', 'Delete'];
    const decimal = '.';
    //Decides what div to trigger click event based on key code. Unusable keycodes just exit out.
    switch (true){
        case (numChoice.test(keyCode)):
            return document.querySelector(`div[data-number="${keyCode}"]`).dispatchEvent(mouseClick);        
        case (operatorChoice.test(keyCode)):
            return document.querySelector(`div[data-operator="${keyCode}"]`).dispatchEvent(mouseClick); 
        case (clearChoice.includes(keyCode)):
            return document.querySelector(`div[data-clear="${keyCode}"]`).dispatchEvent(mouseClick);
        case (decimal.includes(keyCode)):
            return document.querySelector(`div[data-modify="${keyCode}"]`).dispatchEvent(mouseClick);
        default:
            return;        
    }
}

function inputSort(event){
    //Sorts event listener targets. Returns null if unusable
    if (currentTotal.textContent === 'Error') return clear();
    const sortData = event.target.dataset;
    return sortData.number ? firstNum(event)
        : sortData.operator ? operator(event)
        : sortData.modify ? modify(event)
        : sortData.clear ? clear(event)
        : null;
}

function firstNum(event){
    //This function handles concatenating output on display
    const negative = currentTotal.textContent.indexOf('-');
    const length = currentTotal.textContent.length;
    const digit = event.target.dataset.number;
    //Check for leading zeros and negation/decimal as well as entries after operator function
    if (numClear === true || currentTotal.textContent === '0'){
        numClear = false; 
        currentTotal.textContent = '';
    } else if (currentTotal.textContent === '-0' || currentTotal.textContent === '-00'){
        currentTotal.textContent = '-';
    } else if (currentTotal.textContent === '00'){
        currentTotal.textContent = '';
    }
    //Max 9 digit check with and without negation taken into account
    if (negative === -1 && length >= 9) {
        return;
    } else if (negative === 0 && length >= 10) {
        return;
    }
    //Prevent '00' entry from passing 9 digit limit.
    switch (negative){
        case -1:
            if (digit === '00' && length >= 8) return;
        case 0:
            if (digit === '00' && length >= 9) return;
    }

    return currentTotal.textContent += digit;
}

function clear(event){
    //Clears event in case called by another function.
    if(typeof event === 'undefined'){
        currentTotal.textContent = '0';
        numClear = false;
        return;
    } else if (event.target.dataset.clear === 'Delete'){
        //Clears both displays
        currentTotal.textContent = '0';
        lastTotal.textContent = '';
        numClear = false;
        return;
    } else if (currentTotal.textContent === '0'){
        return;
    }
    //Returns the string minus last character. If last character is '' then default to 0.
    const newTotal = currentTotal.textContent.slice(0,-1);
    return (newTotal != '') ? currentTotal.textContent = newTotal 
        : currentTotal.textContent = '0';

}

function modify(event){
    //Adds or removes negative and decimal.
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
    //Function for operator input. First pass will concantenate operator to the
    //previous total, second pass will create toProcess object and call output function.
    const action = event.target.dataset.operator;
    if (numClear === false && lastTotal.textContent != ''){ 
        const toProcess = {
            action: lastTotal.textContent.slice(-1),
            firstTotal: Number(lastTotal.textContent.slice(0, -2)),
            secondTotal: Number(currentTotal.textContent),
            secondAction: event.target.dataset.operator,
        }
        output(toProcess);
        if (numClear === true) return; //Exit if division by 0
        if (lastTotal.textContent.indexOf('=') === -1){
            //If operator used to call output wasn't '=' just append operator
            lastTotal.textContent = `${currentTotal.textContent} ${action}`;
        }
        numClear = true;
        return;
    }
    lastTotal.textContent = `${currentTotal.textContent} ${action}`;
    lastTotal.style.visibility = 'visible';
    numClear = true;
}

function output(toProcess){
    let finalOutput = 0;
    let topDisplay;
    let bottomDisplay;
    switch (toProcess.action){
        case '+':
            finalOutput = toProcess.firstTotal + toProcess.secondTotal;
            break;
        case '-':
            finalOutput = toProcess.firstTotal - toProcess.secondTotal;
            break;
        case '*':
            finalOutput = toProcess.firstTotal * toProcess.secondTotal;
            break;
        case '/':
            if (toProcess.secondTotal === 0){
                currentTotal.textContent = 'Error';
                lastTotal.textContent = '';
                return numClear = true;
            }
            finalOutput = toProcess.firstTotal / toProcess.secondTotal;
            break;
    }
    if (toProcess.secondAction === '='){
        //Displays full equation on top display and adjusts font if necessary
        topDisplay = `${toProcess.firstTotal} ${toProcess.action} ${toProcess.secondTotal} ${toProcess.secondAction}`;
        if (topDisplay.length > 12) {
            lastTotal.style.setProperty('font-size', '50%');
        }                    
        lastTotal.textContent = topDisplay;
    }
    //Turns final ouput to string to find length and adjust output if necessary
    bottomDisplay = String(finalOutput).replace('.','').length;
    return (bottomDisplay > 7) ? 
        currentTotal.textContent = Number.parseFloat(finalOutput).toExponential(7) : 
        currentTotal.textContent = finalOutput;
}
