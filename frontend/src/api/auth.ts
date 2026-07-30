import api from './axios'

async function getCsrfCookie() {

    await api.get('http://localhost:8000/sanctum/csrf-cookie');  
   
}

export async function login(email: string, password: string) {

    await getCsrfCookie();

    const res = await api.post('/login', {

        email, 
        password
    
    })

    return res.data
    
}

export async function logout() {

    const res = await api.post('/logout');

    return res.data
    
}
