import Swal from 'sweetalert2'

class VueSweetalert2 {
  static install(vue, options = {}) {
    const swalLocalInstance = Swal.mixin(options)

    const swalFunction = function (...args) {
      return swalLocalInstance.fire.call(swalLocalInstance, ...args)
    }

    Object.assign(swalFunction, Swal)

    Object.keys(Swal)
      .filter(key => typeof Swal[key] === 'function')
      .forEach(methodName => {
        swalFunction[methodName] = swalLocalInstance[methodName].bind(swalLocalInstance)
      })


    // add the instance method
    if (!Object.prototype.hasOwnProperty.call(vue, '$swal')) {
      vue.$swal = swalFunction
    }
  }
}

export default ({ app }, inject) => {

  if (!app) {
    console.error('Vue instance not found. Unable to install plugin.')
    return
  }

  const options = {
    customClass: {
      popup: "popup-giveaways",
      confirmButton: "popup-btn-confirm",
    },
    reverseButtons: true,
  }

  VueSweetalert2.install(app, {
    ...options
  })

  inject('swal', app.$swal)
}
