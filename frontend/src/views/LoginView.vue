<script>
import { reactive } from 'vue'
import axios from 'axios'
import { useRouter, RouterLink } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const state = reactive({
            email: '',
            password: '',
            error: null
        })

        const handleEmailInput = (event) => {
            state.email = event.target.value
        }

        const handlePasswordInput = (event) => {
            state.password = event.target.value
        }

        const login = async () => {
            try {
                state.error = null
                const response = await axios.post('http://localhost:3000/users/auth/login', {
                    email: state.email,
                    password: state.password
                })
                // Handle successful login
                console.log('Login successful', response.data)
                router.push('/')
            } catch (err) {
                state.error = 'Invalid email or password'
            }
        }

        return {
            email: state.email,
            password: state.password,
            error: state.error,
            login,
            handleEmailInput,
            handlePasswordInput
        }
    }
}
</script>

<template>
    <div class="login">
        <h2>Login</h2>
        <form @submit.prevent="login">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="email" @input="handleEmailInput" required />
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="password" @input="handlePasswordInput" required />
            </div>
            <button type="submit">Login</button>
        </form>
        <RouterLink to="/register">Register</RouterLink>
        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<style>
.login {
    max-width: 300px;
    margin: 0 auto;
    padding: 1em;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.form-group {
    margin-bottom: 1em;
}

.error {
    color: red;
}
</style>
