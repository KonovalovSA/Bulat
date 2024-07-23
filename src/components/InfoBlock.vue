<template>
    <div class="info">
      <h5>{{props.header}}</h5>
      <p v-for="paragraph in props.paragraph">{{ paragraph }}</p>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps({
        header: { type: String, required: true },
        paragraph: { type: Array, required: true },
    })
</script>

<style lang="scss" scope>
.info {
  margin: 20px 0;
  padding: 20px;
  text-align: left;
  width: 800px;
  border: 1px solid #4065d0;
  border-radius: 5px;
  color: rgba(60, 60, 67, 0.7803921569);
  background-color: #fbfcff;

  p {
    margin-bottom: 5px;
  }
  h5 {
    color: #4065d0;
  }
}
</style>