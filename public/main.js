let currentCategory = 'all';

async function loadItems(category = 'all', searchTerm = '') {
    currentCategory = category;
    const res = await fetch(`/api/items?category=${category}`);
    let items = await res.json();

    if (searchTerm) {
        items = items.filter(i => 
            i.name.toLowerCase().includes(searchTerm) || 
            i.type.toLowerCase().includes(searchTerm)
        );
    }

    const grid = document.getElementById('items-grid');
    grid.innerHTML = items.length ? '' : '<div style="grid-column:1/-1;padding:60px;text-align:center;color:var(--text-muted)">Ничего не найдено</div>';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-rarity-bar" style="background-color: ${item.color}"></div>
            <div class="item-content">
                <div class="item-type">${item.type}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-placeholder">${item.type}<br>${item.name}</div>
                <div class="item-price">₴ ${item.price.toLocaleString('ru-RU')}</div>
                <button class="buy-btn" data-id="${item.id}">Купить</button>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => buyItem(+btn.dataset.id));
    });
}

async function buyItem(itemId) {
    const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
    });
    const data = await res.json();
    if (data.success) {
        updateBalance(data.newBalance);
        showNotification(data.message);
    } else {
        showNotification(data.message, true);
    }
}

function updateBalance(balance) {
    document.getElementById('balance').textContent = `₴ ${balance.toLocaleString('ru-RU')}`;
}

function showNotification(msg, error = false) {
    const n = document.getElementById('notification');
    n.textContent = msg;
    n.style.backgroundColor = error ? '#4a2a2a' : '#2a3a4f';
    n.style.color = error ? '#ff6666' : 'var(--success-green)';
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 2800);
}

async function showInventory() {
    const res = await fetch('/api/inventory');
    const inv = await res.json();
    const main = document.getElementById('main-content');
    main.innerHTML = `<h1 style="margin-bottom:20px">Ваш инвентарь (${inv.length})</h1><div class="items-grid" id="inv-grid"></div>`;
    
    const grid = document.getElementById('inv-grid');
    if (!inv.length) {
        grid.innerHTML = '<div style="padding:80px;text-align:center;color:var(--text-muted)">Инвентарь пуст</div>';
        return;
    }
    inv.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-rarity-bar" style="background-color: ${item.color}"></div>
            <div class="item-content">
                <div class="item-type">${item.type}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-placeholder">${item.type}<br>${item.name}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadItems('all');
    updateBalance(65000);

    document.querySelectorAll('.category-item').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            li.classList.add('active');
            loadItems(li.dataset.category, document.getElementById('search').value.toLowerCase());
        });
    });

    document.getElementById('search').addEventListener('input', (e) => {
        loadItems(currentCategory, e.target.value.toLowerCase().trim());
    });
});
