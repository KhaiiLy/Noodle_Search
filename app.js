const express = require('express');
const path = require('path');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', searchRoutes);

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
