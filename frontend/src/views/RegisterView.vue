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
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            sex: 'MALE',
            error: null
        })

        const handleEmailInput = (event) => {
            state.email = event.target.value
        }

        const handlePasswordInput = (event) => {
            state.password = event.target.value
        }

        const handleFirstNameInput = (event) => {
            state.firstName = event.target.value
        }

        const handleLastNameInput = (event) => {
            state.lastName = event.target.value
        }

        const handleDateOfBirthInput = (event) => {
            state.dateOfBirth = event.target.value
        }

        const handleSexChange = (event) => {
            state.sex = event.target.value
        }

        const register = async () => {
            try {
                state.error = null
                const response = await axios.post('http://localhost:3000/users/auth/register', {
                    email: state.email,
                    password: state.password,
                    firstName: state.firstName,
                    lastName: state.lastName,
                    dateOfBirth: state.dateOfBirth,
                    sex: state.sex
                })
                // Handle successful register
                console.log('Register successful', response.data)
                router.push('/login')
            } catch (err) {
                state.error = 'Failed to register. Please check your input.'
            }
        }

        return {
            email: state.email,
            password: state.password,
            firstName: state.firstName,
            lastName: state.lastName,
            dateOfBirth: state.dateOfBirth,
            sex: state.sex,
            error: state.error,
            register,
            handleEmailInput,
            handlePasswordInput,
            handleFirstNameInput,
            handleLastNameInput,
            handleDateOfBirthInput,
            handleSexChange
        }
    }
}
</script>

<template>
    <div class="register">
        <h2>Register</h2>
        <form @submit.prevent="register">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" v-model="email" @input="handleEmailInput" required />
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" v-model="password" @input="handlePasswordInput" required />
            </div>
            <div class="form-group">
                <label for="firstName">First Name:</label>
                <input type="text" v-model="firstName" @input="handleFirstNameInput" required />
            </div>
            <div class="form-group">
                <label for="lastName">Last Name:</label>
                <input type="text" v-model="lastName" @input="handleLastNameInput" required />
            </div>
            <div class="form-group">
                <label for="dateOfBirth">Date of Birth:</label>
                <input type="date" v-model="dateOfBirth" @input="handleDateOfBirthInput" required />
            </div>
            <div class="form-group">
                <label for="sex">Sex:</label>
                <select v-model="sex" @change="handleSexChange">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                </select>
            </div>
            <button type="submit">Register</button>
        </form>
        <RouterLink to="/login">Login</RouterLink>
        <p v-if="error" class="error">{{ error }}</p>
    </div>
</template>

<style>
.register {
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
