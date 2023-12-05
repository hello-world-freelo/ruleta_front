<template>
  <div>
    <div>
      <h2 class="text-xl font-medium">Participantes</h2>
      <div class="my-4">
        <!-- <vs-button style="--vs-button-margin: 0" @click="showModal=true">
          Crear participante
        </vs-button> -->
      </div>
    </div>
    <template>
      <div class="center" v-if="participants.data?.data.length">
        <!-- <pre>{{ participants.data.data }}</pre> -->
        <vs-table>
          <template #header>
            <vs-input v-model="search" border placeholder="Buscar participante" />
          </template>
          <template #thead>
            <vs-tr>
              <vs-th> Nombre </vs-th>
              <!-- <vs-th> Tipo de documento </vs-th> -->
              <vs-th> Numero de documento </vs-th>
              <!-- <vs-th> Razón social </vs-th> -->
              <vs-th> Dirección </vs-th>
              <vs-th> Celular </vs-th>
              <!-- <vs-th> Correo </vs-th> -->
            </vs-tr>
          </template>
          <template #tbody v-if="participants.data?.data.length">
            <vs-tr
              :key="i"
              v-for="(tr, i) in $vs.getPage($vs.getSearch(participants.data?.data, search), page, max)"
              :data="tr"
            >
              <vs-td style="width: 25%;">
                {{ tr.nombres }}
              </vs-td>
              <!-- <vs-td>
                {{ tr.idTipoDoc }}
              </vs-td> -->
              <vs-td style="width: 20%;">
                {{ tr.nroDocumento || '-' }}
              </vs-td>
              <!-- <vs-td>
                {{ tr.rsocial || '-' }}
              </vs-td> -->
              <vs-td>
                {{ tr.direccion }}
              </vs-td>
              <vs-td style="width: 20%;">
                {{ tr.celular || '-' }}
              </vs-td>
              <!-- <vs-td>
                {{ tr.correo || '-' }}
              </vs-td> -->
            </vs-tr>
          </template>
          <template #footer>
            <vs-pagination v-model="page" :length="$vs.getLength($vs.getSearch(participants.data?.data, search), max)" />
          </template>
          <template #notFound>
            No se encontraron resultados
          </template>
        </vs-table>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  layout: "layout_app",
  data() {
    return {
      showModal: false,
      search: '',
      page: 1,
      max: 50
    };
  },
  fetch({ store }) {
    store.dispatch('participant/initialize')
  },
  computed: {
    totalPages() {
      return this.participants?.totalPaginas
    },
    participants() {
      return this.$store.getters['participant/participants']
    },
  },
};
</script>
