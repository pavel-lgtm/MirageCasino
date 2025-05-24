document.addEventListener('DOMContentLoaded', function() {
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spin-btn');
    const balanceElement = document.getElementById('balance');
    const betInput = document.getElementById('bet-input');
    const resultElement = document.getElementById('result');
    
    let balance = 1000;
    let currentBet = 0;
    let currentBetType = null;
    let currentBetNumber = null;
    let isSpinning = false;
    
    // Цвета для чисел в рулетке (0 - зеленый, затем чередуются красный/черный)
    const rouletteNumbers = [
        { number: 0, color: 'green' },
        { number: 1, color: 'red' },
        { number: 2, color: 'black' },
        { number: 3, color: 'red' },
        // Добавьте остальные числа до 36 по правилам рулетки
    ];
    
    // Обработчики ставок на числа
    document.querySelectorAll('.number').forEach(number => {
        number.addEventListener('click', function() {
            if (isSpinning) return;
            
            const numberValue = parseInt(this.getAttribute('data-number'));
            placeBet('number', numberValue);
        });
    });
    
    // Обработчики внешних ставок
    document.querySelectorAll('.bet-option').forEach(option => {
        option.addEventListener('click', function() {
            if (isSpinning) return;
            
            const betType = this.getAttribute('data-bet');
            placeBet(betType);
        });
    });
    
    // Функция размещения ставки
    function placeBet(type, number = null) {
        const betAmount = parseInt(betInput.value);
        
        if (isNaN(betAmount) {
            resultElement.textContent = 'Введите корректную сумму ставки';
            return;
        }
        
        if (betAmount < 10) {
            resultElement.textContent = 'Минимальная ставка - 10 ₽';
            return;
        }
        
        if (betAmount > balance) {
            resultElement.textContent = 'Недостаточно средств';
            return;
        }
        
        currentBet = betAmount;
        currentBetType = type;
        currentBetNumber = number;
        
        resultElement.textContent = Ставка ${betAmount} ₽ на ${type}${number ? ' ' + number : ''};
    }
    
    // Обработчик кнопки "Крутить"
    spinBtn.addEventListener('click', function() {
        if (isSpinning) return;
        
        if (currentBet === 0 || !currentBetType) {
            resultElement.textContent = 'Сделайте ставку перед вращением';
            return;
        }
        
        if (currentBet > balance) {
            resultElement.textContent = 'Недостаточно средств';
            return;
        }
        
        isSpinning = true;
        balance -= currentBet;
        balanceElement.textContent = balance;
        
        // Анимация вращения колеса
        const spinDegrees = 1800 + Math.floor(Math.random() * 360);
        wheel.style.transform = rotate(${spinDegrees}deg);
        
        // Определение выигрышного числа после завершения анимации
        setTimeout(() => {
            const winningNumber = Math.floor(Math.random() * 37); // 0-36
            const winningColor = getColorForNumber(winningNumber);
            
            resultElement.textContent = Выпало: ${winningNumber} (${winningColor});
            
            // Проверка выигрыша
            const winAmount = checkWin(winningNumber, winningColor);
            
            if (winAmount > 0) {
                balance += winAmount;
                balanceElement.textContent = balance;
                resultElement.textContent +=  - Вы выиграли ${winAmount} ₽!;
            } else {
                resultElement.textContent += ' - Вы проиграли';
            }
            
            currentBet = 0;
            currentBetType = null;
            currentBetNumber = null;
            isSpinning = false;
        }, 5000);
    });
    
    // Функция определения цвета для числа
    function getColorForNumber(number) {
        if (number === 0) return 'green';
        return number % 2 === 0 ? 'black' : 'red';
    }
    
    // Функция проверки выигрыша
    function checkWin(number, color) {
        if (currentBetType === 'number') {
            return number === currentBetNumber ? currentBet * 36 : 0;
        }
        
        if (currentBetType === 'red' && color === 'red') {
            return currentBet * 2;
        }
        
        if (currentBetType === 'black' && color === 'black') {
            return currentBet * 2;
        }
        
        if (currentBetType === 'even' && number !== 0 && number % 2 === 0) {
            return currentBet * 2;
        }
        
        if (currentBetType === 'odd' && number % 2 !== 0) {
            return currentBet * 2;
        }
        
        if (currentBetType === '1-12' && number >= 1 && number <= 12) {
            return currentBet * 3;
        }
        
        if (currentBetType === '13-24' && number >= 13 && number <= 24) {
            return currentBet * 3;
        }
        
        if (currentBetType === '25-36' && number >= 25 && number <= 36) {
            return currentBet * 3;
        }
        
        return 0;
    }
});