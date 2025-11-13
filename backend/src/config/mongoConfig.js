const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // As opções useNewUrlParser, useUnifiedTopology, useFindAndModify, e useCreateIndex
      // não são mais necessárias no Mongoose 6+, então foram removidas
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
