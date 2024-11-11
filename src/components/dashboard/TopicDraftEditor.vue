<script setup lang="ts">
import { useTopicStore } from '@/stores/topicStore'
import { storeToRefs } from 'pinia'
import type { SkillCreate } from '@/types'

const store = useTopicStore()
const { topic } = storeToRefs(store)
const {
  saveDraft,
  addSkill,
  removeSkill,
  addSubskill,
  removeSubskill,
  addQuestion,
  removeQuestion,
} = store

// Initialize new topic if none exists
if (!topic.value.name) {
  store.initializeNewTopic()
}
</script>

<!-- components/TopicDraftEditor.vue -->
<template>
  <div class="topic-editor">
    <div class="topic-header">
      <h1>Topic Draft Editor</h1>
      <button @click="saveDraft" class="save-button">Save Draft</button>
    </div>

    <!-- Topic Details -->
    <div class="topic-details card">
      <h2>Topic Details</h2>
      <div class="form-group">
        <label>Topic Name</label>
        <input v-model="topic.name" placeholder="Enter topic name" />
      </div>
      <div class="form-group">
        <label>Mastery Definition</label>
        <textarea
          v-model="topic.mastery_definition"
          placeholder="Define what mastery means for this topic"
        ></textarea>
      </div>
    </div>

    <!-- Skills Section -->
    <div class="skills-section">
      <div class="section-header">
        <h2>Skills</h2>
        <button @click="addSkill" class="add-button">+ Add Skill</button>
      </div>

      <div
        v-for="(skill, skillIndex) in topic.skills as SkillCreate[]"
        :key="skillIndex"
        class="card"
      >
        <div class="card-header">
          <h3>Skill {{ skillIndex + 1 }}</h3>
          <button @click="removeSkill(skillIndex)" class="remove-button">
            ×
          </button>
        </div>

        <!-- Skill Details -->
        <div class="form-group">
          <label>Skill Name</label>
          <input v-model="skill.name" placeholder="Enter skill name" />
        </div>
        <div class="form-group">
          <label>Mastery Definition</label>
          <textarea
            v-model="skill.mastery_definition_of_skill"
            placeholder="Define what mastery means for this skill"
          ></textarea>
        </div>
        <div class="form-group">
          <label>Content to Master</label>
          <textarea
            v-model="skill.content_to_master"
            placeholder="What content needs to be mastered"
          ></textarea>
        </div>

        <!-- Subskills Section -->
        <div class="subskills-section">
          <div class="section-header">
            <h4>Subskills</h4>
            <button @click="addSubskill(skillIndex)" class="add-button">
              + Add Subskill
            </button>
          </div>

          <div
            v-for="(subskill, subskillIndex) in skill.subskills"
            :key="subskillIndex"
            class="subskill-card"
          >
            <div class="card-header">
              <h5>Subskill {{ subskillIndex + 1 }}</h5>
              <button
                @click="removeSubskill(skillIndex, subskillIndex)"
                class="remove-button"
              >
                ×
              </button>
            </div>

            <!-- Subskill Details -->
            <div class="form-group">
              <label>Subskill Name</label>
              <input
                v-model="subskill.name"
                placeholder="Enter subskill name"
              />
            </div>
            <div class="form-group">
              <label>Content to Master</label>
              <textarea
                v-model="subskill.content_to_master"
                placeholder="What content needs to be mastered"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Condensed Learning Materials</label>
              <textarea
                v-model="subskill.condensed_learning_materials"
                placeholder="Enter condensed learning materials"
              ></textarea>
            </div>

            <!-- SFIA Levels -->
            <div class="sfia-levels">
              <h6>SFIA Levels</h6>
              <div v-for="level in 7" :key="level" class="form-group">
                <label>Level {{ level }}</label>
                <textarea
                  v-model="subskill[`sfia_${level}_definition`]"
                  placeholder="Define SFIA level {{ level }}"
                ></textarea>
              </div>
            </div>

            <!-- Questions Section -->
            <div class="questions-section">
              <div class="section-header">
                <h6>Questions</h6>
                <button
                  @click="addQuestion(skillIndex, subskillIndex)"
                  class="add-button"
                >
                  + Add Question
                </button>
              </div>

              <div
                v-for="(question, questionIndex) in subskill.questions"
                :key="questionIndex"
                class="question-card"
              >
                <div class="card-header">
                  <h6>Question {{ questionIndex + 1 }}</h6>
                  <button
                    @click="
                      removeQuestion(skillIndex, subskillIndex, questionIndex)
                    "
                    class="remove-button"
                  >
                    ×
                  </button>
                </div>

                <div class="form-group">
                  <label>Question Type</label>
                  <select v-model="question.type">
                    <option value="theory">Theory</option>
                    <option value="practice">Practice</option>
                    <option value="application">Application</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Question Text</label>
                  <textarea
                    v-model="question.question_text"
                    placeholder="Enter question text"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Correct Answer</label>
                  <textarea
                    v-model="question.correct_answer"
                    placeholder="Enter correct answer"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Explanation</label>
                  <textarea
                    v-model="question.explanation"
                    placeholder="Enter explanation"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>SFIA Level</label>
                  <select v-model="question.sfia_level">
                    <option v-for="level in 7" :key="level" :value="level">
                      Level {{ level }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
