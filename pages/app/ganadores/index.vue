<template>
  <div>
    <h2 class="text-xl font-medium my-4 text-center">Lista de Ganadores</h2>
      <!-- <pre>{{ winners }}</pre> -->
      <vs-button class="mb-2" @click="exportToPdf">Exportar a PDF</vs-button>
    <vs-table v-if="winners.data?.data">
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
            <vs-th> Estado </vs-th>
        </vs-tr>
      </template>
      <template #tbody>
        <vs-tr
          :key="i"
          v-for="(tr, i) in $vs.getPage(winners.data?.data, page, max)"
          :data="tr"
        >
            <vs-td> {{ tr.codigo }} </vs-td>
            <vs-td> {{ tr.aPaterno }} {{ tr.aMaterno }}  {{ tr.nombres }}  </vs-td>
            <vs-td> {{ tr.nroDocumento }} </vs-td>
            <vs-td> 
              <span  v-if="tr.tipoGanador === 1" class="tipo-titular"> {{ tr.estadoTipoGanador }} </span> 
              <span  v-if="tr.tipoGanador === 2" class="tipo-accesitario"> {{ tr.estadoTipoGanador }} </span> 
             </vs-td>
            <vs-td> {{ tr.orden }} </vs-td>
            <vs-td> {{ tr.premio }} </vs-td>
            <vs-td> {{ tr.fechaEntrega }} </vs-td>
            <vs-td> {{ tr.celular || '-' }} </vs-td>
            <vs-td> {{ tr.direccion }} </vs-td>
            <vs-td>
              {{tr.estadoEntrega === 2 ? 'ENTREGADO' : 'POR ENTREGAR'}}
            </vs-td>

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
import { protectedService } from "@/plugins/axios"
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
  },
  methods: {
    exportToPdf(){
      let idPremio = 0;
     const url = `/eventos/generar-pdf/${idPremio}`
      const method = "get"
      return protectedService({
    method,
    url,
    responseType: 'arraybuffer', // Para manejar la respuesta como un array de bytes (Blob)
  })
    .then(response => {
      // Crear un Blob a partir de la respuesta
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Crear una URL de datos para el Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Crear un enlace temporal y hacer clic en él para iniciar la descarga
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'archivo.pdf';
      link.click();

      // Liberar la URL de datos después de un tiempo para evitar pérdida de memoria
      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    })
    .catch(() => {
      console.error('Ocurrió un error con el servicio.');
    });
    }
  }

};
</script>
<style lang="scss" scoped>
.tipo-accesitario{
  display: inline-block; width: 100%;
  text-align: center;
  padding: 5px;
  background-color: #d1cd4af7;
  color: white;
  border-radius: 5%;
  font-weight: bold;
}
.tipo-titular{
  display: inline-block; width: 100%;
  text-align: center;
  padding: 5px;
  background-color: #5b9f60;
  color: white;
  border-radius: 5%;
  font-weight: bold;
}
</style>
