document.getElementById('save').addEventListener('click', () => {
  chrome.tabs.query({}, (tabs) => {
    let tabData = tabs.map(tab => ({
      url: tab.url,
      title: tab.title
    }));
    let date = new Date();
    let formattedDate = date.toLocaleDateString('pt-BR');
    let filename = prompt('Digite o nome do arquivo:', 'tabs') + `_${formattedDate}.json`;
    let data = {
      date: formattedDate,
      tabs: tabData
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
        let tabsContainer = document.getElementById('tabsContainer');
        let confirmRestoreButton = document.getElementById('confirmRestore');
        
        tabsContainer.innerHTML = '';
        data.tabs.forEach((tab, index) => {
          let checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = `tab${index}`;
          checkbox.value = tab.url;
          checkbox.checked = false;

          let label = document.createElement('label');
          label.htmlFor = `tab${index}`;
          label.textContent = tab.title;

          let div = document.createElement('div');
          div.appendChild(checkbox);
          div.appendChild(label);

          tabsContainer.appendChild(div);
        });

        tabsContainer.style.display = 'block';
        confirmRestoreButton.style.display = 'block';
        
        confirmRestoreButton.onclick = () => {
          let selectedUrls = [];
          data.tabs.forEach((tab, index) => {
            let checkbox = document.getElementById(`tab${index}`);
            if (checkbox.checked) {
              selectedUrls.push(tab.url);
            }
          });

          selectedUrls.forEach((url) => {
            chrome.tabs.create({ url: url });
          });
          
          alert('Selected tabs have been restored.');
          
          tabsContainer.style.display = 'none';
          confirmRestoreButton.style.display = 'none';
        };
      };
      reader.readAsText(file);
    }
  };
  input.click();
});