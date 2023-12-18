<template>
  <div class="grid md:grid-cols-2 grid-cols-1  bg-red min-h-screen">
    <div class="h-full hidden md:block">
      <div class="bg-cover bg-center bg-no-repeat h-full"></div>
    </div>
    <div class="flex justify-center items-center p-6">
      <div class="w-96">
        <img src="~assets/img/logo_full.jpeg" alt="Logo" class="mx-auto w-40	" />
        <h4 class="mb-4 text-xl text-center">Iniciar sesión</h4>
        <form action="#">
         <div class="mb-4" :class="{ 'form-group--error': $v.form.username.$error }">
          <label class="text-sm">Usuario</label>
          <vs-input block class="w-full" v-model.trim="$v.form.username.$model" placeholder="">
            <!-- <template #icon>
              <i class='bx bx-user'></i>
            </template> -->
          </vs-input>
         </div>

          <div class="mb-6" :class="{ 'form-group--error': $v.form.password.$error }">
            <label class="text-sm">Contraseña</label>
            <vs-input block type="password" class="mb-4" v-model.trim="$v.form.password.$model" placeholder="">
              <!-- <template #icon>
                <i class='bx bx-lock-open-alt'></i>
              </template> -->
            </vs-input>
          </div>

          <!-- <p class="mb-6 text-xs text-right">
            <a style="color: #344767;" href="#" class="text-primary text-gradient font-weight-bold underline">¿Olvidaste tu contraseña? </a>
          </p> -->
          
          <vs-button
          size="large"
          block
          @click.prevent="onSubmit"
          >
            <i class='bx bxs-paint-roll' ></i> Iniciar sesión
          </vs-button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex"
import { publicService } from "@/plugins/axios"
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    }
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(5)
      },
      password: {
        required,
        minLength: minLength(4)
      }
    }
  },
  methods: {

    ...mapActions(["initSessionMain"]),

    onSubmit() {

      this.$v.form.$touch()
      if (this.$v.$invalid) return

      const payload = {
        usuario: this.form.username,
        clave: this.form.password,
      }

      publicService.post('/eventos/login', payload).then(resp => {
        const { data: authData } = resp
        this.initSessionMain({token: authData.token}).then(() => this.$router.push('/app/sorteos'))
      })
      .catch(() => {
        console.error('Ocurrio un error con el servicio.')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bg-cover {
  background-image: url('~assets/img/fondo_login.png')
}
</style>
