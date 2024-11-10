<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const activeForm = ref('login')

function toggleForm() {
  activeForm.value = activeForm.value === 'login' ? 'register' : 'login'
}
</script>

<template>
  <div class="auth-container">
    <div class="logo">
      <img
        src="../assets/logo.png"
        alt="logo"
        class="logo"
        width="100"
        height="100"
      />
    </div>
    <h1>{{ activeForm === 'login' ? 'Sign in' : 'Create an account' }}</h1>
    <LoginForm v-if="activeForm === 'login'" />
    <RegisterForm v-else />
    <p class="toggle-form">
      {{
        activeForm === 'login'
          ? "Don't have an account?"
          : 'Already have an account?'
      }}
      <a href="#" @click.prevent="toggleForm">
        {{ activeForm === 'login' ? 'Create an account' : 'Sign in' }}
      </a>
    </p>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: white;
}

.logo {
  text-align: center;
  margin-bottom: 20px;
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.toggle-form {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.toggle-form a {
  color: #0000ee;
  text-decoration: none;
}
</style>
