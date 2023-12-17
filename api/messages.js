import {sql} from "@vercel/postgres";
import {checkSession, unauthorizedResponse} from "../src/session";

export const config = {
    runtime: "edge",
};

export default async function handler(request) {
    try {
        const connected = await checkSession(request);
        if (!connected) {
            console.log("Not connected");
            return unauthorizedResponse();
        }


        const urlParams = new URLSearchParams(request.url.split('?')[1]);
        const sender_id = urlParams.get('sender_id');
        const receiver_id = urlParams.get('receiver_id');
        console.log('Paramètre 1:', sender_id);
        console.log('Paramètre 2:', receiver_id);

        if (!receiver_id || !sender_id ) {
            return new Response("Invalid request parameters", {
                status: 400,
                headers: { "content-type": "application/json" },
            });
        }

        const { rowCount, rows } = await sql`
            SELECT
                message_id,
                sender_id,
                receiver_id,
                content,
                TO_CHAR(timestamp, 'DD/MM/YYYY HH24:MI') as formatted_timestamp,
                message_type
            FROM
                messages
            WHERE
            
                (sender_id = ${sender_id} AND receiver_id = ${receiver_id} AND message_type!='group_chat')
                OR
                (sender_id = ${receiver_id} AND receiver_id = ${sender_id} AND message_type!='group_chat')
                OR                
                (receiver_id = ${receiver_id} AND message_type='group_chat')

            ORDER BY
                timestamp DESC;
        `;

        console.log("Got " + rowCount + " messages");

        if (rowCount === 0) {
            return new Response("[]", {
                status: 200,
                headers: { "content-type": "application/json" },
            });
        } else {
            return new Response(JSON.stringify(rows), {
                status: 200,
                headers: { "content-type": "application/json" },
            });
        }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { "content-type": "application/json" },
        });
    }
}
