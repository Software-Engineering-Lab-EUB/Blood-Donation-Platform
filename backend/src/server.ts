import app from "./app";
import connectDB from "./app/config/db";

async function main() {
    try {
        await connectDB();
        app.listen(4000, () => {
            console.log("Blood donation server is running on port 4000");
        })
    }
    catch (error) {
        console.log(error);
    }
}

main();