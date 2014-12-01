var onPageLoad = function () {
	Caman('#beach', function () {
    this.brightness(10);
    this.contrast(30);
    this.sepia(60);
    this.saturation(-30);
    this.render();
  });
};
window.onload = onPageLoad;