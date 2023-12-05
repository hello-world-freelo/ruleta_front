<template>
  <div>
    <h2 class="text-xl font-medium my-4">Ganadores</h2>
    <vs-table v-if="winners.data?.data">
      <template #thead>
        <vs-tr>
          <vs-th> Nombre </vs-th>
            <vs-th> Nombre Premio </vs-th>
            <vs-th> Fecha </vs-th>
            <vs-th> Teléfono </vs-th>
            <vs-th> Dirección </vs-th>
            <!-- <vs-th> Premio </vs-th> -->
            <vs-th>  </vs-th>
        </vs-tr>
      </template>
      <template #tbody>
        <vs-tr
          :key="i"
          v-for="(tr, i) in $vs.getPage(winners.data?.data, page, max)"
          :data="tr"
        >
        <vs-td> {{ tr.nombres }} </vs-td>
        <vs-td> {{ tr.premio }} </vs-td>
        <vs-td> {{ tr.fechaEntrega }} </vs-td>
        <vs-td> {{ tr.celular || '-' }} </vs-td>
        <vs-td> {{ tr.direccion }} </vs-td>
        <!-- <vs-td>
          <vs-button flat disabled>{{tr.estadoEntrega === 2 ? 'Entregado' : 'No entregado'}}</vs-button>
         </vs-td> -->

        </vs-tr>
      </template>
      <template #notFound>
        No se encontraron resultados
      </template>
      <template #footer>
        <vs-pagination v-model="page" :length="$vs.getLength(winners.data?.data, max)" />
      </template>
    </vs-table>
  </div>
</template>
<script>
export default {
  layout: "layout_app",
  data() {
    return {
      page: 1,
      max: 50
    }
  },
  fetch({ store }) {
    store.dispatch('winner/initialize')
  },
  computed: {
    winners() {
      return this.$store.getters['winner/winners']
    },
  }
};
</script>
