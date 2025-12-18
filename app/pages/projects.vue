<script setup lang="ts">

definePageMeta({
  layout: 'project'
})

const projects = ref([])

onMounted(async () => {
  projects.value = await $fetch('/api/projects')
})
</script>

<template>
    <ProjectHeader title="Projects" subtitle="Manage your projects" />
    <div class="projects">
        <div class="project" v-for="project in projects" :key="project._id">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
        </div>
    </div>
</template>