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

<script setup lang="ts">
import { ref, } from 'vue';
import { useGameSettingsStore } from '@/stores/game_settings'
import SpinnerBackdrop from '@/components/SpinnerBackdrop.vue';
import GenericDialog from '@/components/dialogs/GenericDialog.vue';
import ErrorDialog from '@/components/dialogs/ErrorDialog.vue';

const saving = ref(false);
const restoring = ref(false);

const settingStore = useGameSettingsStore();

const showSaveParamDialog = ref(false);
const showReloadParamDialog = ref(false);

const showError = ref(false);
const errorText = ref("");

function clickSaveSettings() {
    showSaveParamDialog.value = true;
}

function clickReloadSettings() {
    showReloadParamDialog.value = true;
}

async function saveSettings() {
    try {
        saving.value = true;
        await settingStore.saveSettingsToNVS();
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
        await settingStore.reloadSettingsFromNVS();
    } catch (error) {
        console.error('Error reloading settings:', error);
        errorText.value = "Error reloading settings: " + (error instanceof Error ? error.message : 'Unknown error');
    } finally {
        restoring.value = false;
    }
}

</script>