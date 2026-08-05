import api from './axios'

async function getCsrfCookie() {

    await api.get('http://localhost:8000/sanctum/csrf-cookie');  
   
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {

    await getCsrfCookie();

    const res = await api.post('/register', {

        name,
        email,
        password,
        password_confirmation
        
    })

    return res.data

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

    console.log(res.data)

    return res.data
    
}

export async function fetchUser() {

    const res = await api.get('/user');
    return res.data

}
