<template>
  <div class="center">
    <vs-dialog class="custom-dialog" overflow-hidden :value="showModal" @close="closeModal">
      <template #header>
        <h4 class="mb-8">{{ isRegister ? 'Crear evento' : 'Editar evento' }}</h4>
      </template>

      <div class="mb-8">
        <vs-input block v-model="form.name" label="Nombre">
          <!-- <template #icon> @ </template> -->
        </vs-input>
        <!-- <br> -->
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button :disabled="$v.form.$invalid" @click.prevent="checkStructure" block> Guardar </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { protectedService } from "@/plugins/axios"
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  props: {
    showModal: {
      type: Boolean,
      default: true
    },
    item: {
			required: true
		},
  },
  data() {
    return {
      services: {
        create_event: "/eventos/create-evento",
        update_event: "/eventos/update-evento/"
      },
      form: {
        name: ""
      }
    }
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(2)
      }
    }
  },
  computed: {
    ...mapGetters(['getIdUser']),
    isRegister() {
      return this.item === null
    }
  },
  mounted() {
    this.typeRequestEvaluation()
  },
  methods: {

    async typeRequestEvaluation() {
      if (!this.isRegister) {
        const { nombre } = this.item
        this.form.name = nombre
      }
    },

    checkStructure() {

      this.$v.form.$touch()

      if (this.$v.form.$invalid) return

      const payload = {
        idUsuario: this.getIdUser,
        nombre: this.form.name,
      }

      this.onSubmit(payload)
    },

    onSubmit(payload) {

      const url = (this.isRegister ? this.services.create_event : this.services.update_event + this.item.idEvento)
      const method = this.isRegister ? "post" : "put"

      protectedService({
        method,
        url,
        data: payload
      }).then(resp => {
        const res = resp.data
        this.$swal.fire({
          html: `<img class="small_icon" src="${require("@/static/icon_circle-check-solid.svg")}"><p class="popup-content-text">
            ${res.msg}
          </p>`,
          customClass: {
            popup: "popup-giveaways",
            confirmButton: "popup-btn-confirm",
          },
          confirmButtonText: "Aceptar",
        })
        this.closeModal(true)
      })
      .catch(() => {
        console.error('Ocurrio un error con el servicio.')
      })
    },

    closeModal(reload = false) {
      this.$emit('closeModal', reload)
    }
  }
}
</script>
<style lang="scss" scoped>
.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);
}

.footer-dialog .new {
  margin: 0px;
  margin-top: 20px;
  padding: 0px;
  font-size: 0.7rem;
}

.footer-dialog .new a {
  color: rgba(var(--vs-primary), 1) !important;
  margin-left: 6px;
}

.footer-dialog .new a:hover {
  text-decoration: underline;
}

.footer-dialog .vs-button {
  margin: 0px;
}

</style>
