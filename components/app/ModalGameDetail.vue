<template>
  <div class="center">
    <vs-dialog class="custom-dialog" overflow-hidden :value="showModal" @close="closeModal">
      <template #header>
        <h4 class="mb-8">{{ isRegister ? 'Crear detalle juego' : 'Editar detalle juego' }}</h4>
      </template>

      <template v-if="!isLoading">
        <div class="mb-10" :class="{ 'form-group--error': $v.form.event.$error }">
          <vs-select
            :disabled="!events.length"
            :filter="false"
            block
            placeholder="Selecciona evento"
            label="Evento"
            :state="String(form.event)"
            v-model="form.event"
          >
            <vs-option v-for="(event, i) in events" :key="i" :label="event.nombre" :value="String(event.idEvento)">
              {{ event.nombre }}
            </vs-option>
          </vs-select>
        </div>
        <div class="mb-10" :class="{ 'form-group--error': $v.form.game.$error }">
          <vs-select
            :disabled="!games.length"
            block
            label="Juego"
            placeholder="Selecciona juego"
            v-model="form.game"
          >
            <vs-option v-for="(game, i) in games" :key="i" :label="game.nombre" :value="String(game.idJuego)">
              {{ game.nombre }}
            </vs-option>
          </vs-select>
        </div>
        <div class="mb-10" :class="{ 'form-group--error': $v.form.start_date.$error }">
          <vs-input
            block
            type="date"
            v-model="form.start_date"
            label="Fecha inicio"
            />
        </div>
        <div class="mb-8" :class="{ 'form-group--error': $v.form.end_date.$error }">
          <vs-input
          block
          type="date"
          v-model="form.end_date"
          label="Fecha fin"
          />
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
        create_game_detail: "/eventos/create-detalle-juego",
        update_game_detail: "/eventos/update-detalle-juego/"
      },
      form: {
        event: "",
        game: "",
        start_date: "",
        end_date: ""
      }
    }
  },
  validations: {
    form: {
      event: {
        required
      },
      game: {
        required
      },
      start_date: {
        required
      },
      end_date: {
        required
      }
    }
  },
  computed: {
    ...mapGetters(['getIdUser']),
    isRegister() {
      return this.item === null
    },
    events() {
      return this.$store.getters['event/events']
    },
    games() {
      return this.$store.getters['game/games']
    }
  },
  mounted() {
    this.asynLoadData()
  },
  methods: {

    async asynLoadData() {
      await Promise.all([
        this.$store.dispatch('event/initialize'),
        this.$store.dispatch('game/initialize'),
        this.typeRequestEvaluation(),
      ])
      .then(() => this.isLoading = false)
    },

    async typeRequestEvaluation() {
      if (!this.isRegister) {
        const { idEvento, idJuego, fechaInicio, fechaFinal } = this.item
        this.form.event = idEvento
        this.form.game = idJuego
        this.form.start_date = fechaInicio
        this.form.end_date = fechaFinal
      }
    },

    checkStructure() {

      this.$v.form.$touch()

      if (this.$v.form.$invalid) return

      const payload = {
        "idEvento": this.form.event,
        "idJuego": this.form.game,
        "fechIni": this.form.start_date,
        "fechFin": this.form.end_date,
        "idUsuario": this.getIdUser
      }

      this.onSubmit(payload)
    },

    onSubmit(payload) {

      const url = (this.isRegister ? this.services.create_game_detail : this.services.update_game_detail + this.item.idDetalleJ)
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
