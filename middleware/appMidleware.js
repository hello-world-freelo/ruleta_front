export default function({ store, redirect, route }) {
  if (!store.state.token) { // no tiene token
    redirect('/iniciar-sesion')
  }
}
