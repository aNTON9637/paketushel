document.addEventListener('DOMContentLoaded', () => {
    // Прокрутка в начало страницы
    window.scrollTo(0, 0);
    
    console.log('Website loaded successfully!');
    
    // Добавляем обработчики для полей кода домофона
    const intercomInputs = document.querySelectorAll('input[pattern="[0-9*#]+"]');
    intercomInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9*#]/g, '');
        });
    });

    // Загружаем историю заказов при старте
    loadOrderHistory();

    // Добавляем обработчики для всех форм
    document.getElementById('singleForm').addEventListener('submit', handleSingleOrder);
    document.getElementById('weeklyForm').addEventListener('submit', handleWeeklyOrder);
    document.getElementById('monthlyForm').addEventListener('submit', handleMonthlyOrder);

    // Инициализируем расчет цены для единоразового заказа
    calculateSinglePrice();
});

// Добавляем обработчик для события beforeunload
window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// Массив для хранения истории заказов
let orderHistory = [];

function updateBalance() {
    const button = document.querySelector('.balance-button');
    // Здесь можно добавить логику обновления баланса
    console.log('Баланс обновлен');
}

function scrollToPricing() {
    const pricingSection = document.getElementById('pricing');
    pricingSection.scrollIntoView({ behavior: 'smooth' });
}

function openModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    modal.style.display = 'block';
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    modal.style.display = 'none';
}

function openHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.style.display = 'block';
    loadOrderHistory();
}

function closeHistoryModal() {
    const modal = document.getElementById('historyModal');
    modal.style.display = 'none';
}

function openPrivacyModal() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = 'block';
}

function closePrivacyModal() {
    const modal = document.getElementById('privacyModal');
    modal.style.display = 'none';
}

function openReferralModal() {
    const modal = document.getElementById('referralModal');
    modal.style.display = 'block';
}

function closeReferralModal() {
    const modal = document.getElementById('referralModal');
    modal.style.display = 'none';
}

// Закрытие модальных окон при клике вне их
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Загрузка истории заказов
function loadOrderHistory() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    orderHistory.forEach((order, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.address}</td>
            <td>${order.volume || '-'}</td>
            <td>${order.cost} ₽</td>
            <td>${order.date} ${order.time}</td>
        `;
        ordersList.appendChild(row);
    });
}

// Обработчики для разных типов заказов
function handleSingleOrder(e) {
    e.preventDefault();
    
    const address = document.getElementById('singleAddress').value;
    const date = document.getElementById('singleDate').value;
    const time = document.getElementById('singleTime').value;
    const intercom = document.getElementById('singleIntercom').value;
    const volume = document.getElementById('singleVolume').value;
    
    const cost = 50 + (volume - 1) * 25; // 50₽ за первый пакет, +25₽ за каждый следующий
    
    addToHistory({
        type: 'Единоразовый',
        address,
        date,
        time,
        volume,
        cost
    });
    
    closeModal('single');
    showSuccessMessage(cost);
}

function handleWeeklyOrder(e) {
    e.preventDefault();
    
    const address = document.getElementById('weeklyAddress').value;
    const date = document.getElementById('weeklyStartDate').value;
    const time = document.getElementById('weeklyTime').value;
    const intercom = document.getElementById('weeklyIntercom').value;
    
    addToHistory({
        type: 'Еженедельный',
        address,
        date,
        time,
        cost: 449
    });
    
    closeModal('weekly');
    showSuccessMessage(449);
}

function handleMonthlyOrder(e) {
    e.preventDefault();
    
    const address = document.getElementById('monthlyAddress').value;
    const date = document.getElementById('monthlyStartDate').value;
    const time = document.getElementById('monthlyTime').value;
    const intercom = document.getElementById('monthlyIntercom').value;
    
    addToHistory({
        type: 'Ежемесячный',
        address,
        date,
        time,
        cost: 849
    });
    
    closeModal('monthly');
    showSuccessMessage(849);
}

function addToHistory(order) {
    orderHistory.unshift(order);
    loadOrderHistory();
}

function showSuccessMessage(cost) {
    alert(`Заказ успешно оформлен!\nСтоимость: ${cost} ₽`);
}

function calculateSinglePrice() {
    const volume = document.getElementById('singleVolume').value;
    const basePrice = 50;
    const additionalPrice = 25;
    const totalPrice = basePrice + (volume - 1) * additionalPrice;
    document.getElementById('singlePriceDisplay').textContent = totalPrice;
}

// Функции для работы с профилем
function openProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'block';
    loadProfileData();
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    modal.style.display = 'none';
}

function loadProfileData() {
    // Загрузка данных профиля из localStorage
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {};
    document.getElementById('profileName').value = profileData.name || '';
    document.getElementById('profilePhone').value = profileData.phone || '';
    document.getElementById('profileEmail').value = profileData.email || '';
    
    // Загрузка сохраненных адресов
    loadAddresses();
}

function loadAddresses() {
    const addressList = document.getElementById('addressList');
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    
    addressList.innerHTML = addresses.map((address, index) => `
        <div class="address-item">
            <span>${address}</span>
            <button onclick="deleteAddress(${index})">Удалить</button>
        </div>
    `).join('');
}

function addNewAddress() {
    const address = prompt('Введите новый адрес:');
    if (address) {
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        addresses.push(address);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        loadAddresses();
    }
}

function deleteAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    addresses.splice(index, 1);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    loadAddresses();
}

// Обработчик формы профиля
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const profileData = {
        name: document.getElementById('profileName').value,
        phone: document.getElementById('profilePhone').value,
        email: document.getElementById('profileEmail').value
    };
    
    localStorage.setItem('profileData', JSON.stringify(profileData));
    alert('Данные профиля сохранены!');
});

// Маска для телефона
document.getElementById('profilePhone').addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + ') ' + (x[3] ? x[3] + '-' : '') + (x[4] ? x[4] + '-' : '') + x[5];
}); 