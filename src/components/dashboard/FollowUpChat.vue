<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

type Message = {
  id: number
  content: string
  isUser: boolean
  timestamp: Date
}

const messages = ref<Message[]>([])
const newMessage = ref('')
const isLoading = ref(false)

// Add new types for API communication
interface FollowUpMessage {
  role: string
  content: string
}

// Add conversation context
const conversationContext = ref<FollowUpMessage[]>([])

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  // Add user message
  const userMessage: FollowUpMessage = {
    role: 'user',
    content: newMessage.value,
  }

  messages.value.push({
    id: Date.now(),
    content: newMessage.value,
    isUser: true,
    timestamp: new Date(),
  })

  conversationContext.value.push(userMessage)
  const userInput = newMessage.value
  newMessage.value = ''
  isLoading.value = true

  try {
    const response = await axios.post('http://localhost:8000/follow-up/chat', {
      messages: conversationContext.value,
    })

    const assistantMessage =
      response.data.messages[response.data.messages.length - 1]
    conversationContext.value.push(assistantMessage)

    messages.value.push({
      id: Date.now(),
      content: assistantMessage.content,
      isUser: false,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Failed to get AI response:', error)
  } finally {
    isLoading.value = false
  }
}

// Add initialization function
onMounted(async () => {
  try {
    isLoading.value = true
    const response = await axios.post(
      'http://localhost:8000/follow-up/chat/follow-up/start',
      {
        skill_id: props.skillId, // You'll need to add this prop
        student_answers: props.studentAnswers, // You'll need to add this prop
      },
    )

    const initialMessages = response.data.messages
    conversationContext.value = initialMessages

    // Add initial message to the chat
    const assistantMessage = initialMessages[0]
    messages.value.push({
      id: Date.now(),
      content: assistantMessage.content,
      isUser: false,
      timestamp: new Date(),
    })
  } catch (error) {
    console.error('Failed to start conversation:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="chat-container">
    <header>
      <h1>Follow-up Chat</h1>
      <p>Chat with AI about your examination results and get clarification.</p>
    </header>

    <div class="messages-list">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message-card"
        :class="{
          'user-message': message.isUser,
          'ai-message': !message.isUser,
        }"
      >
        <div class="message-content">{{ message.content }}</div>
        <div class="message-timestamp">
          {{ message.timestamp.toLocaleTimeString() }}
        </div>
      </div>
    </div>

    <div class="input-section">
      <textarea
        v-model="newMessage"
        placeholder="Type your message..."
        rows="3"
        @keyup.enter="sendMessage"
      ></textarea>
      <button
        class="send-button"
        @click="sendMessage"
        :disabled="isLoading || !newMessage.trim()"
      >
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  color: #fff;
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.message-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.ai-message {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.05);
}

.message-content {
  font-size: 0.95rem;
  line-height: 1.5;
}

.message-timestamp {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.5rem;
  text-align: right;
}

.input-section {
  display: grid;
  gap: 1rem;
}

textarea {
  width: 100%;
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: #fff;
  font-size: 0.95rem;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}

textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.send-button {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.send-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.send-button:not(:disabled):hover {
  background: #2563eb;
  transform: translateY(-1px);
}
</style>
