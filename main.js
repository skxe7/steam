let currentCategory = 'all';

// Load items
async function loadItems(category = 'all') {
    currentCategory = category;
    const response = await fetch(`/api/items?category=${category}`);
    const items = await response.json();
    
    const grid = document.getElementById('items-grid');
    grid.innerHTML = '';
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-rarity-bar" style="background-color: ${item.color};"></div>
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
    
    // Add buy listeners
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            buyItem(parseInt(btn.dataset.id));
        });
    });
}

// Buy item
async function buyItem(itemId) {
    const response = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId })
    });
    
    const result = await response.json();
    
    if (result.success) {
        showNotification(result.message);
        updateBalance(result.newBalance);
    } else {
        showNotification(result.message, true);
    }
}

// Update balance
function updateBalance(newBalance) {
    document.getElementById('balance').textContent = `₴ ${newBalance.toLocaleString('ru-RU')}`;
}

// Notification
function showNotification(message, isError = false) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.style.backgroundColor = isError ? '#4a2a2a' : '#2a3a4f';
    notif.style.borderColor = isError ? '#f04747' : '#66c0f4';
    notif.style.color = isError ? '#f04747' : '#a4e61b';
    notif.style.display = 'block';
    
    setTimeout(() => {
        notif.style.display = 'none';
    }, 3000);
}

// Friends (static CSS demo)
function loadFriends() {
    const friendsHTML = `
        <div class="friend">
            <div class="friend-avatar">AL</div>
            <div class="friend-name">Alex • В сети</div>
        </div>
        <div class="friend">
            <div class="friend-avatar" style="background: linear-gradient(135deg, #f4a460, #d2691e);">BO</div>
            <div class="friend-name">Bobby • В сети</div>
        </div>
        <div class="friend">
            <div class="friend-avatar">VI</div>
            <div class="friend-name">Viktor • Не в сети</div>
        </div>
    `;
    document.getElementById('friends-list').innerHTML = friendsHTML;
}

// Category clicks
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    loadItems('all');
    loadFriends();
    updateBalance(50000);
    
    // Category filter
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            loadItems(item.dataset.category);
        });
    });
    
    // Search (basic client-side)
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (!term) {
            loadItems(currentCategory);
            return;
        }
        
        // For demo - reload and filter client-side (simple)
        fetch(`/api/items?category=${currentCategory}`)
            .then(res => res.json())
            .then(items => {
                const filtered = items.filter(i => 
                    i.name.toLowerCase().includes(term) || 
                    i.type.toLowerCase().includes(term)
                );
                
                const grid = document.getElementById('items-grid');
                grid.innerHTML = '';
                
                if (filtered.length === 0) {
                    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">Ничего не найдено</div>';
                    return;
                }
                
                filtered.forEach(item => {
                    // Reuse same card creation logic
                    const card = document.createElement('div');
                    card.className = 'item-card';
                    card.innerHTML = `
                        <div class="item-rarity-bar" style="background-color: ${item.color};"></div>
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
                
                // Re-attach buy buttons
                document.querySelectorAll('.buy-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        buyItem(parseInt(btn.dataset.id));
                    });
                });
            });
    });
});
