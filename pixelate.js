//////////////////////////////////////////////////////////////////////////
// This code provides a simple webpage where users can upload an image,
//   and upon selection, the JavaScript function pixelateImage() is called
//   to change the color of 5 random pixels in each line of the image.
// The resulting pixelated image is displayed in the placeholder.
// Note: this pixelation is made for demonstration purposes
//       and might not be suitable for all use cases.
//////////////////////////////////////////////////////////////////////////

// Load the chosen file and activate pixelation
function handleFile() {
    const input = document.getElementById('fileInput');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const pixelsCount = document.getElementById('pixelsCount').value;
    const pixelatingMethod = document.getElementById('pixelatingMethod').value;
    const pixelatingArea = document.getElementById('pixelatingArea').value;

    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                // Draw image on canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                
                // Pixelate the image on canvas
                pixelateImage(ctx, canvas.width, canvas.height, pixelsCount, pixelatingMethod, pixelatingArea);
                
                // Display the pixelated image in result-placeholder
                resultPlaceholder.innerHTML = '';
                resultPlaceholder.appendChild(canvas);
            };
        };
        
        reader.readAsDataURL(file);
    }
}

//////////////////////////////////////
// Pixel manipulation functions

// Verify recieved RGB value is valid
function verify_valid_RGB(number) {
  if (number < 0 || number > 255) {
    throw new Error("Invalid input. Number must be between 0 and 255.");
  }
}

function black_all_pixels(number) {
    return 0;
}

function white_all_pixels(number) {
    return 255;
}

function randomize_pixel_color(startIndex) {
    return Math.floor(Math.random() * 256);
}

function black_white_pixel_values(number) {
  verify_valid_RGB(number);
  if (number > 150) {
    return 255;
  }
  return 0;
}

function complement_pixel_values(number) {
  verify_valid_RGB(number);
  return 255 - number;
}

function change_pixel_values_by_range(number) {
  verify_valid_RGB(number);
  if (number > 200) {
    return number - 25;
  }
  if (number > 160) {
    return number + 45;
  }
  if (number > 120) {
    return number + 35;
  }
  if (number > 80) {
    return number - 30;
  }
  if (number > 40) {
    return number - 25;
  }
  return number + 200;
}

// Fade RGB values in more delicate way
function stonewash_pixels(number) {
  verify_valid_RGB(number);
  if (number > 150) {
    return 220;
  }
  return 30;
}

// Version 2
function stonewash_pixels_2(number) {
  verify_valid_RGB(number);
  if (number > 130) {
    return 200;
  }
  return 50;
}

// Version 3
function stonewash_pixels_3(number) {
  verify_valid_RGB(number);
  if (number > 130) {
    return 170;
  }
  return 80;
}

// The activating function that runs the pixelating-func on each part of RGB value
function activate_pixels_function(func_name, image_data, startIndex) {
    image_data[startIndex] = func_name(image_data[startIndex]);         // manipulate Red
    image_data[startIndex + 1] = func_name(image_data[startIndex + 1]); // manipulate Green
    image_data[startIndex + 2] = func_name(image_data[startIndex + 2]); // manipulate Blue
}

function pixelateImage(ctx, width, height, pixelsCount, pixelatingMethod, pixelatingArea) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const pixelate_functions = [
        stonewash_pixels_3, stonewash_pixels_2, stonewash_pixels, change_pixel_values_by_range,
        complement_pixel_values, black_white_pixel_values, randomize_pixel_color, white_all_pixels, black_all_pixels
    ];
    pixelationFunction = pixelate_functions[pixelatingMethod];
    
    // Loop through the image data, change RGB-values of pixelsCount pixels in each line
    for (let line = 0; line < height; line++) {
        for (let line_pixels = 0; line_pixels < pixelsCount; line_pixels++) {
            // choose random pixel column and calculate its index in the pixels-data
            var randomColumn = Math.floor(Math.random() * width);
            if (pixelatingArea > 0) {
                // change only pixels in the middle of the image
                randomColumn = Math.floor((Math.random() * width / 2) + (width / 4));
                // randomColumn = Math.floor(randomColumn / 2) + (width / 4));    // more efficient
            }
            const startIndex = (line * width + randomColumn) * 4;
            activate_pixels_function(pixelationFunction, data, startIndex);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
