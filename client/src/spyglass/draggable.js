function draggable(element, handle) {
  let selected = element;
  let mousePositionX = null;
  let mousePositionY = null; // Stores x & y coordinates of the mouse pointer
  let elementPositionX = null;
  let elementPositionY = null; // Stores top, left values (edge) of the element

  handle.addEventListener('mousedown', startDragging);

  function startDragging(event) {
    console.log('START DRAGGING: ', event.clientX, ' ', event.clientY);
    console.log('SELECTED: ', selected);
    // event = event || window.event;
    // event.preventDefault();
    elementPositionX = event.clientX;
    elementPositionY = event.clientY;

    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('mousemove', drag);
  }

  function drag(event) {
    // console.log('START DRAGGING: ', event.clientX, ' ', event.clientY);
    // event = event || window.event;
    // event.preventDefault();
    // calculate the new cursor position:
    // mousePositionX = elementPositionX - event.clientX;
    // mousePositionY = elementPositionY - event.clientY;
    mousePositionX = event.clientX;
    mousePositionY = event.clientY;
    // elementPositionX = event.clientX;
    // elementPositionY = event.clientY;
    // console.log('EVENT X/Y: ', event.clientX, ' ', event.clientY);
    console.log('MOUSE X/Y: ', mousePositionX, ' ', mousePositionY);
    console.log('ELEMENT X/Y: ', elementPositionX, ' ', elementPositionY);

    selected.style.left = mousePositionX - elementPositionX + 'px';
    selected.style.top = mousePositionY - elementPositionY + 'px';
  }

  function stopDragging() {
    // selected = null;
    // elementPositionX = mousePositionX;
    // elementPositionY = mousePositionY;
    console.log('STOP DRAGGING: ', mousePositionX, ' ', elementPositionX);
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
  }
}

export default draggable;
