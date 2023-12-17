import {db} from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { name, created_by } = await request.json();

        if (!name || !created_by) {
            console.log(name , created_by)
            const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const client = await db.connect();
        const newRoomQuery = await client.sql`
            INSERT INTO rooms (name, created_on, created_by)
            VALUES (${name}, now(), ${created_by} )
            RETURNING *`;

        const newMessage = newRoomQuery.rows[0];

        return new Response(JSON.stringify(newMessage), {
            status: 200,
            headers: { 'content-type': 'application/json' },
        });

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
}
