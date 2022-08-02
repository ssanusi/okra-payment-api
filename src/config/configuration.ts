export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  mongo_url: process.env.MONGO_URI || 'mongodb://localhost:27017/nest',
});
