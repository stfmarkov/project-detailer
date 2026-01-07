<script setup lang="ts">

const emit = defineEmits<{
    (e: 'clearFile', id?: string): void
}>()

const props = defineProps<{
    file: {
        name: string
        size?: number
        id?: string
    }
}>()

const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const clearFile = (id?: string) => {
    emit('clearFile', id)
}
</script>

<template>
    <div class="file-preview">
        <div class="file-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        </div>
        <div class="file-info">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size" v-if="file.size">{{ formatFileSize(file.size) }}</span>
        </div>
        <button class="clear-button" @click="clearFile(file.id)" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.file-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    border-style: solid;
    border-color: rgba(46, 213, 115, 0.4);
    background: rgba(46, 213, 115, 0.05);
    padding: 1.5rem;
    cursor: default;
    border-radius: 8px;
    border-width: 2px;
}

.file-icon {
    color: #2ed573;
    flex-shrink: 0;
}

.file-info {
    flex: 1;
    text-align: left;
    min-width: 0;
}

.file-name {
    display: block;
    color: #e0e0e0;
    font-weight: 500;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.file-size {
    display: block;
    color: #707080;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}

.clear-button {
    background: rgba(255, 71, 87, 0.15);
    border: 1px solid rgba(255, 71, 87, 0.3);
    color: #ff4757;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.clear-button:hover {
    background: rgba(255, 71, 87, 0.25);
}
</style>