<template>
  <div>
    <div>
      <h1 class="text-xl font-medium">Detalle Premio</h1>
      <div class="my-4">
        <vs-button style="--vs-button-margin: 0" @click="showModal=true">
          Detalle Premio
        </vs-button>
      </div>
    </div>
    <template>
      <div class="center">
        <vs-table v-model="rowSelected">
          <template #thead>
            <vs-tr>
              <vs-th> Evento </vs-th>
              <vs-th> Juego </vs-th>
              <vs-th> Premio </vs-th>
              <vs-th> Cantidad </vs-th>
              <vs-th class="flex justify-center"> Acciones </vs-th>
            </vs-tr>
          </template>
          <template #tbody>
            <vs-tr
              :key="tr.idPremioDetalleJuego"
              v-for="(tr) in $vs.getPage(premiosDetail, page, max)"
              :data="tr"
              :is-selected="false"
              not-click-selected
              open-expand-only-td
            >
              <vs-td>
                {{ tr.evento }}
              </vs-td>
              <vs-td>
                {{ tr.juego }}
              </vs-td>
              <vs-td>
                {{ tr.premio }}
              </vs-td>
              <vs-td>
                {{ tr.cantidad }}
              </vs-td>

              <vs-td>
                <div class="flex justify-center" >
                  <vs-button size="small" @click="showModal = true, rowSelected = tr" flat icon :disabled="tr.isValidEvento === 0">
                    Editar
                  </vs-button>
                  <vs-button @click="deleteElement(tr)" size="small" border danger :disabled="tr.isValidEvento === 0">
                    Eliminar
                  </vs-button>
                </div>
              </vs-td>


            </vs-tr>
          </template>
          <template #footer>
            <vs-pagination v-model="page" :length="$vs.getLength(premiosDetail, max)" />
          </template>
          <template #notFound>
            No se encontraron resultados
          </template>
        </vs-table>
      </div>
    </template>

    <ModalPremioDetail
    v-if="showModal"
    :item="rowSelected"
    @closeModal="closeModal"/>
  </div>
</template>
<script>
import { protectedService } from "@/plugins/axios"
import ModalPremioDetail from "@/components/app/ModalPremioDetail"
export default {
  layout: "layout_app",
  components: {
    ModalPremioDetail
  },
  data() {
    return {
      rowSelected: null,
      showModal: false,
      page: 1,
      max: 10
    }
  },
  fetch({ store }) {
    store.dispatch('premioDetail/initialize')
  },
  computed: {
    premiosDetail() {
      return this.$store.getters['premioDetail/premiosDetail']
    }
  },
  methods: {

    deleteElement(item) {
      if (item) {
        this.$swal({
          html:
            `<img class="small_icon" src="${require("@/static/icon_warning.svg")}"><p class="popup-content-text">¿Desea eliminar el registro?</p>`,
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
            this.serviceDeleteItem(item)
          }
        })
      }
    },

    serviceDeleteItem({ idPremioDetalleJuego }) {
      protectedService({
        method: "put",
        url: `/eventos/eliminar-detalle-premio/${idPremioDetalleJuego}`,
      }).then(() => {
        this.forceReload()
        this.$swal({
          html: `<img class="small_icon" src="${require("@/static/icon_circle-check-solid.svg")}"><p class="popup-content-text">
            El registro ha sido eliminado.
          </p>`,
          customClass: {
            popup: "popup-giveaways",
            confirmButton: "popup-btn-confirm",
          },
          confirmButtonText: "Aceptar",
        })
      })
    },

    closeModal(reload) {
      this.showModal = false
      this.rowSelected = null
      if(reload) {
        this.forceReload()
      }
    },

    forceReload() {
      this.$store.dispatch('premioDetail/initialize')
    }
  }
}
</script>
