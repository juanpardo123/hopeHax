const ctx = document.getElementById('myChart');
  const ctx2 = document.getElementById('lineGraph');
  let data = document.getElementById('calories').innerText;
  let data2 = document.getElementById('target').innerText;
  let data3 = document.getElementById('remaining').innerText;

  new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
    'Calories Consumed',
    'Calories Remaining',
  ],
      datasets: [{
        label: 'Calories',
        data: [data, data3],
        borderWidth: 1
      }],
      backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)'
    ],
    hoverOffset: 4
    },
    options: {
        legend: {
            labels: {
                position: 'bottom',
                fontColor: 'orange' // Change the label color to orange
            }
        }
    }
  });

  let totalCarbs = document.getElementById('totalCarbs').innerText;
  let totalProtein = document.getElementById('totalProtein').innerText;
  let totalFats = document.getElementById('totalFats').innerText;

  new Chart(ctx2, {
    type: 'polarArea',
    data: {
        labels: [
    'Protein',
    'Carbs',
    'fats'
  ],
      datasets: [{
       
        
        data: [totalCarbs, totalCarbs,totalFats],
        borderWidth: 1
      }],
      backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(75, 192, 192)',
      'rgb(255, 205, 86)',
      'rgb(201, 203, 207)',
      'rgb(54, 162, 235)'
    ],
    hoverOffset: 4
    },
    options: {
  }
  });