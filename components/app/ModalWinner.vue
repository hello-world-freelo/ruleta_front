<template>
  <vs-dialog class="custom-dialog" width="450px" not-center not-close :value="showModal" @close="closeModal">
    <template #header>
      <h4 class="not-margin">
        ¡Felicidades <b>{{ $firstCapitalLetter(winner.nombres) }} {{ $firstCapitalLetter(winner.aMaterno) }} {{ $firstCapitalLetter(winner.aPaterno) }}</b>!
      </h4>
      <hr>
      <h4>Nº DOCUMENTO: <b>{{ $firstCapitalLetter(winner.nroDocumento) }}</b></h4>
      <h4>CÓDIGO: <b>{{ $firstCapitalLetter(winner.codigo) }}</b></h4>
    </template>

    <div class="con-content">
      <p class="text-win">
        Eres el afortunado ganador del premio <span>{{ winner.selectedAward.nombre }}</span>
        en nuestra emocionante ruleta.
        La persona que recibirá el premio esta presente
      </p>
    </div>

    <template #footer>
      <div class="con-footer">
        <vs-button @click="onConfirmButton" >
          CONFIRMAR
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>
<script>
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    winner: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    onConfirmButton() {
      this.$emit('onConfirmButton', true)
    },

    closeModal() {
      this.$emit('closeModal', true)
    }
  }
}
</script>
<style lang="scss" scoped>
.con-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .vs-button {
    margin: 0px;

    .vs-button__content {
      padding: 10px 30px;
    }

    ~ .vs-button {
      margin-left: 10px;
    }
  }
}

.not-margin {
  margin: 0px;
  font-weight: normal;
  padding: 10px;
  padding-bottom: 0px;
}

.con-content {
  width: 100%;

  p {
    font-size: 15px;
    padding: 0px 10px;
    line-height: 1.3;
    font-weight: 400;
    span {
      color: #E81D62;
      font-weight: bold;
    }
  }

  .vs-checkbox-label {
    font-size: 0.8rem;
  }

  .vs-input-parent {
    width: 100%;

    .vs-input-content {
      margin: 10px 0px;
      width: calc(100%);

      .vs-input {
        width: 100%;
      }
    }
  }
}

.footer-dialog {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: calc(100%);

  .new {
    margin: 0px;
    margin-top: 20px;
    padding: 0px;
    font-size: 0.7rem;

    a {
      color: getColor('primary') !important;
      margin-left: 6px;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .vs-button {
    margin: 0px;
  }
}
</style>
