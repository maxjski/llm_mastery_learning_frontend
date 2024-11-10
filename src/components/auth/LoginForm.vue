<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')

async function handleSubmit() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err: unknown) {
    console.error('Login failed:', err)
    error.value = 'Invalid credentials. Please try again.'
    if (err instanceof Error && 'response' in err) {
      const axiosError = err as { response?: { data?: { detail?: string } } }
      if (axiosError.response?.data?.detail) {
        error.value = axiosError.response.data.detail
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="signin-form">
    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        v-model="email"
        required
        placeholder="Your email address"
      />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        v-model="password"
        required
        placeholder="Your password"
      />
    </div>
    <button type="submit" class="signin-button">Sign in</button>
    <p v-if="error" class="error-message">{{ error }}</p>
  </form>
</template>

<style scoped>
.signin-form {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.signin-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  margin-bottom: 10px;
  box-sizing: border-box;
  background-color: #000;
  color: white;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
