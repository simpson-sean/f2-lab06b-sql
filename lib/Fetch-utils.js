import request, { get } from 'superagent'

const URL = "https://star-trek-api001.herokuapp.com"

export async function getAllCharacters() {
    const data = await request.get(`${URL}/trek-characters`);

    return data.body
}

export async function getOneCharacters() {
    const data = await request.get(`${URL}/trek-characters/:id`);

    return data.body
}

export async function updateCharacters() {
    const data = await request
        .put(`${URL}/trek-characters/${id}`)
        .send(characterData);

    return data.body
}

export async function createCharacters() {
    const data = await request
        .post(`${URL}/trek-characters`)
        .send(characterData);

    return data.body
}

export async function getAllFactions() {
    const data = await request.get(`${URL}/trek-factions`);

    return data.body
}

export async function deleteCharacters() {
    const data = await request.delete(`${URL}/trek-characters/${id}`);

    return data.body
}