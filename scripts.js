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