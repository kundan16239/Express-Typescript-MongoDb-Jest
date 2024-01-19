import app from "./index";
import mongoose from 'mongoose';
import logger from "./utils/logger";
import * as configJson from '../config.json';
const PORT = configJson.port;

mongoose.connect(configJson.mongoDbUrl).then(()=>{
    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`)
    });
}).catch(error=>{
  console.log(error)
  process.exit(1)
})