<template>
    <SpinnerBackdrop v-if="saving" text="Saving..." />
    <SpinnerBackdrop v-if="restoring" text="Restoring..." />

    <GenericDialog title="Attenzione" titleClass="text-bg-warning" title-icon="bi-exclamation-triangle-fill"
        v-model:is-open="showReloadParamDialog" :buttons="[
            { text: 'Annulla', class: 'btn-secondary' },
            {
                text: 'Continua', class: 'btn-warning', callback: async () => {
                    await reloadSettings();
                }
            }
        ]">
        Tutte le modifiche non salvate verranno sovrascritte.
        Sei sicuro di voler continuare?
    </GenericDialog>

    <GenericDialog title="Salvataggio" title-icon="floppy" v-model:is-open="showSaveParamDialog" :buttons="[
        { text: 'Annulla', class: 'btn-secondary' },
        {
            text: 'Salva', class: 'btn-primary', callback: async () => {
                await saveSettings();
            }
        }
    ]">
        I valori attuali dei parametri verranno salvati, non sarà possibile tornare ai valori precedenti.
        Sei sicuro di voler continuare?
    </GenericDialog>

    <ErrorDialog :title="'Error'" :message="errorText" v-model:isOpen="showError" />

    <div class="modal fade show" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Modal body text goes here.</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="settingStore.groupsLoading"
        class="h-100 w-100 d-flex flex-column justify-content-center align-items-center">
        <h3>Loading...</h3>
        <div class="spinner-border mt-2" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="settingStore.groupsLoadingError" class="container-md">
        <div class="alert alert-danger d-flex align-items-center mt-4" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
                {{ settingStore.groupsLoadingError }}
            </div>
        </div>
    </div>

    <PageScrollableLayout v-else>
        <template v-slot:header>
            <div class="bg-light py-3">
                <div class="container-md text-center">
                    <div class="row justify-content-center">
                        <div class="col col-md-3">
                            <button type="button" class="btn btn-secondary w-100" @click="clickSaveSettings">
                                <i class="bi bi-floppy me-2"></i> Save
                            </button>
                        </div>
                        <div class="col col-md-3">
                            <button type="button" class="btn btn-warning w-100" @click="clickReloadSettings">
                                <i class="bi bi-arrow-clockwise me-2"></i> Reload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div class="container-md my-3">
            <div class="list-group">
                <router-link v-for="group in settingStore.groups" :to="'/settings/' + group.name" :key="group.name"
                    class="list-group-item list-group-item-action">
                    {{ group.title }}
                    <i class="bi bi-chevron-right float-end"></i>
                </router-link>
            </div>
        </div>
    </PageScrollableLayout>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import api from '@/api/api';
import { useGameSettingsStore } from '@/stores/game_settings'
import PageScrollableLayout from '@/components/PageScrollableLayout.vue'
import SpinnerBackdrop from '@/components/SpinnerBackdrop.vue';
import GenericDialog from '@/components/dialogs/GenericDialog.vue';
import ErrorDialog from '@/components/dialogs/ErrorDialog.vue';

const settingStore = useGameSettingsStore();
const saving = ref(false);
const restoring = ref(false);

const showSaveParamDialog = ref(false);
const showReloadParamDialog = ref(false);

const showError = ref(false);
const errorText = ref("");

onBeforeMount(() => {
    if (settingStore.groups == null || settingStore.groups.length == 0)
        settingStore.fetchGameSettingsList();
});

function clickSaveSettings() {
    showSaveParamDialog.value = true;
}

function clickReloadSettings() {
    showReloadParamDialog.value = true;
}

async function saveSettings() {
    try {
        saving.value = true;
        await api.get('/settings/storetonvs')
    } catch (error) {
        console.error('Error saving settings:', error);
        errorText.value = "Error saving settings: " + (error instanceof Error ? error.message : 'Unknown error');
        showError.value = true;
    } finally {
        saving.value = false;
    }
}

async function reloadSettings() {
    try {
        restoring.value = true;
        await api.get('/settings/restorefromnvs');
    } catch (error) {
        console.error('Error reloading settings:', error);
        errorText.value = "Error reloading settings: " + (error instanceof Error ? error.message : 'Unknown error');
    } finally {
        restoring.value = false;
    }
}

</script>

<style scoped></style>