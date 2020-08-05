const PORT = process.env.PORT || 3001;
const { app } = require('./src/app');

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
