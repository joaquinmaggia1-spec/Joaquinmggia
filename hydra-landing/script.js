(function () {
  var base = ["♠", "♥", "♦", "♣", "★", "7", "◆", "◇", "♠", "♦"];
  var host = document.getElementById("glyphs");
  var html = "";
  for (var i = 0; i < 90; i++) {
    html += "<span>" + base[i % base.length] + "</span>";
  }
  host.innerHTML = html;
})();
