import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
