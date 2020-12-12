<template>
  <h1>大家好</h1>
  <button @click="add()">戳我</button>
  <span>count is: {{ double }}</span>
</template>

<script>
import {ref, computed} from 'vue';
export default {
  setup() {
    function add() {
      count.value++;
    }

    const count = ref(0);
    const double = computed(() => count.value * 2);
    return {count, add, double};
  }
}
</script>
