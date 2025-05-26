// Script para controle de coleta
const form = document.getElementById('coletaForm');
const lista = document.getElementById('listaColetas');
const graficoCanvas = document.getElementById('graficoColetas');
let coletas = JSON.parse(localStorage.getItem('coletas')) || [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const tipo = document.getElementById('tipo').value;
  const enderecoExtra = document.getElementById('enderecoExtra').value;
  const quantidade = parseFloat(document.getElementById('quantidade').value);

  if (!tipo || isNaN(quantidade)) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  const local = enderecoExtra.trim() !== '' ? enderecoExtra : 'Sede da empresa';

  const coleta = { tipo, local, quantidade };
  coletas.push(coleta);
  localStorage.setItem('coletas', JSON.stringify(coletas));

  form.reset();
  atualizarLista();
  atualizarGrafico();
});

function atualizarLista() {
  lista.innerHTML = '';

  coletas.forEach((coleta) => {
    const li = document.createElement('li');
    li.className = 'p-2 bg-green-100 rounded mb-2';
    li.textContent = `${coleta.tipo} | Local: ${coleta.local} | Quantidade: ${coleta.quantidade} kg`;
    lista.appendChild(li);
  });
}

function atualizarGrafico() {
  const dados = { Tampinhas: 0, Lacres: 0 };

  coletas.forEach((coleta) => {
    if (coleta.tipo in dados) {
      dados[coleta.tipo] += coleta.quantidade;
    }
  });

  const data = {
    labels: Object.keys(dados),
    datasets: [{
      label: 'Quantidade (kg)',
      data: Object.values(dados),
      backgroundColor: ['#34d399', '#60a5fa'],
    }],
  };

  if (window.graficoInstance) {
    window.graficoInstance.data = data;
    window.graficoInstance.update();
  } else {
    window.graficoInstance = new Chart(graficoCanvas, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return value + ' kg';
              },
            },
          },
        },
      },
    });
  }
}

atualizarLista();
atualizarGrafico();

