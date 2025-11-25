<template>
  <ContenField> 我的Bot </ContenField>
</template>

<script>
import ContenField from '@/components/ContentField.vue'
import $ from 'jquery'
import { useStore } from 'vuex'

export default {
  components: {
    ContenField
  },
  setup() {
    const store = useStore();
    $.ajax({
      url: "http://127.0.0.1:3000/user/bots/getlist/",
      type: "get",
      headers: {
        Authorization: "Bearer " + store.state.user.token,
      },
      success(resp) {
        console.log(resp);
      },
      error(resp) {
        console.log(resp);
      }
    })
  }
}
</script>

<style scoped>
</style>