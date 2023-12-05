<template>
  <div>
    <div class="my-6 text-center">
      <!-- <i class="text-4xl fa-regular fa-user-magnifying-glass"></i> -->
      <img src="~assets/img/logo_full.jpeg" alt="Logo" class="mx-auto w-40	" />
    </div>
    <h4 class="mb-4 text-lg text-center">
      Consulta si estas apto para el <br />
      sorteo 2023
    </h4>
    <form action="#">
      <div class="mb-4" :class="{ 'form-group--error': $v.form.code.$error }">
        <label class="text-sm">Codigo del Participante</label>
        <vs-input type="number" block class="w-full" v-model="form.code" placeholder="">
          <!-- <template #icon>
              <i class='bx bx-user'></i>
            </template> -->
        </vs-input>
      </div>

      <div class="mb-6" :class="{ 'form-group--error': $v.form.document.$error }">
        <label class="text-sm">DNI</label>
        <vs-input type="number" block class="mb-4" v-model="form.document" placeholder="">
          <!-- <template #icon>
                <i class='bx bx-lock-open-alt'></i>
              </template> -->
        </vs-input>
      </div>

      <vs-button size="large" block @click.prevent="onConsult">
        <i class="bx bxs-paint-roll"></i> Consultar
      </vs-button>
    </form>

    <!-- END -->
    <vs-dialog width="320px" not-center2 not-close v-model="showDialog">
      <template #header>
        <h4 class="pt-4 text-center">
          <i class="text-4xl fa-solid fa-circle-check"></i>
        </h4>
      </template>

      <div class="con-content">
        <p class="text-center text-sm">
          <!-- Si estas apto para el sorteo 2023 -->
          {{ msg }} 2023
        </p>
      </div>

      <template #footer>
        <div class="flex justify-center text-center">
          <vs-button @click="showDialog = false" transparent> Ok </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>
<script>
import { publicService } from "@/plugins/axios"
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default {
  data() {
    return {
      showDialog: false,
      form: {
        code: "",
        document: ""
      },
      msg: null
    };
  },
  validations: {
    form: {
      code: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(10)
      },
      document: {
        required,
        minLength: minLength(8),
        maxLength: maxLength(8)
      }
    }
  },
  methods: {
    onConsult() {
      // this.showDialog = true
      this.$v.form.$touch()
      if (this.$v.$invalid) return

      const {
        code,
        document
      } = this.form

      const url = `/eventos/search-participante/${code}/${document}`

      publicService.get(url).then(resp => {
        const data = resp.data
        if(data.data != null) {
          const html =  `<img class="small_icon" src="${require("@/static/icon_circle-check-solid.svg")}"/>
            <p style="font-weight: 700; margin: 10px 0px; color: #3D3D67; font-size: 12px;">
              <span style="font-weight:normal;display:block;margin-bottom:10px;font-size:12px">
                ¡Hola ${data.data[0].nombres}
              </span>
              <span style="font-weight:normal;display:block;font-size:12px">
                Estás oficialmente en el Sorteo 2023 con el código <b>${data.data[0].codigo}</b>. <br> ¡Buena suerte!
              </span>
            </p>`
          this.$swal.fire({
            html,
            customClass: {
              popup: "popup-giveaways",
              confirmButton: "popup-btn-confirm",
            },
            confirmButtonText: "Entendido",
          })
        } else {
          this.$swal({
            html:
              `<img class="small_icon" src="${require("@/static/icon_warning.svg")}">
              <p class="popup-content-text">${data.msg}</p>`,
            customClass: {
              popup: "popup-giveaways",
              confirmButton: "popup-btn-confirm",
              cancelButton: "popup-btn-cancel",
            },
            showCancelButton: false,
            showConfirmButton: false,
          })
        }
      })
      .catch((err) => {
        console.log("err", err);
        console.error('Ocurrio un error con el servicio.')
      })
      .finally(() => this.resetForm())
    },
    resetForm() {
      this.form = {
        code: "",
        document: ""
      }
      this.$v.$reset()
    }
  }
};
</script>
