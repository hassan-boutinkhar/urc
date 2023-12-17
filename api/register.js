/*
// login.js

import { db } from '@vercel/postgres';
import { kv } from "@vercel/kv";
import { arrayBufferToBase64, stringToArrayBuffer } from "../lib/base64";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        if (request.method === 'POST') {
            const { username, email, password } = await request.json();

            // Ajouter la validation pour les champs manquants
            if (!username || !email || !password) {
                const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés." };
                return new Response(JSON.stringify(error), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            // Vérifier si le nom d'utilisateur ou l'e-mail existe déjà
            const clientCheck = await db.connect();
            const { rowCount: usernameCount } = await clientCheck.sql`select count(*) from users where username = ${username}`;
            const { rowCount: emailCount } = await clientCheck.sql`select count(*) from users where email = ${email}`;

            if (usernameCount > 0) {
                const error = { code: "BAD_REQUEST", message: "Le nom d'utilisateur est déjà pris." };
                return new Response(JSON.stringify(error), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            if (emailCount > 0) {
                const error = { code: "BAD_REQUEST", message: "L'adresse e-mail est déjà utilisée." };
                return new Response(JSON.stringify(error), {
                    status: 400,
                    headers: { 'content-type': 'application/json' },
                });
            }

            // Hasher le mot de passe
            const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
            const hashed64 = arrayBufferToBase64(hash);

            // Insérer le nouvel utilisateur
            const client = await db.connect();
            const { rows } = await client.sql`insert into users (username, email, password) values (${username}, ${email}, ${hashed64}) returning *`;

            const token = crypto.randomUUID().toString();
            const user = { id: rows[0].user_id, username: rows[0].username, email: rows[0].email, externalId: rows[0].external_id };
            await kv.set(token, user, { ex: 3600 });
            const userInfo = {};
            userInfo[user.id] = user;
            await kv.hset("users", userInfo);

            return new Response(JSON.stringify({ token, username, externalId: rows[0].external_id, id: rows[0].user_id }), {
                status: 200,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Le reste de votre code actuel pour la connexion

    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};
*/
import {db} from '@vercel/postgres';
import {arrayBufferToBase64, stringToArrayBuffer} from "../lib/base64";

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            const error = { code: "BAD_REQUEST", message: "Tous les champs doivent être renseignés" };
            return new Response(JSON.stringify(error), {
                status: 400,
                headers: { 'content-type': 'application/json' },
            });
        }

        const client = await db.connect();
        const userExistsQuery = await client.sql`SELECT * FROM users WHERE username = ${username} OR email = ${email}`;
        if (userExistsQuery.rowCount > 0) {
            const error = { code: "DUPLICATE_USER", message: "Un utilisateur avec le même nom d'utilisateur ou la même adresse e-mail existe déjà" };
            return new Response(JSON.stringify(error), {
                status: 409,
                headers: { 'content-type': 'application/json' },
            });
        }

        // Hasher le mot de passe
        const hash = await crypto.subtle.digest('SHA-256', stringToArrayBuffer(username + password));
        const hashed64 = arrayBufferToBase64(hash);

        // Générer un external_id
        const externalId = crypto.randomUUID().toString();

        // Enregistrer le nouvel utilisateur en base de données
        const newUserQuery = await client.sql`INSERT INTO users (username, email, password,created_on, external_id) VALUES (${username}, ${email}, ${hashed64}, now(), ${externalId}) RETURNING *`;
        const newUser = newUserQuery.rows[0];

        // Rediriger vers la page de login
        return new Response(null, {
            status: 200,
            headers: { 'content-type': 'application/json'},
        });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'content-type': 'application/json' },
        });
    }
};