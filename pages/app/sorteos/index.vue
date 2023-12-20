<template>
  <div>
    <h2 class="text-xl font-medium">Sorteos</h2>
    <template>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 my-6">
        <div class="w-full" v-if="gamesDetail.length">
          <vs-select :disabled="isLoading" :block="true" filter placeholder="Seleccionar evento" v-model="form.event" label="Seleccionar un evento">
            <vs-option v-for="(item, i) in gamesDetail" :key="i" :label="item.evento" :value="item.idEvento">
              {{ item.evento }}
            </vs-option>
          </vs-select>
        </div>
        <div class="w-full" v-if="awards.length">
          <vs-select :disabled="isLoading" :block="true" filter placeholder="Seleccionar premio a sortear" v-model="form.award" label="Seleccionar un premio">
            <vs-option v-for="(award, i) in awards" :key="i" :label="`${award.nombre} (${award.cantidad})`" :value="award.idPremio">
              {{ award.nombre }} ({{ award.cantidad }})
            </vs-option>
          </vs-select>
        </div>
      </div>

      <div class="win-wheel">
        <WinWheel
          :options="options"
          :disabledButtonPress="disabledButtonPress"
          @onButtonPress="onButtonPress"
          @onResult="onResult"
        ></WinWheel>
      </div>
      <h2 class="mb-2">Ganadores</h2>
      <!-- <pre>{{ winners }}</pre> -->
      <vs-table v-if="filteredWinners" :key="keyRamdom">
        <template #thead>
          <vs-tr>
            <vs-th> Código </vs-th>
            <vs-th> Apellidos y Nombres </vs-th>
            <vs-th> Nº Documento </vs-th>
            <vs-th> Tipo Ganador </vs-th>
            <vs-th> Orden </vs-th>
            <vs-th> Nombre Premio </vs-th>
            <vs-th> Fecha </vs-th>
            <vs-th> Teléfono </vs-th>
            <vs-th> Dirección </vs-th>
            <vs-th> Premio </vs-th>
            <vs-th>  </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr
          :key="i"
          v-for="(tr, i) in $vs.getPage(filteredWinners, page, max)"
          :data="tr">
            <vs-td> {{ tr.codigo }} </vs-td>
            <vs-td> {{ tr.aPaterno }} {{ tr.aMaterno }}  {{ tr.nombres }}  </vs-td>
            <vs-td> {{ tr.nroDocumento }} </vs-td>
            <vs-td> {{ tr.estadoTipoGanador }} </vs-td>
            <vs-td> {{ tr.orden }} </vs-td>
            <vs-td> {{ tr.premio }} </vs-td>
            <vs-td> {{ tr.fechaEntrega }} </vs-td>
            <vs-td> {{ tr.celular || '-' }} </vs-td>
            <vs-td> {{ tr.direccion }} </vs-td>
            <vs-td>
              <vs-button v-if="tr.estadoEntrega === 1" flat v-on:click="handleWinnerModal(tr)">Recoger</vs-button>
              <vs-button v-if="tr.estadoEntrega === 2" flat disabled>Entregado</vs-button>
            </vs-td>
            <vs-td>
              <vs-button danger @click="handleRemoveWinner(tr)">
                <i class="fa-solid fa-trash"></i>
              </vs-button>
            </vs-td>
          </vs-tr>
        </template>
        <template #notFound>
          No se encontraron resultados
        </template>
        <template #footer>
          <vs-pagination v-model="page" :length="$vs.getLength(filteredWinners, max)" />
        </template>
      </vs-table>
    </template>

    <br />
    <ModalWinner
    :showModal="showDialogWinner && !showDialogRepresentative"
    :winner="{ ...winner, selectedAward }"
    @onConfirmButton="(showDialogRepresentative = true)
    "
    ></ModalWinner>

    <ModalRepresentative
    v-if="showDialogRepresentative"
    :showModal="showDialogRepresentative"
    :isCreated="isCreated"
    :winner="{ ...winner, ...selectedAward, ...selectedEvent }"
    @closeModal="closeModal"
    ></ModalRepresentative>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { protectedService } from "@/plugins/axios"
import ModalWinner from "@/components/app/ModalWinner";
import ModalRepresentative from "@/components/app/ModalRepresentative";

import WinWheel from "@/components/winwheel";
import optionsData from "@/assets/js/wheel_data.js";

export default {
  layout: "layout_app",
  components: {
    WinWheel,
    ModalWinner,
    ModalRepresentative,
  },
  head() {
    return {
      title: "Sorteos", // Other meta information
    };
  },
  watch: {
    gamesDetail([data]) {
      this.form.event = data.idEvento
    }
  },
  computed: {
    ...mapGetters(['getIdUser']),
    awards() {
      return this.$store.getters['award/awards']
    },
    winners() {
      return this.$store.getters['winner/winners']
    },
    filteredWinners() {
      const { award } = this.form;
      const winnersData = this.winners.data?.data || []
      return award ? winnersData.filter(x => x.idPremio === award) : winnersData
    },
    gamesDetail() {
      return this.$store.getters['gameDetail/gamesDetail']
    },
    disabledButtonPress() {
      return !(this.form.event != '' && this.form.award != '') || this.isLoading
    },
    selectedEvent() {
      return this.gamesDetail.find(evt => evt.idEvento === this.form.event) || {}
    },
    selectedAward() {
      return this.awards.find(award => award.idPremio === this.form.award) || {}
    }
  },
  data() {
    return {
      isLoading: false,
      keyRamdom: Math.random(),
      isCreated: false,
      winner: {},
      showDialogWinner: false,
      showDialogRepresentative: false,
      isTweenMaxLoaded: false,
      value: "",
      options: {},
      page: 1,
      max: 50,
      form: {
        event: '',
        award: '',
      }
    };
  },
  fetch({ store }) {
    store.dispatch('gameDetail/initialize')
    store.dispatch('award/initialize')
    store.dispatch('winner/initialize')
  },
  created() {
    this.options = JSON.parse(JSON.stringify(optionsData))
  },
  methods: {
    onButtonPress() {
      const url = `/eventos/sortear-participantes/${this.form.award}`
      const method = "get"
      return protectedService({
        method,
        url,
      }).then(resp => {

        // console.log("res", resp.data);
        if(resp.data.msg !== 'Los Premios Fueron agotados') {
          const { data } = resp.data
          this.winner = data
          this.isCreated = true
          this.isLoading = true
        } else {
          this.$swal({
            html:
              `<img class="small_icon" src="${require("@/static/icon_warning.svg")}"><p class="popup-content-text">${
                resp.data.msg
              }</p>`,
              customClass: {
                popup: "popup-giveaways",
                confirmButton: "popup-btn-confirm",
              },
            confirmButtonColor: "#eb5757",
            showConfirmButton: true,
          })
        }
      })
      .catch(() => {
        console.error('Ocurrio un error con el servicio.')
      })
    },
    onResult({ win, msg, spinCount }) {
      if(Object.keys(this.winner).length) this.showDialogWinner = win;
    },
    handleWinnerModal(row) {
      this.winner = row
      this.isCreated = false
      this.showDialogRepresentative = true
    },
    handleRemoveWinner(row) {
      // this.$swal({
      //   html:
      //     `<img class="small_icon" src="${require("@/static/icon_warning.svg")}"><p class="popup-content-text">¿Desea eliminar el registro?</p>`,
      //   customClass: {
      //     popup: "popup-giveaways",
      //     confirmButton: "popup-btn-confirm",
      //     cancelButton: "popup-btn-cancel",
      //   },
      //   confirmButtonText: "Eliminar",
      //   confirmButtonColor: "#eb5757",
      //   reverseButtons: true,
      //   showCancelButton: true,
      //   showConfirmButton: true,
      // }).then((result) => {
      //   if (result.value) {
      //     this.serviceDeleteItem(row)
      //   }
      // })
        this.$swal({
            html: `
              <img class="small_icon" src="${require("@/static/icon_warning.svg")}">
              <p class="popup-content-text">¿Desea eliminar el registro?</p>
              <div class="mb-6 flex flex-col text-area">
                  <textarea class="vs-input area"id="idSustento" placeholder="Ingrese sustento para eliminar"  style="width: 100%; height: 150px; transition: border 0.3s;"></textarea>
                </div>
            `,
            customClass: {
              popup: "popup-giveaways",
              confirmButton: "popup-btn-confirm",
              cancelButton: "popup-btn-cancel",
            },
            confirmButtonText: "Eliminar",
            confirmButtonColor: "#eb5757",
            reverseButtons: true,
            showCancelButton: true,
            showConfirmButton: true,
          }).then((result) => {
            if (result.value) {
              const textarea = document.getElementById('idSustento');
              const sustento = textarea.value.trim();
              if (sustento === '' || sustento.length < 4) {
                this.$swal({
                  title: 'Error',
                  text: 'Por favor, ingrese un sustento antes de eliminar el registro.',
                  icon: 'error',
                });
              } else {
                this.serviceDeleteItem(row, sustento);
              }
            }
          });
    },

    serviceDeleteItem(row, sustento) {
      const {
        idParticipante,
        idGanador,
        fechaEntrega,
        comentario,
      } = row

      const url = `/eventos/update-ganador/${idGanador}/${idParticipante}`
      const method = "put"

      const payload = {
        "idUsuario": this.getIdUser,
        "fecha": fechaEntrega,
        "flag": 0,
        "estadoEntrega": 0,
        "sustento": sustento,
        comentario,
      }

      protectedService({
        method,
        url,
        data: payload
      }).then(async resp => {
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
        await this.$store.dispatch('winner/initialize')
        this.keyRamdom = Math.random()
      })
      .catch(() => {
        console.error('Ocurrio un error con el servicio.')
      })
    },
    async closeModal(reload) {
      if(reload) {
        this.showDialogWinner = false
        this.isLoading = false
        // this.form.award = ''
        await this.$store.dispatch('winner/initialize')
        this.keyRamdom = Math.random()
      }
      this.showDialogRepresentative = false
    }
  }
}
</script>
<style lang="scss" scoped>
.win-wheel {
  min-height: 500px;
}
</style>
