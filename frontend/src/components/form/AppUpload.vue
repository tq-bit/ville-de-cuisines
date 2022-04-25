<script setup lang="ts">
import { AppUploadPayload } from '../../@types/commons';
import { ref } from 'vue';
import imgUpload from '../img/imgUpload.vue';

const over = ref<boolean>(false);
const fileData = ref<File>();
const fileBuffer = ref<ArrayBuffer>();

const emit = defineEmits<{
  (event: 'drop', payload: AppUploadPayload): void;
}>();

const onDragOver = (e: DragEvent) => (over.value = true);
const onDragLeave = (e: DragEvent) => (over.value = false);

const onDropItem = async (event: DragEvent) => {
  const items = event.dataTransfer?.items;
  const file = items ? items[0].getAsFile() : null;
  setFileData(file);
  await setFileBuffer(file);
  over.value = false;
  emit('drop', {
    fileData: fileData.value,
    fileBuffer: fileBuffer.value,
  } as AppUploadPayload);
};

const onChangeItem = async (event: Event) => {
  const items = (event.target as HTMLInputElement).files;
  const file = items ? items[0] : null;
  setFileData(file);
  await setFileBuffer(file);
  emit('drop', {
    fileData: fileData.value,
    fileBuffer: fileBuffer.value,
  } as AppUploadPayload);
};

const setFileData = (file: File | null) => {
  if (!!file) {
    fileData.value = file;
  }
};

const setFileBuffer = (file: File | null): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!!file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = (event) => {
        fileBuffer.value = (event?.target?.result as ArrayBuffer) || null;
        resolve();
      };
    }
  });
};
</script>

<template>
  <div
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDropItem"
    class="shadow rounded m-auto h-full w-full"
    :class="{ 'animate-pulse': over }"
  >
    <!-- Upload dropdown section -->
    <div
      id="header"
      class="text-center p-12 rounded text-gray-800 dark:text-gray-200 bg-gray-100 focus:bg-white dark:bg-gray-800 focus:dark:bg-gray-900 border border-green-600 transition-all outline-none"
    >
      <section class="text-xl">
        <label
          for="fileupload"
          class="items-center block cursor-pointer transition-all"
          ><img-upload></img-upload>Upload a file</label
        >
        <input
          id="fileupload"
          class="hidden"
          type="file"
          name="fileupload"
          @change="onChangeItem"
        />
      </section>
    </div>
  </div>
</template>
