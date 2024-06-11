document.getElementById('save').addEventListener('click', () => {
    chrome.tabs.query({}, (tabs) => {
      let tabUrls = tabs.map(tab => tab.url);
      let date = new Date();
      let formattedDate = date.toLocaleDateString('pt-BR');
      let filename = prompt('Digite o nome do arquivo:', 'tabs') + `_${formattedDate}.json`;
      let data = {
        date: formattedDate,
        tabs: tabUrls
      };
      let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
      let url = URL.createObjectURL(blob);
  
      chrome.downloads.download({
        url: url,
        filename: filename
      });
    });
  });
  
  document.getElementById('restore').addEventListener('click', () => {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (event) => {
      let file = event.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          let data = JSON.parse(e.target.result);
          let confirmRestore = confirm(`Deseja abrir as abas salvas em ${data.date}?`);
          if (confirmRestore) {
            data.tabs.forEach((url) => {
              chrome.tabs.create({ url: url });
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  });  