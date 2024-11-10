<script setup lang="ts">
import { ref } from 'vue'
import type { TopicDraftResponse } from '@/services/topicService'
import { createTopicFromDraft, generateTempId } from '@/services/topicService'

const props = defineProps<{
  draft: TopicDraftResponse
}>()

const topicDraft = ref<TopicDraftResponse>(props.draft)

const addSkill = () => {
  topicDraft.value?.skills.push({
    name: '',
    mastery_definition_of_skill: '',
    content_to_master: '',
  })
}

const deleteSkill = (index: number) => {
  if (!topicDraft.value) return

  const skillId = index + 1

  topicDraft.value.skills.splice(index, 1)

  topicDraft.value.sub_skills = topicDraft.value.sub_skills.filter(
    ss => ss.skill_id !== skillId,
  )

  if (topicDraft.value.questions) {
    topicDraft.value.questions = topicDraft.value.questions.filter(
      q =>
        !topicDraft.value?.sub_skills.some(
          ss => ss.skill_id === q.sub_skill_id,
        ),
    )
  }

  topicDraft.value.sub_skills.forEach(ss => {
    if (ss.skill_id > skillId) {
      ss.skill_id--
    }
  })
}

const addSubSkill = (skillId: number) => {
  if (!topicDraft.value) return
  topicDraft.value.sub_skills.push({
    temp_id: generateTempId(),
    name: '',
    content_to_master: '',
    condensed_learning_materials: '',
    sfia_level: 1,
    skill_id: skillId,
    sfia_1_definition: undefined,
    sfia_2_definition: undefined,
    sfia_3_definition: undefined,
    sfia_4_definition: undefined,
    sfia_5_definition: undefined,
    sfia_6_definition: undefined,
    sfia_7_definition: undefined,
  })
}

const deleteSubSkill = (index: number) => {
  if (!topicDraft.value) return

  const subSkillToDelete = topicDraft.value.sub_skills[index]

  topicDraft.value.sub_skills.splice(index, 1)

  if (topicDraft.value.questions) {
    topicDraft.value.questions = topicDraft.value.questions.filter(
      q => q.sub_skill_temp_id !== subSkillToDelete.temp_id,
    )
  }
}

const saveDraft = async () => {
  if (!topicDraft.value) return

  try {
    const draftData = {
      topic: topicDraft.value.topic,
      skills: topicDraft.value.skills,
      sub_skills: topicDraft.value.sub_skills.map(
        ({ temp_id, ...rest }) => rest,
      ),
      questions: topicDraft.value.questions.map(
        ({ temp_id, sub_skill_temp_id, ...rest }) => ({
          ...rest,
          sub_skill_id:
            topicDraft.value!.sub_skills.findIndex(
              ss => ss.temp_id === sub_skill_temp_id,
            ) + 1,
        }),
      ),
    }

    const result = await createTopicFromDraft(draftData)
    console.log('Draft saved successfully:', result)
  } catch (error) {
    console.error('Error saving draft:', error)
  }
}

const addQuestion = (subSkillIndex: number) => {
  if (!topicDraft.value) return
  const subSkill = topicDraft.value.sub_skills[subSkillIndex]

  if (!topicDraft.value.questions) {
    topicDraft.value.questions = []
  }

  topicDraft.value.questions.push({
    temp_id: generateTempId(),
    question_type: 'theory',
    question_text: '',
    correct_answer: '',
    explanation: undefined,
    sfia_level: subSkill.sfia_level,
    sub_skill_temp_id: subSkill.temp_id,
  })
}

const deleteQuestion = (subSkillIndex: number, questionIndex: number) => {
  if (!topicDraft.value?.questions) return
  topicDraft.value.questions.splice(questionIndex, 1)
}

const getQuestionsForSubSkill = (subSkillTempId: string) => {
  return (
    topicDraft.value?.questions?.filter(
      q => q.sub_skill_temp_id === subSkillTempId,
    ) || []
  )
}
</script>

<template>
  <div class="topic-draft-container">
    <div class="topic-draft">
      <h2>Topic Draft</h2>

      <!-- Topic Section -->
      <div class="section topic-section">
        <h3>Topic Details</h3>
        <div class="input-group">
          <input
            v-model="topicDraft.topic.name"
            class="input-field"
            placeholder="Topic name"
          />
          <input
            v-model="topicDraft.topic.mastery_definition"
            class="input-field"
            placeholder="Mastery definition"
          />
        </div>
      </div>

      <!-- Skills Section -->
      <div
        v-for="(skill, skillIndex) in topicDraft.skills"
        :key="skillIndex"
        class="section skill-section"
      >
        <div class="section-header">
          <h3>Skill {{ skillIndex + 1 }}</h3>
          <button @click="deleteSkill(skillIndex)" class="delete-button">
            Delete Skill
          </button>
        </div>

        <div class="input-group">
          <input
            v-model="skill.name"
            class="input-field"
            placeholder="Skill name"
          />
          <input
            v-model="skill.mastery_definition_of_skill"
            class="input-field"
            placeholder="Mastery definition"
          />
          <textarea
            v-model="skill.content_to_master"
            class="textarea-field"
            placeholder="Content to master"
          ></textarea>
        </div>

        <!-- Sub-skills Section -->
        <div class="section sub-skills-section">
          <h4>Sub-skills</h4>
          <div class="sub-skills-container">
            <div
              v-for="(subSkill, subIndex) in topicDraft.sub_skills.filter(
                ss => ss.skill_id === skillIndex + 1,
              )"
              :key="subIndex"
              class="sub-skill"
            >
              <div class="section-header">
                <input
                  v-model="subSkill.name"
                  class="input-field"
                  placeholder="Sub-skill name"
                />
                <button @click="deleteSubSkill(subIndex)" class="delete-button">
                  Delete
                </button>
              </div>

              <div class="input-group">
                <textarea
                  v-model="subSkill.content_to_master"
                  class="textarea-field"
                  placeholder="Content to master"
                ></textarea>
                <input
                  v-model="subSkill.condensed_learning_materials"
                  class="input-field"
                  placeholder="Condensed learning materials"
                />
                <select v-model="subSkill.sfia_level" class="select-field">
                  <option v-for="n in 7" :key="n" :value="n">
                    SFIA Level {{ n }}
                  </option>
                </select>

                <!-- SFIA Definitions -->
                <div class="sfia-definitions">
                  <div v-for="level in 7" :key="level" class="sfia-definition">
                    <label>SFIA Level {{ level }} Definition</label>
                    <textarea
                      v-model="
                        subSkill[
                          `sfia_${level}_definition` as keyof typeof subSkill
                        ]
                      "
                      class="textarea-field"
                      :placeholder="`SFIA Level ${level} Definition`"
                    ></textarea>
                  </div>
                </div>

                <!-- Questions Section -->
                <div class="section questions-section">
                  <h5>Questions</h5>
                  <div class="questions-container">
                    <!-- In the template, update the getQuestionsForSubSkill call -->
                    <div
                      v-for="(question, qIndex) in getQuestionsForSubSkill(
                        subSkill.temp_id,
                      )"
                      :key="question.temp_id"
                      class="question"
                    >
                      <div class="section-header">
                        <select
                          v-model="question.question_type"
                          class="select-field"
                        >
                          <option value="theory">Theory</option>
                          <option value="practical">Practical</option>
                        </select>
                        <button
                          @click="deleteQuestion(subIndex, qIndex)"
                          class="delete-button"
                        >
                          Delete Question
                        </button>
                      </div>

                      <div class="input-group">
                        <textarea
                          v-model="question.question_text"
                          class="textarea-field"
                          placeholder="Question text"
                        ></textarea>
                        <textarea
                          v-model="question.correct_answer"
                          class="textarea-field"
                          placeholder="Correct answer"
                        ></textarea>
                        <textarea
                          v-model="question.explanation"
                          class="textarea-field"
                          placeholder="Explanation (optional)"
                        ></textarea>
                        <select
                          v-model="question.sfia_level"
                          class="select-field"
                        >
                          <option v-for="n in 7" :key="n" :value="n">
                            SFIA Level {{ n }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <button @click="addQuestion(subIndex)" class="add-button">
                      Add Question
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button @click="addSubSkill(skillIndex + 1)" class="add-button">
              Add Sub-skill
            </button>
          </div>
        </div>
      </div>

      <div class="actions-group">
        <button @click="addSkill" class="add-button">Add Skill</button>
        <button @click="saveDraft" class="save-button">Save Draft</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topic-draft-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.topic-draft {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.9);
}

h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

h4 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

h5 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-field,
.textarea-field,
.select-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  transition: all 0.3s ease;
}

.input-field:focus,
.textarea-field:focus,
.select-field:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.textarea-field {
  min-height: 100px;
  resize: vertical;
}

.sfia-definitions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.sfia-definition {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 8px;
}

.sfia-definition label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.button {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-button {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

.add-button:hover {
  background: rgba(59, 130, 246, 0.3);
}

.delete-button {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.delete-button:hover {
  background: rgba(239, 68, 68, 0.3);
}

.save-button {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.save-button:hover {
  background: rgba(34, 197, 94, 0.3);
}

.actions-group {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.sub-skills-container,
.questions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-skill,
.question {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 16px;
}

@media (max-width: 768px) {
  .sfia-definitions {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 8px;
  }

  .actions-group {
    flex-direction: column;
  }
}
</style>
