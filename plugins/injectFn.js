import * as moment from 'moment'
moment.locale('es')

export default (context, inject) => {


    /******MOMENT*******/

    const formatDate = (date, format = "DD/MM/YYYY") => {
        return moment(date).format(format)
    }

    const diffDate = (date, type) => {
        let a = moment(date),
            b = moment()
            b.hour(0);
            b.minute(0);
            b.second(0);
            b.millisecond(0);
        return a.diff(b, type)
    }

    const diffDateNow = (date, type) => {
        let a = moment(date),
            b = moment()
        return a.diff(b, type)
    }

    const dateDiffInDays = (date, date2, type) => {
        let a = moment(date),
            b = moment(date2)
        return a.diff(b, type)
    }


    /*******CURRENCY******/

    const formatCurrency = (number, symbol = "PEN") => {
        if (isNaN(number)) number = 0
        return `${parseFloat(number)
          .toFixed(2)
          .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} ${symbol}`
    }

    const firstCapitalLetter =  (str) =>  {
      const parseStr = String(str).toLowerCase()
        return parseStr.charAt(0).toUpperCase() + parseStr.slice(1)
    }

    inject('formatDate', formatDate)

    inject('diffDate', diffDate)

    inject('diffDateNow', diffDateNow)

    inject('dateDiffInDays', dateDiffInDays)

    inject('formatCurrency', formatCurrency)

    inject('firstCapitalLetter', firstCapitalLetter)
}
