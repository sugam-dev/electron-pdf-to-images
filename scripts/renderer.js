  const $form = $('#upload-form');
  const $fileInput = $('#fileInput');
  const $fileError = $('#file-error');
  const $imageContainer = $('#imageContainer');

  $form.on('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission
  
    const file = $fileInput[0].files[0];
  
    // Check if file is selected and is a PDF
    if (!file || file.type !== 'application/pdf') {
      $fileError.text('Please select a PDF file.');
      return;
    }
  
    try {
      const result = await window.electron.extractImages(file.path);
      if (result.success) {
        alert('Images extracted successfully!');
        // Clear previous images
        $imageContainer.empty();
    
        // Append extracted images to the image container
        result.imagePaths.forEach(imagePath => {
            const $img = $('<img>')
                .attr('src', imagePath)
                .addClass('img-fluid d-inline-block'); // Bootstrap classes for responsive and inline display
            
            const $col = $('<div>').addClass('col-4'); // Bootstrap column class
            $col.append($img);
            $imageContainer.append($col);
        });
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while extracting images.');
    }
  
    // Clear error message
    $fileError.text('');
  });
