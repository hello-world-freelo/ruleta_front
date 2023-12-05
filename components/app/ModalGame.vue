<template>
  <div class="center">
    <vs-dialog class="custom-dialog" overflow-hidden :value="showModal" @close="closeModal">
      <template #header>
        <h4 class="mb-8">{{ isRegister ? 'Crear juego' : 'Editar juego' }}</h4>
      </template>

      <div class="mb-10">
        <vs-input block v-model="form.name" label="Nombre" :class="{ 'form-group--error': $v.form.name.$error }">
          <!-- <template #icon> @ </template> -->
        </vs-input>
      </div>
      <div class="mb-8">
        <vs-input block v-model="form.description" label="Descripción" :class="{ 'form-group--error': $v.form.description.$error }">
          <!-- <template #icon> @ </template> -->
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button :disabled="$v.form.$invalid" @click="checkStructure" block> Guardar </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { protectedService } from "@/plugins/axios"
import { required } from 'vuelidate/lib/validators'
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
        create_game: "/eventos/create-juego",
        update_game: "/eventos/update-juego/"
      },
      form: {
        name: "",
        description: ""
      }
    }
  },
  validations: {
    form: {
      name: {
        required
      },
      description: {
        required
      }
    }
  },
  computed: {
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
        const { nombre, descripcion } = this.item
        this.form.name = nombre
        this.form.description = descripcion
      }
    },

    checkStructure() {

      this.$v.form.$touch()

      if (this.$v.form.$invalid) return

      const payload = {
        nombre: this.form.name,
        descripcion: this.form.description,
      }

      this.onSubmit(payload)
    },

    onSubmit(payload) {

      const url = (this.isRegister ? this.services.create_game : this.services.update_game + this.item.idJuego)
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
    closeModal() {
      this.$emit('closeModal', true)
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
