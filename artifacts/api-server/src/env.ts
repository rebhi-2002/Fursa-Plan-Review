import dotenv from "dotenv";
import path from "path";

const systemPort = process.env.PORT;

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });
dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: false });

if (systemPort) {
  process.env.PORT = systemPort;
}
