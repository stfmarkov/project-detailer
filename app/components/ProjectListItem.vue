<script setup lang="ts">
import type { IProjectListItem } from '../../server/models/Project'

const props = defineProps<{
    project: IProjectListItem
}>()
</script>

<template>
    <Card :key="project._id.toString()" :to="`/project-${project._id.toString()}`">
        <div class="project-icon">📋</div>
        <div class="project-info">
            <h3 class="project-title">{{ project.title }}</h3>
            <span class="project-category">{{ project.category }}</span>
        </div>
        <div class="project-arrow">→</div>
    </Card>
</template>

<style scoped>
.project-icon {
    font-size: 1.5rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(233, 69, 96, 0.1);
    border-radius: 10px;
}

.project-info {
    flex: 1;
    min-width: 0;
}

.project-title {
    color: #e0e0e0;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.25rem 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.project-category {
    color: #e94560;
    font-size: 0.85rem;
    background: rgba(233, 69, 96, 0.15);
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
}

.project-arrow {
    color: #606070;
    font-size: 1.2rem;
    transition: color 0.2s, transform 0.2s;
}
</style>