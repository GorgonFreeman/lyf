const forms = Array.from(document.querySelectorAll('form'));

forms.forEach(form => {

  const { action, method, enctype } = form;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(form);

    let headers = {};
    let body;

    switch (enctype) {
      case 'multipart/form-data':
        body = formData;
        break;
      case 'application/x-www-form-urlencoded':
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        body = new URLSearchParams(formData);
        break;
      default:
        console.log(`What's a ${ enctype }?`);
        return false;
    }

    try {
      const result = await fetch(action, {
        method,
        headers,
        body,
      });

      const data = await result.json();
      console.log(data);

      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  });

});

const addEventListeners = (el, eventsArray, handler) => {
  eventsArray.forEach(eventName => {
    el.addEventListener(eventName, handler);
  });
};

class FileDropzone extends HTMLElement {
  constructor() {
    super();
    
    this.files = [];
    
    // Inject HTML
    this.render();
    
    // Set up refs
    this.dropzone = this;
    this.input = this.querySelector('input[type="file"]');
    this.display = this.querySelector('.file_dropzone_display');
    this.clearButton = this.querySelector('.file_dropzone_clear_button');
    
    console.log(this.input);
    console.log(this.input.files);
    
    this.updateDisplay();

    // Set up event listeners
    this.listen();
  }
  
  render() {
    const multiple = this.getAttribute('multiple');
    const required = this.getAttribute('required');
    const name = this.getAttribute('name');
    const id = this.dataset['id'];
    const accept = this.getAttribute('accept');
    const capture = this.getAttribute('capture');
    
    const attrsFromParent = {
      ...(multiple !== null) && { multiple },
      ...(required !== null) && { required },
      ...name && { name },
      ...id && { id },
      ...(accept !== null) && { accept },
      ...(capture !== null) && { capture },
    };
    
    const attrsFromParentString = Object.entries(attrsFromParent).map(([k,v]) => `${ k }="${ v }"`).join(' ');
    
    this.innerHTML = `
      <input type="file" ${ attrsFromParentString }>
      <span class="file_dropzone_display" aria-live="polite"></span>
      <button class="file_dropzone_clear_button ${ this.files.length ? '_show' : '' }" aria-label="Clear selected files">X</button>
    `;
  }
  
  updateDisplay() {
    const { display, input, clearButton } = this;
    const { files } = input;
    console.log('files', files);
     
    let message;
    switch (files.length) {
      case 0: 
        message = 'Choose files'
        break;
      case 1: 
        const filename = input.value.split('\\').pop();
        message = filename;
        break;
      default:
        message = `${ files.length } files`;
    }
    
    console.log('message', message);
    display.innerHTML = message;
    
    clearButton.classList.toggle('_show', files.length);
  }
  
  listen() {
    
    const { dropzone, input, clearButton } = this;
    
    console.log(dropzone);
    
    addEventListeners(dropzone, [
      'dragenter', 
      'focus', 
      'click',
    ], e => dropzone.classList.add('_active'));
    
    addEventListeners(dropzone, [
      'dragleave', 
      'blur', 
      'drop',
    ], e => dropzone.classList.remove('_active'));
    
    input.addEventListener('change', e => {
      this.files = input.files;
      this.updateDisplay();
    });
    
    clearButton.addEventListener('click', e => {
      input.value = null;
      input.dispatchEvent(new Event('change'));
    });
  }
}

// Define the custom element
customElements.define('file-dropzone', FileDropzone);