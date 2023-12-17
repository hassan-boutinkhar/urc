import {db} from '@vercel/postgres';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { sender_id, receiver_id, content, message_type } = await request.json();

        if (!sender_id || !receiver_id || !content) {
            const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }
        console.log(message_type)

        const client = await db.connect();
        const newMessageQuery = await client.sql`
            INSERT INTO messages (sender_id, receiver_id, content, timestamp,message_type)
            VALUES (${sender_id}, ${receiver_id}, ${content}, now(),${message_type})
            RETURNING *`;

        const newMessage = newMessageQuery.rows[0];

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
