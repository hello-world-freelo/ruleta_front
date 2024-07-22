<template>
  <div class="center">
    <vs-dialog class="custom-dialog" prevent-close overflow-hidden :value="showModal" @close="closeModal">
      <template #header>
        <h4 class="mb-8">Registrar ganador</h4>
      </template>

      <div class="mb-8" :class="{ 'form-group--error': $v.form.date.$error }">
        <vs-input type="date" block v-model="form.date" label="Fecha de entrega del premio">
        </vs-input>
      </div>
      <div class="mb-6 flex flex-col text-area" :class="{ 'form-group--error': $v.form.comment.$error }">
        <label class="m-0 vs-input__label--label">Comentarios</label>
        <textarea class="vs-input area" v-model="form.comment"></textarea>
      </div>

      <div class="mb-1 flex justify-between	items-center" :class="{ 'form-group--error': $v.form.status.$error }">
        <label class="text-xs block ml-3">¿Se entrego el premio?</label>
        <div class="inline-block">
          <vs-switch v-model="form.status">
            <template #off> No </template>
            <template #on> Si </template>
          </vs-switch>
        </div>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button @click="checkStructure"> Guardar </vs-button>
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
      default: false
    },
    winner: {
      type: Object,
      default: () => ({})
    },
    isCreated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      services: {
        create_ganador: "/eventos/create-ganador",
        update_ganador: "/eventos/update-ganador"
      },
      form: {
        date: "",
        comment: "",
        status: false
      }
    }
  },
  validations: {
    form: {
      date: {
        required
      },
      comment: {
        required
      },
      status: {
        required
      }
    }
  },
  computed: {
    ...mapGetters(['getIdUser']),
  },
  methods: {
    checkStructure() {
      this.$v.form.$touch()

      if (this.$v.form.$invalid) return

      const {
        idParticipante,
        codigo,
        idDetalleJ,
        idEvento,
        idJuego,
        idPremio,
      } = this.winner

      const estadoEntrega = (this.form.status ? 2 : 1)

      const payload = {
        "idUsuario": this.getIdUser,
        "fecha": this.form.date,
        estadoEntrega,
        "comentario": this.form.comment,
        "sustento": this.form.comment,
        ...(this.isCreated && {
          idParticipante,
          codigo,
          idDetalleJ,
          idEvento,
          idJuego,
          idPremio,
        }),
        ...(!this.isCreated && {
          "flag": 1
        })
      }

      this.onSubmit(payload)
    },
    onSubmit(payload) {
      const url = this.isCreated ? this.services.create_ganador : `${this.services.update_ganador}/${this.winner.idGanador}/${this.winner.idParticipante}`
      const method =  this.isCreated ? "post" : "put"
      protectedService({
        method,
        url,
        data: payload
      }).then(async resp => {
        const res = resp.data
        await this.closeModal(true)
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
.text-area {
  label {
    line-height: 1;
    padding-left: 10px;
  }
  .area {
    width: 100%;
    border-radius: 12px;
    height: 100px;
  }
}
.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
}

.con-form {
  width: 100%;
}

.con-form .flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.con-form .flex a {
  font-size: 0.8rem;
  opacity: 0.7;
}

.con-form .flex a:hover {
  opacity: 1;
}

.con-form .vs-checkbox-label {
  font-size: 0.8rem;
}

.con-form .vs-input-content {
  margin: 10px 0px;
  width: calc(100%);
}

.con-form .vs-input {
  width: 100%;
}

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
