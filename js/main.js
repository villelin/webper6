const input = document.querySelector('#fileInput');
const reader = new FileReader();
const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

const zoom = document.querySelector('#zoom');
const left_right = document.querySelector('#leftRight');
const up_down = document.querySelector('#upDown');

const image = document.createElement('img');

let image_x = Number(left_right.value);
let image_y = Number(up_down.value);
let image_zoom = Number(zoom.value);

let old_image_x = 0;
let old_image_y = 0;

let mouse_down = false;
let mouse_ref_x = 0;
let mouse_ref_y = 0;

input.addEventListener('change', (evt) => {
  const file = input.files[0];
  reader.readAsDataURL(file);
});

reader.addEventListener('load', (evt) => {
  console.log(reader.result);
  image.src = reader.result;
});

image.addEventListener('load', (evt) => {
  redraw();
});

const redraw = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  const scaled_width = getImageWidth();
  const scaled_height = getImageHeight();
  const x = getImageX();
  const y = getImageY();

  context.drawImage(image, x, y, scaled_width, scaled_height);
};

const getImageX = () => {
  return image_x - (getImageWidth() / 2.0);
};
const getImageY = () => {
  return image_y - (getImageHeight() / 2.0);
};
const getImageWidth = () => {
  return image.width * image_zoom;
};
const getImageHeight = () => {
  return image.height * image_zoom;
}

zoom.addEventListener('input', (evt) => {
  image_zoom = Number(zoom.value);
  redraw();
});

up_down.addEventListener('input', (evt) => {
  image_y = Number(up_down.value);
  redraw();
});

left_right.addEventListener('input', (evt) => {
  image_x = Number(left_right.value);
  redraw();
});

canvas.addEventListener('mousedown', (evt) => {
  const x = getImageX();
  const y = getImageY();
  const width = getImageWidth();
  const height = getImageHeight();

  if (evt.clientX >= x && evt.clientX < (x + width) &&
      evt.clientY >= y && evt.clientY < (y + height)) {
    mouse_down = true;
    mouse_ref_x = evt.clientX;
    mouse_ref_y = evt.clientY;

    old_image_x = image_x;
    old_image_y = image_y;
  }
});

canvas.addEventListener('mouseup', (evt) => {
  mouse_down = false;
});

canvas.addEventListener('mousemove', (evt) => {
  if (mouse_down) {
    image_x = old_image_x + evt.clientX - mouse_ref_x;
    image_y = old_image_y + evt.clientY - mouse_ref_y;
    redraw();
  }
});

canvas.addEventListener('wheel', (evt) => {
  image_zoom += Number(evt.wheelDelta) / 1000.0;
  if (image_zoom < 0.5) {
    image_zoom = 0.5;
  }
  if (image_zoom > 10.0) {
    image_zoom = 10.0;
  }
  redraw();
});