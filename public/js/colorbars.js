var marginY = 0,
    destination = 0,
    speed = 5,
    scroller = null;

  function initScroll(elementId){
    destination = document.getElementById(elementId).offsetTop;
    scroller = setTimeout(function(){
      initScroll(elementId);
    }, 1);
    // marginY = 0;
    marginY = marginY + speed;
    if(marginY >= destination){
      clearTimeout(scroller);
    }
    window.scroll(0,marginY-130);
  }
