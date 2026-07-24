 
 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, computed, type Ref } from 'vue';
import { CHECKLISTS, DEFAULT_CHECKLIST } from '~~/shared/constants';

export function usePeripheralChecklist(formData: Ref<any>) {
  const checklistState = ref({
    peripherals: {} as Record<string, boolean>,
    partners: {} as Record<string, boolean>,
    manual: {} as Record<string, boolean>,
  });

  const currentChecklistKey = computed(() => {
    let key = (formData as any).value.board;
    if ((formData as any).value.deviceType) {
      key += ` ${(formData as any).value.deviceType}`;
    }
    return key;
  });

  const currentChecklist = computed(() => {
    return (
      (CHECKLISTS as any)[currentChecklistKey.value] ||
      (CHECKLISTS as any)[(formData as any).value.board] ||
      DEFAULT_CHECKLIST
    );
  });

  const resetChecklistState = () => {
    checklistState.value = { peripherals: {}, partners: {}, manual: {} };
  };

  return {
    checklistState,
    currentChecklistKey,
    currentChecklist,
    resetChecklistState
  };
}
