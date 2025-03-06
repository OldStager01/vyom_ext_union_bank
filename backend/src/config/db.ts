import { Pool } from "pg";
import env from "./env";
const pool = new Pool({
    connectionString: env.DB_URL,
    max: 20,
    ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 2000,
});

// Perform a query on the database
const query = async (text: string, params: any = []) => {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
};

// Perform a transaction on the database
const transaction = async (commands: { text: string; params: any[] }[]) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Start the transaction

        for (const command of commands) {
            const { text, params } = command;
            await client.query(text, params);
        }

        await client.query("COMMIT"); // Commit the transaction
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Transaction failed. Rolled back.", error);
        throw error;
    } finally {
        client.release();
    }
};
export { query, transaction };
