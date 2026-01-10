<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const router = useRouter()

const form = reactive({
  title: '',
  category: ''
})

const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Predefined categories for quick selection
const categories = [
  { value: 'software', label: '💻 Software', description: 'Apps, APIs, tools' },
  { value: 'book', label: '📖 Book', description: 'Novels, stories, scripts' },
  { value: 'game', label: '🎮 Game', description: 'Video games, board games' },
  { value: 'research', label: '🔬 Research', description: 'Studies, papers, analysis' },
  { value: 'business', label: '💼 Business', description: 'Products, services, plans' },
  { value: 'other', label: '📁 Other', description: 'Everything else' }
]

const selectedCategory = ref<string | null>(null)

function selectCategory(value: string) {
  selectedCategory.value = value
  form.category = value
}

async function handleSubmit() {
  if (!form.title.trim() || !form.category.trim()) {
    error.value = 'Please fill in all fields'
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    const project = await $fetch('/api/createProject', {
      method: 'POST',
      body: {
        title: form.title,
        category: form.category
      }
    })

    // Navigate to the new project's add context page
    router.push(`/?projectId=${project._id}`)
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Failed to create project'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <ProjectHeader title="New Project" subtitle="Create a new knowledge base" />

  <div class="new-project-page">
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Project Title -->
      <div class="field">
        <label for="title">Project Name</label>
        <input id="title" v-model="form.title" type="text" placeholder="e.g., My Novel, App v2.0, Game Design Doc"
          :disabled="isSubmitting" autofocus />
      </div>

      <!-- Category Selection -->
      <div class="field">
        <label>Category</label>
        <div class="category-grid">
          <Card v-for="cat in categories" :key="cat.value" type="button"
            :class="[{ selected: selectedCategory === cat.value }]" @click="selectCategory(cat.value)"
            :disabled="isSubmitting" as="button">
            <span class="category-icon">{{ cat.label.split(' ')[0] }}</span>
            <span class="category-label">{{ cat.label.split(' ').slice(1).join(' ') }}</span>
            <span class="category-desc">{{ cat.description }}</span>
          </Card>
        </div>
      </div>

      <!-- Custom Category Input (shown if 'other' selected) -->
      <div v-if="selectedCategory === 'other'" class="field">
        <label for="customCategory">Custom Category</label>
        <input id="customCategory" v-model="form.category" type="text" placeholder="Enter your category..."
          :disabled="isSubmitting" />
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="button" class="cancel-btn" @click="router.push('/')" :disabled="isSubmitting">
          Cancel
        </button>
        <button type="submit" class="submit-btn" :disabled="isSubmitting || !form.title || !form.category">
          <span v-if="isSubmitting">Creating...</span>
          <span v-else>Create Project</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.new-project-page {
  max-width: 600px;
  margin: 0 auto;
}

.form {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
}

.field {
  margin-bottom: 1.75rem;
}

.field label {
  display: block;
  color: #e0e0e0;
  font-weight: 500;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.field input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field input::placeholder {
  color: #606070;
}

.field input:focus {
  outline: none;
  border-color: #e94560;
  box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
}

.field input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Category Grid */
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.card {
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.card.selected {
  border-color: #e94560;
  background: rgba(233, 69, 96, 0.1);
}

.category-icon {
  font-size: 1.75rem;
}

.category-label {
  color: #e0e0e0;
  font-size: 0.9rem;
  font-weight: 500;
}

.category-desc {
  color: #707080;
  font-size: 0.75rem;
  text-align: center;
}

/* Error Message */
.error-message {
  padding: 0.875rem 1rem;
  background: rgba(255, 71, 87, 0.15);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 8px;
  color: #ff4757;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 0.875rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: #a0a0b0;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.3);
  color: #e0e0e0;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn {
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #e94560 0%, #c73e54 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(233, 69, 96, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 500px) {
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .submit-btn {
    width: 100%;
  }
}
</style>
