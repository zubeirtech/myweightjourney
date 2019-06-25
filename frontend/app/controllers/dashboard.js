/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
import Controller from '@ember/controller';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({

    toastr: service('toast'),
    media: service(),
    inputClass: 'ui input',
    buttonClass: 'ui inverted blue circular button',

    setup(model) {
        model.forEach(doc => {
            set(doc, 'formatDate', []);
            let dates = doc.dates;
            dates.forEach(d => {
                let f = new Date(d);
                let a = f.getMonth();
                doc.formatDate.pushObject(a);
            });

            set(this, "chartData", {
                labels: doc.formatDate,
                datasets: [
                    {
                        label: "Weight-Progress -  Numbers stand for month",
                        backgroundColor: "rgba(54,162,235,0.2)",
                        borderColor: "rgba(54,162,235,0.8)",
                        data: doc.weights
                    }
                ]
            })
        });
    },

    chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        datasets: [
          {
            label: "Weight-Progress",
            backgroundColor: "rgba(54,162,235,0.2)",
            borderColor: "rgba(54,162,235,0.8)",
            data: []
          }
        ]
    },

    lineOptions: { // ADDED
        scales: {
            yAxes: [{
                display: true,
                ticks: {
                }
            }]
        }
    },

    newWeight: "",
    
    actions: {
        addNewWeight() {
            if(this.newWeight !== "" || NaN(this.newWeight) !== true) {
                this.model.forEach(doc => {
                    doc.weights.pushObject(parseInt(this.newWeight));
                    doc.dates.pushObject(Date.now());
                    set(this, 'inputClass', 'ui disabled input');
                    set(this, 'buttonClass', 'ui inverted blue disable circular button')
                    this.toastr.success('Successfully added new weight', 'Success');
                    doc.save();
                    setTimeout(() => {
                        document.location.reload();
                    }, 1000);
                });
            }else {
                this.toastr.error('Please enter valid number', 'Error');
            }
        }
    }

    
});
