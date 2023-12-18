<template>
  <div class="grid md:grid-cols-2 grid-cols-1  bg-red min-h-screen">
    <div class="h-full hidden md:block">
      <div class="bg-cover bg-center bg-no-repeat h-full"></div>
    </div>
    <div class="flex justify-center items-center p-6">
      <div class="w-96">
        <FormConsult></FormConsult>
      </div>
    </div>
  </div>
</template>

<script>
import FormConsult from "@/components/app/FormConsult"
export default {
  name: 'IndexPage',
  components: {
    FormConsult
  }
}
</script>
<style lang="scss" scoped>
.bg-cover {
  background-image: url('~assets/img/fondo_login.png')
}
</style>
