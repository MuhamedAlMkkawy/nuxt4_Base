<template>
  <div class="upload-wrapper">
    <label v-if="label" class="upload-label">
      {{ label }}
      <span v-if="required" class="text-[#B42318]">*</span>
    </label>

    <div
      :class="uploadAreaClasses"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        class="hidden"
        @change="handleFileChange"
      />

      <div v-if="!files.length || !showFileList" class="upload-placeholder">
        <SvgIcon name="upload" classes="w-6 h-6 mb-6" />
        <p class="mt-1 text-[16px] font-[500] text-[#1F2A37]">
          {{ placeholder || t("common.uploadFile") }}
        </p>
        <p class="mt-2 text-[12px] text-[#384250] md:max-w-[75%] max-w-[90%] leading-5" v-if="placeholderHint">
          {{ placeholderHint }}
        </p>
        <p class="font-[500] text-[14px] text-[#161616] mt-5">
          {{ t("common.browseFiles") }}
        </p>
      </div>

      <div v-if="files.length && showFileList" class="upload-files">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="upload-file-item"
        >
          <div
            v-if="isImage(file)"
            class="w-8 h-8 flex-shrink-0 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden"
          >
            <a
              :href="getFilePreview(file)"
              target="_blank"
              class="w-full h-full"
            >
              <img
                :src="getFilePreview(file)"
                class="w-full h-full object-contain"
              />
            </a>
          </div>
          <Icon v-else name="document" size="sm" class="text-[#0E5F4A]" />

          <span class="upload-file-name">{{ file.name }}</span>
          <button
            type="button"
            @click.stop="removeFile(index)"
            class="upload-remove-btn cursor-pointer"
          >
            <Icon name="xMark" size="sm" />
          </button>
        </div>
      </div>
    </div>

    <p v-if="error" class="upload-error">
      {{ error }}
    </p>
    <p v-if="hint && !error" class="upload-hint">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import Icon from "./Icon.vue";
import SvgIcon from "./SvgIcon.vue";

const props = defineProps({
  modelValue: {
    type: [File, Array],
    default: null,
  },
  accept: {
    type: String,
    default: "",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
  hint: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
  placeholderHint: {
    type: String,
    default: "",
  },
  maxSize: {
    type: Number,
    default: null,
  },
  showFileList: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "change", "error"]);

const { t } = useI18n();

const fileInput = ref(null);
const isDragging = ref(false);
const files = ref([]);

// Initialize files from modelValue
if (props.modelValue) {
  if (props.multiple && Array.isArray(props.modelValue)) {
    files.value = props.modelValue;
  } else if (
    !props.multiple &&
    props.modelValue &&
    typeof props.modelValue === "object" &&
    "name" in props.modelValue
  ) {
    files.value = [props.modelValue];
  }
}

watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      files.value = [];
      if (fileInput.value) fileInput.value.value = "";
    } else if (newVal && files.value.length === 0) {
      // Only update if files is empty to avoid circular updates
      if (props.multiple && Array.isArray(newVal)) {
        files.value = newVal;
      } else if (
        !props.multiple &&
        newVal &&
        typeof newVal === "object" &&
        "name" in newVal
      ) {
        files.value = [newVal];
      }
    }
  },
);

const uploadAreaClasses = computed(() => {
  const baseClasses =
    "w-full border-2 border-dashed border-[#D2D6DB] rounded-lg p-6 transition-all duration-200 cursor-pointer";

  const stateClasses = props.error
    ? "border-red-500 bg-red-50"
    : isDragging.value
      ? "border-[#0E5F4A] bg-[#0E5F4A]/5"
      : "border-gray-300 bg-[#F3F4F6] hover:border-[#0E5F4A] hover:bg-[#0E5F4A]/5";

  const disabledClass = props.disabled ? "opacity-50 cursor-not-allowed" : "";

  return [baseClasses, stateClasses, disabledClass].filter(Boolean).join(" ");
});

const triggerFileInput = () => {
  if (!props.disabled && fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files || []);
  processFiles(selectedFiles);
};

const handleDrop = (event) => {
  isDragging.value = false;
  if (props.disabled) return;

  const droppedFiles = Array.from(event.dataTransfer.files || []);
  processFiles(droppedFiles);
};

const processFiles = (selectedFiles) => {
  if (!selectedFiles.length) return;

  const validFiles = [];

  for (const file of selectedFiles) {
    if (props.maxSize && file.size > props.maxSize) {
      emit(
        "error",
        t("common.fileTooLarge", { maxSize: formatFileSize(props.maxSize) }),
      );
      continue;
    }
    validFiles.push(file);
  }

  if (props.multiple) {
    files.value = [...files.value, ...validFiles];
    emit("update:modelValue", files.value);
  } else {
    files.value = validFiles.slice(0, 1);
    emit("update:modelValue", files.value[0] || null);
  }

  emit("change", props.multiple ? files.value : files.value[0] || null);
};

const removeFile = (index) => {
  files.value.splice(index, 1);
  if (props.multiple) {
    emit("update:modelValue", files.value);
  } else {
    emit("update:modelValue", null);
    if (fileInput.value) {
      fileInput.value.value = "";
    }
  }
  emit("change", props.multiple ? files.value : null);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const isImage = (file) => {
  return file.type?.startsWith("image/");
};

const previews = ref({});

const getFilePreview = (file) => {
  if (!isImage(file)) return null;
  if (previews.value[file.name]) return previews.value[file.name];
  const url = URL.createObjectURL(file);
  previews.value[file.name] = url;
  return url;
};

// Clean up object URLs when component is unmounted or files changed
import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  Object.values(previews.value).forEach((url) => URL.revokeObjectURL(url));
});
</script>

<style scoped>
@reference {
  @import "tailwindcss";
}

.upload-wrapper {
  @apply w-full;
}

.upload-label {
  @apply block text-sm font-medium text-[#384250] mb-1.5;
}

.upload-placeholder {
  @apply flex flex-col items-center justify-center text-center;
}

.upload-files {
  @apply space-y-2;
}

.upload-file-item {
  @apply flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200;
}

.upload-file-name {
  @apply flex-1 text-sm text-[#384250] truncate;
}

.upload-remove-btn {
  @apply p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors;
}

.upload-error {
  @apply mt-1 text-xs font-medium text-red-500;
}

.upload-hint {
  @apply mt-1 text-xs text-gray-400;
}
</style>
