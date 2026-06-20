const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Views setup (though using static HTML)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); // Not using templating, serving static

// Sample data - CS:GO items
let items = [
  {
    id: 1,
    category: 'all',
    type: 'AK-47',
    name: 'Redline',
    rarity: 'classified',
    price: 450,
    color: '#8a2be2' // Purple
  },
  {
    id: 2,
    category: 'weapons',
    type: 'AWP',
    name: 'Dragon Lore',
    rarity: 'covert',
    price: 25000,
    color: '#ff0000' // Red
  },
  {
    id: 3,
    category: 'knives',
    type: 'Karambit',
    name: 'Doppler',
    rarity: 'covert',
    price: 12000,
    color: '#ff0000'
  },
  {
    id: 4,
    category: 'gloves',
    type: 'Sport Gloves',
    name: 'Pandora\'s Box',
    rarity: 'extraordinary',
    price: 18000,
    color: '#00b7eb' // Blue
  },
  {
    id: 5,
    category: 'all',
    type: 'M4A1-S',
    name: 'Hyper Beast',
    rarity: 'classified',
    price: 850,
    color: '#8a2be2'
  },
  {
    id: 6,
    category: 'weapons',
    type: 'Desert Eagle',
    name: 'Golden Koi',
    rarity: 'restricted',
    price: 320,
    color: '#4b0082' // Indigo
  }
];

// User state (in-memory)
let user = {
  balance: 50000,
  inventory: []
};

// API Routes
app.get('/api/items', (req, res) => {
  const { category = 'all' } = req.query;
  if (category === 'all') {
    res.json(items);
  } else {
    res.json(items.filter(item => item.category === category || item.category === 'all'));
  }
});

app.post('/api/buy', (req, res) => {
  const { itemId } = req.body;
  const item = items.find(i => i.id === itemId);
  
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  
  if (user.balance < item.price) {
    return res.status(400).json({ success: false, message: 'Insufficient balance' });
  }
  
  user.balance -= item.price;
  user.inventory.push(item);
  
  res.json({ 
    success: true, 
    message: `Куплено: ${item.type} | ${item.name}`,
    newBalance: user.balance 
  });
});

app.get('/api/user', (req, res) => {
  res.json({
    balance: user.balance,
    inventoryCount: user.inventory.length
  });
});

// Serve index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(port, () => {
  console.log(`Steam CS:GO clone running at http://localhost:${port}`);
});
