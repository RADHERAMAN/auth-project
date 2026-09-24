import "dotenv/config";
import connectDB from "./common/config/db.js"
import app from "./app.js";


const PORT = 3000;

await connectDB();

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})