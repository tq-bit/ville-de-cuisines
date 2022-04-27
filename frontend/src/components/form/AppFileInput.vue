<script setup lang="ts">
import { AppUploadPayload } from '../../@types/commons';
import { ref } from 'vue';
import imgUpload from '../img/imgUpload.vue';

const over = ref<boolean>(false);
const fileData = ref<File>();
const fileBuffer = ref<ArrayBuffer>();
const fileUrl = ref<string>();

withDefaults(
  defineProps<{
    hideLabel?: boolean;
    labelPrefix?: string;
    label?: string;
  }>(),
  {
    hideLabel: false,
  },
);

const emit = defineEmits<{
  (event: 'drop', payload: AppUploadPayload): void;
}>();

const onDragOver = () => (over.value = true);
const onDragLeave = () => (over.value = false);

const onChangeItem = async (event: Event) => {
  const file = getItemFromEvent(event);
  setFileData(file);
  setFileUrl(file);
  await setFileBuffer(file);
  emit('drop', {
    fileData: fileData.value,
    fileUrl: fileUrl.value,
    fileBuffer: fileBuffer.value,
  } as AppUploadPayload);
  onDragLeave();
};

const getItemFromEvent = (event: Event | DragEvent): File | null => {
  if (event.type === 'drop') {
    const items = (event as DragEvent).dataTransfer?.items;
    return items ? items[0].getAsFile() : null;
  }
  const items = (event.target as HTMLInputElement).files;
  return items ? items[0] : null;
};

const setFileData = (file: File | null) => {
  if (!!file) {
    fileData.value = file;
  }
};

const setFileUrl = (file: File | null) => {
  if (!!file) {
    const blobUrl = URL.createObjectURL(file);
    fileUrl.value = blobUrl;
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
    } else {
      reject('No file input detected');
    }
  });
};
</script>

<template>
  <div
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onChangeItem"
    class="shadow rounded m-auto h-auto w-full"
    :class="{ 'animate-pulse': over }"
  >
    <!-- Upload dropdown section -->
    <label
      v-if="label && !hideLabel"
      class="font-semibold block mb-1 text-green-600"
    >
      {{ label }}
    </label>
    <div
      class="text-center p-4 rounded text-gray-800 dark:text-gray-200 bg-gray-100 focus:bg-white dark:bg-gray-800 focus:dark:bg-gray-900 border border-green-600 transition-all outline-none"
    >
      <section class="text-xl">
        <label
          for="fileupload"
          class="items-center block cursor-pointer transition-all"
        >
          <span v-if="!fileData">
            <img-upload></img-upload>Drop a file or browse</span
          >
          <span v-else>
            <img
              class="rounded mx-auto w-auto max-h-72 mb-2"
              :src="fileUrl"
              :alt="fileData.name"
            />
            {{ fileData.name }}
          </span>
        </label>
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
