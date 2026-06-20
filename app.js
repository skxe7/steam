const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));

let items = [
  { id: 1, category: 'all', type: 'AK-47', name: 'Redline', rarity: 'classified', price: 450, color: '#8a2be2' },
  { id: 2, category: 'weapons', type: 'AWP', name: 'Dragon Lore', rarity: 'covert', price: 25000, color: '#ff0000' },
  { id: 3, category: 'knives', type: 'Karambit', name: 'Doppler', rarity: 'covert', price: 12000, color: '#ff0000' },
  { id: 4, category: 'gloves', type: 'Sport Gloves', name: "Pandora's Box", rarity: 'extraordinary', price: 18000, color: '#00b7eb' },
  { id: 5, category: 'all', type: 'M4A1-S', name: 'Hyper Beast', rarity: 'classified', price: 850, color: '#8a2be2' },
  { id: 6, category: 'weapons', type: 'Desert Eagle', name: 'Golden Koi', rarity: 'restricted', price: 320, color: '#4b0082' },
  { id: 7, category: 'knives', type: 'Butterfly Knife', name: 'Fade', rarity: 'covert', price: 9500, color: '#ff0000' },
  { id: 8, category: 'weapons', type: 'Glock-18', name: 'Fade', rarity: 'restricted', price: 280, color: '#4b0082' }
];

let user = { balance: 65000, inventory: [] };

app.get('/api/items', (req, res) => {
  const { category = 'all' } = req.query;
  const filtered = category === 'all' 
    ? items 
    : items.filter(i => i.category === category);
  res.json(filtered);
});

app.post('/api/buy', (req, res) => {
  const { itemId } = req.body;
  const item = items.find(i => i.id === itemId);
  if (!item) return res.status(404).json({ success: false, message: 'Предмет не найден' });
  if (user.balance < item.price) return res.status(400).json({ success: false, message: 'Недостаточно средств' });

  user.balance -= item.price;
  user.inventory.push({...item, purchasedAt: new Date().toISOString()});
  res.json({ success: true, message: `Куплено: ${item.type} | ${item.name}`, newBalance: user.balance });
});

app.get('/api/inventory', (req, res) => res.json(user.inventory));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));

app.listen(port, () => console.log(`CS:GO Steam клон запущен → http://localhost:${port}`));
