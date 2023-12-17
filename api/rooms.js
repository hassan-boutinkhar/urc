import {sql} from "@vercel/postgres";
import {checkSession, unauthorizedResponse} from "../src/session";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    console.log("teste");
    try {
        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }

        // SQL query to retrieve data from the rooms table
        const selectQuery = sql`
            SELECT room_id, name, created_on, created_by
            FROM rooms
            ORDER BY created_on DESC;
        `;

        // Execute the SQL query to retrieve data
        const { rowCount, rows } = await sql`SELECT room_id, name, created_on, created_by from rooms ORDER BY created_on DESC`;
        console.log(rows);

        if (rowCount === 0) {
            return new Response("No rooms found", {
                status: 200,
                headers: { 'content-type': 'text/plain' },
            });
        } else {
            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
