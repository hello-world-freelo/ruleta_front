<template>
  <div>
    <div>
      <h1 class="text-xl font-medium">Juegos</h1>
      <div class="my-4">
        <vs-button style="--vs-button-margin: 0" @click="showModal=true">
          Crear juego
        </vs-button>
      </div>
    </div>
    <template>
      <div class="center" v-if="games.length">
        <vs-table v-model="rowSelected">
          <template #thead>
            <vs-tr>
              <vs-th> Nombre </vs-th>
              <vs-th> Descripción </vs-th>
              <vs-th> Fecha de creación </vs-th>
              <vs-th class="flex justify-center"> Acciones </vs-th>
            </vs-tr>
          </template>
          <template #tbody>
            <vs-tr
              :key="tr.idJuego"
              v-for="(tr) in $vs.getPage(games, page, max)"
              :data="tr"
              :is-selected="false"
              not-click-selected
              open-expand-only-td
            >
              <vs-td>
                {{ tr.nombre }}
              </vs-td>
              <vs-td>
                {{ tr.descripcion }}
              </vs-td>
              <vs-td>
                {{ $formatDate(tr.created_at, "DD-MM-YYYY") }}
              </vs-td>
              <vs-td>
                <div class="flex justify-center">
                  <vs-button size="small" @click="showModal = true, rowSelected = tr" flat icon>
                    Editar
                  </vs-button>
                  <vs-button @click="deleteElement(tr)" size="small" border danger>
                    Eliminar
                  </vs-button>
                </div>
              </vs-td>


            </vs-tr>
          </template>
          <template #footer>
            <vs-pagination v-model="page" :length="$vs.getLength(games, max)" />
          </template>
          <template #notFound>
            No se encontraron resultados
          </template>
        </vs-table>
      </div>
    </template>

    <ModalGame
    v-if="showModal"
    :item="rowSelected"
    @closeModal="closeModal"/>
  </div>
</template>
<script>
import { protectedService } from "@/plugins/axios"
import ModalGame from "@/components/app/ModalGame"
export default {
  layout: "layout_app",
  components: {
    ModalGame
  },
  data() {
    return {
      rowSelected: null,
      showModal: false,
      page: 1,
      max: 5
    }
  },
  fetch({ store }) {
    store.dispatch('game/initialize')
  },
  computed: {
    games() {
      return this.$store.getters['game/games']
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

    serviceDeleteItem({ idJuego }) {
      protectedService({
        method: "delete",
        url: `/eventos/eliminar-juego/${idJuego}`,
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
      this.$store.dispatch('game/initialize')
    }
  }
}
</script>
