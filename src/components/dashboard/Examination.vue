<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useExaminationStore } from '@/stores/examinationStore'
import { useComponentStore } from '@/stores/componentStore'
import type { ExaminationAnswers } from '@/types'

type Confidence = 'very high' | 'high' | 'medium' | 'low' | 'none'

const examStore = useExaminationStore()
const componentStore = useComponentStore()
const currentAnswers = ref<Record<number, string>>({})
const confidenceLevels = ref<Record<number, Confidence>>({})

onMounted(async () => {
  await examStore.fetchQuestions(componentStore.getCurrentCourseId ?? 0)
  console.log('questions ----------------------------')
  console.log(examStore.getQuestions)
})

const submitAnswers = async () => {
  // Check if all questions have answers and confidence levels
  console.log('draft ----------------------------')
  console.log(examStore.getDraft)
  const questions = examStore.getQuestions
  for (const question of questions) {
    if (
      !currentAnswers.value[question.id] ||
      !confidenceLevels.value[question.id]
    ) {
      alert(
        'Please provide both an answer and confidence level for all questions',
      )
      return
    }
  }

  const answers: ExaminationAnswers = {
    topic_id: componentStore.getCurrentCourseId ?? 0,
    answers: examStore.getQuestions.map(question => ({
      id: question.id,
      sub_skill_id: question.sub_skill_id,
      sfia_level: question.sfia_level,
      question_type: question.question_type,
      question: question.question_text,
      answer: currentAnswers.value[question.id],
      correct_answer: examStore.getDraft?.questions.find(
        q => q.id === question.id,
      )?.correct_answer,
      explanation: '',
      correct: false,
    })),
  }

  try {
    await examStore.submitAnswers(answers)
    // No need to capture explanations as they'll be in the store
  } catch (error) {
    alert('Failed to submit answers')
  }
}
</script>

<template>
  <div class="examination-container">
    <header>
      <h1>Examination</h1>
      <p>Please answer the following questions and rate your confidence.</p>
    </header>

    <div class="questions-list">
      <div
        v-for="question in examStore.getQuestions"
        :key="question.id"
        class="question-card"
        :class="{
          'correct-answer': examStore.getExaminationAnswers.answers.find(
            a => a.id === question.id,
          )?.correct,
          'incorrect-answer':
            examStore.getExaminationAnswers.answers.find(
              a => a.id === question.id,
            )?.correct === false,
        }"
      >
        <h3>{{ question.question_text }}</h3>

        <div class="answer-section">
          <textarea
            v-model="currentAnswers[question.id]"
            placeholder="Enter your answer..."
            rows="3"
          ></textarea>

          <div class="confidence-selection">
            <label>Confidence Level:</label>
            <select v-model="confidenceLevels[question.id]">
              <option value="" disabled selected>Select confidence</option>
              <option value="very high">Very High</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

        <div
          v-if="
            examStore.getExaminationAnswers.answers.find(
              a => a.id === question.id,
            )
          "
          class="explanation-section"
        >
          <div class="result-label">
            {{
              examStore.getExaminationAnswers.answers.find(
                a => a.id === question.id,
              )?.correct
                ? '✓ Correct'
                : '✗ Incorrect'
            }}
          </div>
          <p class="explanation-text">
            {{
              examStore.getExaminationAnswers.answers.find(
                a => a.id === question.id,
              )?.explanation
            }}
          </p>
        </div>
      </div>
    </div>

    <button
      class="submit-button"
      @click="submitAnswers"
      :disabled="examStore.isLoading"
    >
      {{ examStore.isLoading ? 'Submitting...' : 'Submit All Answers' }}
    </button>
  </div>
</template>

<style scoped>
.examination-container {
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

.questions-list {
  display: grid;
  gap: 2rem;
}

.question-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s ease;
}

.answer-section {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
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

.confidence-selection {
  display: grid;
  gap: 0.5rem;
}

select {
  width: 100%;
  background: #2a2a2a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-size: 0.95rem;
  box-sizing: border-box;
}

select:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
}

.submit-button {
  margin-top: 2rem;
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.correct-answer {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
}

.incorrect-answer {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
}

.explanation-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.result-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.correct-answer .result-label {
  color: rgb(34, 197, 94);
}

.incorrect-answer .result-label {
  color: rgb(239, 68, 68);
}

.explanation-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.8);
}
</style>
