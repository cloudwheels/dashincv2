<template>
  <div class="w3-col w3-container w3-margin-top">
    <p>{{ profile.email }}</p>
  </div>
</template>
<script>
export default {
  props: ['profile'],
}
</script>
