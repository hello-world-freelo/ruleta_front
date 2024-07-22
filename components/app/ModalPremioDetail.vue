<template>
  <div class="center">
    <vs-dialog class="custom-dialog" overflow-hidden :value="showModal" @close="closeModal">
      <template #header>
        <h4 class="mb-8">{{ isRegister ? 'Crear Cantidad Premio' : 'Editar cantidad Premio' }}</h4>
      </template>

      <template v-if="!isLoading">
        <div class="mb-10" :class="{ 'form-group--error': $v.form.event.$error }">
          <vs-select
            :disabled="!gamesDetail.length"
            :filter="false"
            block
            placeholder="Selecciona Detalle Juego"
            label="Detalle Juego"
            :state="String(form.event)"
            v-model="form.event"
          >
            <vs-option v-for="(event, i) in gamesDetail" :key="i" :label="event.evento" :value="String(event.idDetalleJ)" :disabled="event.isValidEvento === 0">
              {{ event.evento }}
            </vs-option>
          </vs-select>
        </div>
        <div class="mb-10" :class="{ 'form-group--error': $v.form.idPremio.$error }">
          <vs-select
            :disabled="!premios.length"
            block
            label="Premio"
            placeholder="Selecciona Premio"
            v-model="form.idPremio"
          >
            <vs-option v-for="(item, i) in premios" :key="i" :label="item.nombre" :value="String(item.idPremio)">
              {{ item.nombre }}
            </vs-option>
          </vs-select>
        </div>
        <div class="mb-8" :class="{ 'form-group--error': $v.form.quantity.$error }">
        <vs-input
        type="number" block
        v-model="form.quantity"
        label="Cantidad">
          <!-- <template #icon> @ </template> -->
        </vs-input>
      </div>
      </template>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="checkStructure" block> Guardar </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
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
      isLoading: true,
      services: {
        create_premio_detail: "/eventos/create-detalle-premio",
        update_premio_detail: "/eventos/update-detalle-premio/"
      },
      form: {
        event: "",
        idPremio: "",
        quantity: ""
      }
    }
  },
  validations: {
    form: {
      event: {
        required
      },
      idPremio: {
        required
      },
      quantity: {
        required
      }
    }
  },
  computed: {
    ...mapGetters(['getIdUser']),
    isRegister() {
      return this.item === null
    },
    // events() {
    //   return this.$store.getters['event/events']
    // },
    premios() {
      return this.$store.getters['premio/premios']
    },
    gamesDetail() {
      return this.$store.getters['gameDetail/gamesDetail']
    }

  },
  mounted() {
    this.asynLoadData()
  },
  methods: {

    async asynLoadData() {
      await Promise.all([
        // this.$store.dispatch('event/initialize'),
        this.$store.dispatch('premio/initialize'),
        this.$store.dispatch('gameDetail/initialize'),
        this.typeRequestEvaluation(),
      ])
      .then(() => this.isLoading = false)
    },

    async typeRequestEvaluation() {
      if (!this.isRegister) {
        const { idDetalleJ, idPremio, cantidad } = this.item
        this.form.event = idDetalleJ
        this.form.idPremio = idPremio
        this.form.quantity = cantidad
      }
    },

    checkStructure() {

      this.$v.form.$touch()

      if (this.$v.form.$invalid) return

      const payload = {
        "idDetalleJ": this.form.event,
        "idPremio": this.form.idPremio,
        "cantidad": this.form.quantity,
        "idUsuario": this.getIdUser
      }

      this.onSubmit(payload)
    },

    onSubmit(payload) {

      const url = (this.isRegister ? this.services.create_premio_detail : this.services.update_premio_detail + this.item.idPremioDetalleJuego)
      const method = this.isRegister ? "post" : "put"

      protectedService({
        method,
        url,
        data: payload
      }).then(resp => {
        const res = resp.data;
        if(!res.error){
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
        }else{
          this.$swal.fire({
          html: `<img class="small_icon" src="${require("@/static/icon_warning.svg")}"><p class="popup-content-text">
            ${res.msg}
          </p>`,
          customClass: {
            popup: "popup-giveaways",
            confirmButton: "popup-btn-confirm",
          },
          confirmButtonText: "Aceptar",
        })
        }

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
